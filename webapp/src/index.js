import manifest from './manifest';


import en from 'i18n/en.json';
import ja from 'i18n/ja.json';

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
import CustomPostDropdown from './components/custom_post_dropdown';
import CustomFilePreview from './components/custom_file_preview';
import CustomSettings from './components/custom_settings';
import CustomRightHandSideber from './components/custom_rhs';
import CustomTeamRoute from './components/custom_team_route';

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
        const leftSidebarHeaderComponentId = registry.registerLeftSidebarHeaderComponent(LeftSidebarHeader);

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
            (embed) => embed.url && embed.url.startsWith(`https://github.com/mattermost/`),
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

        // 投稿に対するサブメニュー付きのドロップダウンメニューを追加する
        const {id, rootRegisterMenuItem} = registry.registerPostDropdownSubMenuAction(
            <i className='icon fa fa-plug' style={{fontSize: '15px'}}>{'Sample SubMenu'}</i>,
            (postId) => store.dispatch(openRootModal()),  // 実行されない
            (postId) => { return true; }
        );
        rootRegisterMenuItem(
            <i className='icon fa fa-plug' style={{fontSize: '15px'}}>{'SubMenu 1'}</i>,
            (postId) => store.dispatch(openRootModal()),
        );
        rootRegisterMenuItem(
            <i className='icon fa fa-plug' style={{fontSize: '15px'}}>{'SubMenu 2'}</i>,
            (postId) => store.dispatch(openRootModal())
        );

        // 投稿に対するドロップダウンメニューにコンポーネントを登録する
        registry.registerPostDropdownMenuComponent(CustomPostDropdown);

        // ファイルアップロードメニューを追加する
        registry.registerFileUploadMethod(
            <i className='icon fa fa-pencil-square-o' style={{fontSize: '15px'}}/>,
            (upload) => upload([
                new File(["test1"], "sample1.txt"),
                new File(["test2"], 'sample2.txt')
            ]),
            'Sample File Upload'
        );

        // ファイルアップロード時の処理を登録する
        registry.registerFilesWillUploadHook((files, upload) => {
            let msg = '';
            if (files.length >= 2 ) {
                files = null;
                msg = 'Must upload one by one.';
            }
            return {
                message: msg,
                files: files,
            };
        });

        // プラグインによって登録されたコンポーネントを登録から除外する
        registry.registerMainMenuAction(
            'Unregister LeftSideberHeader',
            () => registry.unregisterComponent(leftSidebarHeaderComponentId),
            () => (<i className='icon fa fa-plug' style={{fontSize: '15px', position: 'relative', top: '-1px'}}/>)
        );

        // 省略
        // unregisterPostTypeComponent

        // Reducerを登録する
        registry.registerReducer(reducer);

        // 'open modal'を含む投稿を受信するとモーダルを開く
        registry.registerWebSocketEventHandler(
            'posted',
            (event) => {
                const post = JSON.parse(event.data.post);
                if (post && post.message && post.message.includes('open modal')) {
                    store.dispatch(openRootModal());
                }
            }
        );

        // 投稿がサーバーに送信される前にrejectしたり内容を変換したりする
        registry.registerMessageWillBePostedHook(
            (post) => {
                if (post.message && post.message.includes('忙しい')) {
                    return {error: {message: '忙しくはないはずです'}};
                }
                post.message = post.message.replace(/帰りたい/gi, '仕事したい');
                return {post: post};
            }
        );

        // Slash Commandがサーバーに送信される前に実行される処理を追加する
        registry.registerSlashCommandWillBePostedHook(
            (message, args) => {
                console.log(message);
                if (message.startsWith('/away')) {
                    return {error: {message: 'rejected'}};
                }
                if (message.startsWith('/help')) {
                    console.log('help');
                    return {message: '/shrug converted from help command', args};
                }
                if (message.startsWith('/leave')) {
                    console.log('leave');
                    return {};
                }
            }
        );

        // `debug`で始まるメッセージを持つ投稿の添付ファイルを独自コンポーネントでプレビューする
        registry.registerFilePreviewComponent(
            (fileInfo, post) => { return post.message && post.message.startsWith('debug'); },
            CustomFilePreview
        );

        registry.registerTranslations((locale) => {
            console.log('locale', locale);
            console.log(ja);
            switch (locale) {
            case 'en':
                return en;
            case 'ja':
                console.log('registered');
                return ja;
            }
            return {};
        });

        // 独自の設定画面項目を追加する
        registry.registerAdminConsoleCustomSetting(
            'SampleSetting',
            CustomSettings,
            {showTitle: true}
        );

        // 右サイドバーに表示される独自Componentを登録する
        const {toggleRHSPlugin} = registry.registerRightHandSidebarComponent(CustomRightHandSideber, "Sample RHS")
        // 右サイドバーを表示するためのメインメニューを追加する
        registry.registerMainMenuAction(
            'Open RHS',
            () => store.dispatch(toggleRHSPlugin),
            () => (<i/>)
        );

        // チームごとに独自のRouteを追加する
        registry.registerNeedsTeamRoute('/', CustomTeamRoute)

        // 独自のRouteを追加する
        registry.registerCustomRoute('/', CustomTeamRoute)
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
