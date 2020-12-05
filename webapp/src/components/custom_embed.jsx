import React from 'react';
import PropTypes from 'prop-types';

const CustomEmbedComponent = ({embed}) => {
    const {type, url, data} = embed;
    return (
        <div style={{backgroundColor: '#ccffcc'}}>
            <p>{type}</p>
            <p>{url}</p>
            <pre>
                {JSON.stringify(data, null, 4)}
            </pre>
        </div>
    )
}

CustomEmbedComponent.propTypes = {
    embed: PropTypes.shape ({
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
    })
};

export default CustomEmbedComponent;
