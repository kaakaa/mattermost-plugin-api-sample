import {createPost} from 'mattermost-redux/actions/posts';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {OPEN_ROOT_MODAL, CLOSE_ROOT_MODAL} from './action_types';

export const openRootModal = () => (dispatch) => {
    dispatch({
        type: OPEN_ROOT_MODAL,
    });
};

export const closeRootModal = () => (dispatch) => {
    dispatch({
        type: CLOSE_ROOT_MODAL,
    });
};

export function createPluginPost(channelId) {
    return async (dispatch, getState) => {
        const state = getState();
        const userId = getCurrentUserId(state)
        const post = {
            channel_id: channelId,
            user_id: userId,
            message: "Post from webapp plugin",
        }
        console.log("post", post);
        return await dispatch(createPost(post));
    }
}
