import React from 'react';
import PropTypes from 'prop-types';

const UserActionComponent = ({openRootModal, user, hide, status}) => {
	const onClick = () => {
		openRootModal();
		hide();
	};
    return (
        <div>
            <p>User Action <button onClick={onClick}>Action</button></p>
        </div>
    )
};

UserActionComponent.PropTypes = {
	openRootModal: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
    status: PropTypes.object.isRequired,
};

export default UserActionComponent;
