import React from 'react';
import PropTypes from 'prop-types';

const {formatText, messageHtmlToComponent} = window.PostUtils;

const CustomFilePreviewComponent = ({fileInfo, post}) => {
    const formattedText = messageHtmlToComponent(formatText(post.message));

    return (
        <div style={{backgroundColor: '#ffcccc'}}>
            {formattedText}
            <pre>
                {JSON.stringify(fileInfo, null, 4)}
            </pre>
        </div>
    )
}

CustomFilePreviewComponent.propTypes = {
    fileInfo: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
};

export default CustomFilePreviewComponent;
