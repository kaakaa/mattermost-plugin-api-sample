import React from 'react';
import PropTypes from 'prop-types';

const UserAttributes = ({user, hide, status}) => {
    console.log("user", user.id);
    return (
        <div>
            <p>{'UserId: ' + user.id}</p>
        </div>
    );
}

UserAttributes.propTypes = {
    user: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired,
    status: PropTypes.object.isRequired,
};

export default UserAttributes;
