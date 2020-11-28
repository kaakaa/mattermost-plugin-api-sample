import React from 'react';
import PropTypes from 'prop-types';

const UserActionComponent = ({openRootModal}) => {
    return (
        <div>
            <p>User Action <button onClick={openRootModal}>Action</button></p>
        </div>
    )
};

UserActionComponent.PropTypes = {
    openRootModal: PropTypes.func.isRequired,
};

export default UserActionComponent;
