
import React from 'react';

import {FormattedMessage} from 'react-intl';

const Root = ({visible, close}) => {
    if (!visible) {
        return null;
    }

    const style = getStyle();

    return (
        <div
            style={style.backdrop}
            onClick={close}
        >
            <div style={style.modal}>
                <FormattedMessage
                    id='rootModal.message'
                    defaultMessage='Root Modal2'
                />
            </div>
        </div>
    );
};

Root.propTypes = {
    visible: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
};

const getStyle = () => ({
    backdrop: {
        position: 'absolute',
        display: 'flex',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
        zIndex: 2000,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        height: '300px',
        width: '500px',
        padding: '1em',
        color: 'black',
        backgroundColor: 'white',
    },
});

export default Root;
