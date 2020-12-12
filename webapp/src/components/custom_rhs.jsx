import React from 'react';
import PropTypes from 'prop-types';

const ComponentRightHandSidebar = ({theme}) => {
    return (
        <div style={{backgroundColor: '#ffcccc'}}>
            <pre>
                {JSON.stringify(theme, null, 4)}
            </pre>
        </div>
    )
}

ComponentRightHandSidebar.propTypes = {
    PluggableId: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
};

export default ComponentRightHandSidebar;
