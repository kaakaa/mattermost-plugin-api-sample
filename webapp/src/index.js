import manifest from './manifest';

import {openRootModal} from './actions';
import reducer from './reducer';
import Root from './components/root';

export default class Plugin {
    // eslint-disable-next-line no-unused-vars
    initialize(registry, store) {
        // Root Componentの登録
        const rootComponentId = registry.registerRootComponent(Root)

        // Root Componentを呼び出すアクションの登録
        registry.registerChannelHeaderButtonAction(
            channelHeaderButtonIcon,
            () => store.dispatch(openRootModal()),
            "Open Root modal","Open Root modal"
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
