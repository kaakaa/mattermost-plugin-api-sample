import React from 'react';
import PropTypes from 'prop-types';

import {openRootModal} from 'actions';

const CustomPostDropdownComponent = ({postId, theme, dispatch}) => {
    return (
        <div
            style={{backgroundColor: '#ffcccc'}}
            onClick={() => dispatch(openRootModal())}
        >
            {postId}
        </div>
    )
}

CustomPostDropdownComponent.propTypes = {
    postId: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default CustomPostDropdownComponent;
