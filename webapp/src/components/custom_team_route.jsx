import React from 'react';
import PropTypes from 'prop-types';

import {Switch, Route} from 'react-router-dom';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {useSelector} from 'react-redux';

import {id} from 'src/manifest';

const CustomTeamRouteComponent = () => {
    const currentTeam = useSelector(getCurrentTeam);
    return (
        <Switch>
            <Route path={`/${currentTeam.name}/${id}/error`}>
                <h3>{'This is error page!'}</h3>
                <p>
                    <a href={`/${currentTeam.name}`}>Back to Top</a>
                </p>
            </Route>
            <Route>
                <h3>{'404 Not Found'}</h3>
                <p>
                    <a href={`/${currentTeam.name}`}>Back to Top</a>
                </p>
            </Route>
        </Switch>
    )
}

CustomTeamRouteComponent.propTypes = {
    pluggableId: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default CustomTeamRouteComponent;
