import manifest from './manifest';

import {openRootModal, createPluginPost} from './actions';
import reducer from './reducer';
import Root from './components/root';
import UserAttributes from './components/user_attributes';
import UserAction from './components/user_action';
import LeftSidebarHeader from './components/left_sidebar_header';
import BottomTeamSidebar from './components/bottom_team_sidebar';
import LinkTooltip from './components/link_tooltip';
import CustomPost from './components/custom_post';
import CustomCard from './components/custom_card';
import CustomEmbed from './components/custom_embed';

export default class Plugin {
    // eslint-disable-next-line no-unused-vars
    initialize(registry, store) {
        // Root Componentの登録
        const rootComponentId = registry.registerRootComponent(Root)

        // Root Componentを呼び出すアクションの登録
        registry.registerChannelHeaderButtonAction(
            () => (<i className='icon fa fa-plug' style={{fontSize: '15px', position: 'relative', top: '-1px'}}/>),
            () => store.dispatch(openRootModal()),
            "Open Root modal","Open Root modal"
        );

        // User Popoverに説明を追加するComponentの登録
        registry.registerPopoverUserAttributesComponent(UserAttributes);

        // User Popoverにアクションを追加するComponentの登録
        registry.registerPopoverUserActionsComponent(UserAction);

        // 左サイドバーの上部に表示されるComponentの登録
        registry.registerLeftSidebarHeaderComponent(LeftSidebarHeader);

        // チーム選択サイドバーの下部に表示されるComponentの登録
        registry.registerBottomTeamSidebarComponent(BottomTeamSidebar);

        // リンクをhoverした時に表示されるTooltipとして表示されるComponentの登録
        registry.registerLinkTooltipComponent(LinkTooltip);

        // 投稿を作成するチャンネルヘッダボタンを登録
        registry.registerChannelHeaderButtonAction(
            () => (<i className='icon fa fa-commenting-o' style={{fontSize: '15px', position: 'relative', top: '-1px'}}/>),
            (channel, channelMembers) => store.dispatch(createPluginPost(channel.id)),
            "Create Sample Post", "Create Sample Post"
        );

        // type: custom_sample_post を持つ投稿をレンダリングするComponentの登録
        registry.registerPostTypeComponent('custom_sample_post', CustomPost);

        // type: custom_sample_card を持つ投稿をレンダリングするComponentの登録
        registry.registerPostCardTypeComponent('custom_sample_card', CustomCard);

        // 投稿に含まれるURLのプレビューをレンダリングするComponentの登録
        registry.registerPostWillRenderEmbedComponent(
            (embed) => embed.url.startsWith(`https://github.com/mattermost/`),
            CustomEmbed,
            true
        );

        // メインメニューを追加する
        registry.registerMainMenuAction(
            'Sample Main Menu',
            () => store.dispatch(openRootModal()),
            () => (<i className='icon fa fa-plug' style={{fontSize: '15px', position: 'relative', top: '-1px'}}/>)
        );

        // チャンネル名をクリックした際に表示されるメニューに独自メニューを追加する
        registry.registerChannelHeaderMenuAction(
            <i className='icon fa fa-plug' style={{fontSize: '15px', position: 'relative', top: '-1px'}}>{'Sample Menu'}</i>,
            (chnnelId) => store.dispatch(openRootModal())
        );

        // 投稿に対するドロップダウンメニューに独自メニューを追加する
        registry.registerPostDropdownMenuAction(
            <i className='icon fa fa-plug' style={{fontSize: '15px'}}>{'Sample Post Menu'}</i>,
            (postId) => store.dispatch(openRootModal()),
            (postId) => { return true; }
        );

        registry.registerReducer(reducer);
    }
}

window.registerPlugin(manifest.id, new Plugin());

const channelHeaderButtonIcon = () => {
    return (
    <i
        className='icon fa fa-plug'
        style={{fontSize: '15px', position: 'relative', top: '-1px'}}
    />
    );
};
