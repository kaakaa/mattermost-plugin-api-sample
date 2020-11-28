package main

import (
	"fmt"
	"net/http"
	"sync"

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

// See https://developers.mattermost.com/extend/plugins/server/reference/
