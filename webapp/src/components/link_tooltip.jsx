import React from 'react';
import PropTypes from 'prop-types';

const LinkTooltipComponent = ({href}) => {
    return (
        <>
            <p style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '25px',
                border: '1px solid red',
            }}>
                {href}
            </p>
        </>
    )
}

LinkTooltipComponent.propTypes = {
    href: PropTypes.string.isRequired,
};

export default LinkTooltipComponent;
