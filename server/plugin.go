package main

import (
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mattermost/mattermost-server/v5/plugin"
	"github.com/pkg/errors"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type SamplePlugin struct {
	plugin.MattermostPlugin

	botUserID string

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

func (p *SamplePlugin) OnActivate() error {
	// Botの登録
	bot := &model.Bot{
		Username:    "test-bot",
		DisplayName: "Sample Bot",
	}
	botUserID, appErr := p.Helpers.EnsureBot(bot)
	if appErr != nil {
		return errors.Wrap(appErr, "failed to ensure bot user")
	}
	p.botUserID = botUserID

	// Slash Commandの登録
	if err := p.API.RegisterCommand(&model.Command{
		Trigger:      "sample",
		AutoComplete: true,
	}); err != nil {
		return errors.Wrap(err, "failed to register  command")
	}

	return nil
}

func (p *SamplePlugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	return &model.CommandResponse{Text: "Hello by plugin"}, nil
}

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *SamplePlugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, world!")
}

func (p *SamplePlugin) UserHasBeenCreated(c *plugin.Context, user *model.User) {
	channel, appErr := p.API.GetDirectChannel(p.botUserID, user.Id)
	if appErr != nil {
		p.API.LogWarn("failed to get direct channel", "user_id1", p.botUserID, "user_id2", user.Id, "details", appErr.Error())
		return
	}
	if _, appErr := p.API.CreatePost(&model.Post{
		ChannelId: channel.Id,
		UserId:    p.botUserID,
		Message:   "Welcome to our Mattermost!",
	}); appErr != nil {
		p.API.LogWarn("failed to create welcome post.", "channel_id", channel.Id, "details", appErr.Error())
	}
}

func (p *SamplePlugin) UserWillLogIn(c *plugin.Context, user *model.User) string {
	if err := p.check(); err != nil {
		return err.Error()
	}
	return ""
}

func (p *SamplePlugin) check() error {
	return nil // fmt.Errorf("hogehoge")
}

func (p *SamplePlugin) UserHasLoggedIn(c *plugin.Context, user *model.User) {
	status, appErr := p.API.GetUserStatus(user.Id)
	if appErr != nil {
		p.API.LogWarn("failed to get user status", "user_id", user.Id, "details", appErr.Error())
		return
	}
	t := time.Unix(status.LastActivityAt/1000, status.LastActivityAt%1000)
	if status.Status == model.STATUS_OFFLINE && time.Now().After(t.AddDate(0, 0, 7)) {
		channel, appErr := p.API.GetDirectChannel(p.botUserID, user.Id)
		if appErr != nil {
			p.API.LogWarn("failed to get direct channel", "user_id1", p.botUserID, "user_id2", user.Id, "details", appErr.Error())
			return
		}
		if _, appErr := p.API.CreatePost(&model.Post{
			ChannelId: channel.Id,
			UserId:    p.botUserID,
			Message:   "Hi! :wave:",
		}); appErr != nil {
			p.API.LogWarn("failed to create post.", "channel_id", channel.Id, "details", appErr.Error())
		}
	}
}

func (p *SamplePlugin) MessageWillBePosted(c *plugin.Context, post *model.Post) (*model.Post, string) {
	if strings.Contains(post.Message, "shit") || strings.Contains(post.Message, "💩") {
		return nil, "You can't use 💩 on this server."
	}
	return nil, ""
}

func (p *SamplePlugin) MessageHasBeenPosted(c *plugin.Context, post *model.Post) {
	postUrl := fmt.Sprintf("http://localhost:8065/_redirect/pl/%s", post.Id)
	if strings.Contains(post.Message, "mattermost") && post.UserId != p.botUserID {
		p.API.CreatePost(&model.Post{
			Message:   fmt.Sprintf("Post refered to `mattermost` is created. See [here](%s) ", postUrl),
			UserId:    p.botUserID,
			ChannelId: "su7w9z51atnspjufg1c73ijx8w",
		})
	}
}

func (p *SamplePlugin) ChannelHasBeenCreated(c *plugin.Context, channel *model.Channel) {
	if channel.Type != model.CHANNEL_OPEN {
		return
	}

	u, appErr := p.API.GetUser(channel.CreatorId)
	if appErr != nil {
		p.API.LogError("Failed to get user", "details", appErr)
		return
	}
	townSquare, appErr := p.API.GetChannelByName(channel.TeamId, model.DEFAULT_CHANNEL, false)
	if appErr != nil {
		p.API.LogError("Failed to get channel", "details", appErr)
		return
	}

	if _, appErr := p.API.CreatePost(&model.Post{
		Type:      model.POST_DEFAULT,
		ChannelId: townSquare.Id,
		UserId:    p.botUserID,
		Message:   fmt.Sprintf("Channel ~%s has been created by %s.", channel.Name, u.GetDisplayName(model.SHOW_USERNAME)),
	}); appErr != nil {
		p.API.LogError("Failed to create post", "details", appErr)
	}
}

// See https://developers.mattermost.com/extend/plugins/server/reference/
