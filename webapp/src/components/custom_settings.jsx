import React from 'react';
import PropTypes from 'prop-types';

const CustomSettingsComponent = ({helpText, config, id, onChange, value}) => {
    const handleChange = (e) => {
        onChange(id, e.target.value);
    }
    console.log('data', config);
    return (
        <div style={{backgroundColor: '#ffcccc'}}>
            <input
              type={'password'}
              value={value}
              onChange={handleChange}
            />
            <pre>
                {JSON.stringify(helpText.props, null, 4)}
            </pre>
        </div>
    )
}

CustomSettingsComponent.propTypes = {
    config: PropTypes.object,
    helpText: PropTypes.shape ({
        props: PropTypes.object,
    }),
    id: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
};

export default CustomSettingsComponent;
