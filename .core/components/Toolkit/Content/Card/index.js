/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import _ from 'underscore';

/**
 * -----------------------------------------------------------------------------
 * React Component: Card
 * -----------------------------------------------------------------------------
 */

export default class Card extends Component {
    constructor(props) {
        super(props);

        this.y = 60;
        this.cont = null;
        this.anchor = null;
        this.state = {
            fullscreen: this.props.fullscreen,
            buttons: this.props.buttons,
            id: this.props.id,
        };
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
    }

    componentDidMount() {
        this.forceUpdate();
    }

    getCoords(elm, cont) {
        let box = elm.getBoundingClientRect();

        // Get top & left
        let body = document.body;
        let docEl = document.documentElement;

        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let scrollLeft =
            window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        let clientTop = docEl.clientTop || body.clientTop || 0;
        let clientLeft = docEl.clientLeft || body.clientLeft || 0;

        let top = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;

        // Get current height
        let currentH = cont.offsetHeight;

        // Get actual height
        TweenMax.set(cont, { height: 'auto' });
        let actualH = cont.offsetHeight;

        // Reset cont back to it's original height
        TweenMax.set(cont, { height: currentH });

        return {
            x: Math.round(left),
            y: Math.round(top),
            width: elm.offsetWidth,
            height: actualH,
        };
    }

    toggleFullScreen(e) {
        let { anchor, cont } = this;
        let { fullscreen, buttons } = this.state;
        let { speed = 0.125 } = this.props;

        // Get position
        let coords = this.getCoords(anchor, cont);

        let x = fullscreen === true ? coords.x : 0;
        let y = fullscreen === true ? coords.y : this.y;
        let width = fullscreen === true ? coords.width : '100%';
        let height =
            fullscreen === true ? coords.height : window.innerHeight - this.y;

        let tk = document.querySelector('.re-toolkit-content');

        if (fullscreen !== true) {
            // pop out
            TweenMax.set(cont, {
                zIndex: 100000,
                position: 'fixed',
                left: coords.x,
                top: coords.y,
                width: coords.width,
                height: coords.height,
            });

            // Set anchor height to actual H
            TweenMax.set(anchor, { height: coords.height + 60 });
        } else {
            TweenMax.set(cont, { height: window.innerHeight - this.y });
        }

        TweenMax.to(cont, speed, {
            left: x,
            top: y,
            width: width,
            height: height,
            ease: Power2.easeInOut,
            onComplete: () => {
                if (fullscreen === true) {
                    // pop in
                    TweenMax.set(anchor, { height: 'auto' });
                    TweenMax.set(cont, {
                        zIndex: 1,
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: 'auto',
                        position: 'relative',
                    });
                    tk.style.overflowY = 'auto';
                    tk.classList.remove('fullscreen');
                    cont.scrollIntoView();
                } else {
                    // pop out
                    TweenMax.set(cont, {
                        width: '100%',
                    });
                    tk.style.overflowY = 'hidden';
                    tk.classList.add('fullscreen');
                }

                // Update header buttons
                let btns = JSON.parse(JSON.stringify(buttons)); // clone buttons array
                let idx = _.indexOf(
                    _.pluck(btns.header, 'name'),
                    'toggle-fullscreen',
                );
                let icon =
                    fullscreen === true
                        ? '#re-icon-fullscreen'
                        : '#re-icon-collapse';

                btns.header[idx]['icon'] = icon;

                // Update the state
                this.setState({ fullscreen: !fullscreen, buttons: btns });
            },
        });
    }

    renderButtons(buttons) {
        let { onButtonClick: onClick } = this.props;

        return buttons.map((item, i) => {
            let { title, name, icon } = item;
            return (
                <button
                    className={'re-toolkit-card-btn-icon'}
                    onClick={e => {
                        onClick(e, this);
                    }}
                    type={'button'}
                    title={title}
                    key={`button-${i}`}
                    id={name}>
                    <svg>
                        <use xlinkHref={icon} />
                    </svg>
                </button>
            );
        });
    }

    render() {
        let { fullscreen, buttons = {} } = this.state;

        let { children = null, title = null } = this.props;

        let { header: hbuttons = [], footer: fbuttons = [] } = buttons;

        let position = fullscreen === true ? ' fixed' : '';
        let zIndex = fullscreen === true ? 100000 : 1;

        return (
            <Fragment>
                <div
                    className={'re-toolkit-card-anchor'}
                    ref={elm => {
                        this.anchor = elm;
                    }}
                    style={{ zIndex }}
                />
                <div
                    className={`re-toolkit-card${position}`}
                    ref={elm => {
                        this.cont = elm;
                    }}>
                    {!title && hbuttons.length < 1 ? null : (
                        <div className={'re-toolkit-card-heading'}>
                            {!title ? <div /> : <h3>{title}</h3>}
                            {this.renderButtons(hbuttons)}
                        </div>
                    )}
                    <div className={'re-toolkit-card-body'}>
                        <div className={'re-toolkit-card-body-wrap'}>
                            {children}
                        </div>
                    </div>
                    {fbuttons.length < 1 ? null : (
                        <div className={'re-toolkit-card-footer'}>
                            {this.renderButtons(fbuttons)}
                        </div>
                    )}
                </div>
            </Fragment>
        );
    }
}

Card.defaultProps = {
    speed: 0.125,
    fullscreen: false,
    title: null,
    onButtonClick: null,
    buttons: {
        header: [],
        footer: [],
    },
};
