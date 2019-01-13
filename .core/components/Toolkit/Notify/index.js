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
    static defaultProps = {
        autohide: false,
        dismissable: true,
        message: null,
        onCloseClick: null,
        prefs: {},
        visible: false,
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.cont = null;
        this.timer = null;
        this.autoClose = this.autoClose.bind(this);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    autoClose() {
        const { onCloseClick } = this.props;

        clearTimeout(this.timer);
        this.timer = null;

        if (typeof onCloseClick === 'function') {
            onCloseClick();
        }
    }

    render() {
        const {
            autohide,
            dismissable,
            message,
            onCloseClick,
            prefs,
            visible,
        } = this.props;

        let pos = op.get(prefs, 'sidebar.position', 'left');
        pos = pos === 'left' ? 'right' : 'left';

        if (autohide !== false) {
            if (this.timer !== null) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            const time = typeof autohide === 'number' ? autohide : 5000;
            this.timer = setTimeout(this.autoClose, time);
        }

        return (
            <aside
                className={`re-notice ${pos} ${visible ? 'visible' : ''}`}
                ref={elm => {
                    this.cont = elm;
                }}>
                <div>{message}</div>
                {dismissable === true && (
                    <button
                        type='button'
                        className='re-notice-close'
                        onClick={onCloseClick}>
                        <svg>
                            <use xlinkHref={'#re-icon-close'} />
                        </svg>
                    </button>
                )}
            </aside>
        );
    }
}
