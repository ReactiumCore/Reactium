/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import op from 'object-path';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';

/**
 * -----------------------------------------------------------------------------
 * React Component: Notify
 * -----------------------------------------------------------------------------
 */

export default class Notify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };

        this.autoClose = this.autoClose.bind(this);
        this.cont = null;
        this.timer = null;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps
        }));
    }

    autoClose() {
        let { onCloseClick } = this.state;

        clearTimeout(this.timer);
        this.timer = null;

        if (typeof onCloseClick === 'function') {
            onCloseClick();
        }
    }

    render() {
        let {
            autohide,
            dismissable,
            message,
            onCloseClick,
            prefs,
            visible
        } = this.state;

        let pos = op.get(prefs, 'sidebar.position', 'left');
        pos = pos === 'left' ? 'right' : 'left';

        if (autohide !== false) {
            if (this.timer !== null) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            let time = typeof autohide === 'number' ? autohide : 5000;
            this.timer = setTimeout(this.autoClose, time);
        }

        visible = visible === true ? 'visible' : '';

        return (
            <aside
                className={`re-notice ${pos} ${visible}`}
                ref={elm => {
                    this.cont = elm;
                }}>
                <div>{message}</div>
                {dismissable === true ? (
                    <button
                        type={`button`}
                        className={`re-notice-close`}
                        onClick={onCloseClick}>
                        <svg>
                            <use xlinkHref={'#re-icon-close'} />
                        </svg>
                    </button>
                ) : null}
            </aside>
        );
    }
}

Notify.defaultProps = {
    autohide: false,
    dismissable: true,
    message: null,
    onCloseClick: null,
    prefs: {},
    visible: false
};
