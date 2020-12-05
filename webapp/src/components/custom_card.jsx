import React from 'react';
import PropTypes from 'prop-types';

const {formatText, messageHtmlToComponent} = window.PostUtils;

const CustomCardComponent = ({post, theme}) => {
    const formattedText = messageHtmlToComponent(formatText(post.message));

    console.log('theme', theme);
    return (
        <div style={{backgroundColor: '#ccccff'}}>
            {formattedText}
            <pre>
                {JSON.stringify(post.props, null, 4)}
            </pre>
        </div>
    )
}

CustomCardComponent.propTypes = {
    post: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default CustomCardComponent;
