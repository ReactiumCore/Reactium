/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import Card from '../Content/Card';
import op from 'object-path';
import defaultState from '../state';

/**
 * -----------------------------------------------------------------------------
 * React Component: Settings
 * -----------------------------------------------------------------------------
 */

const noop = () => {};

export default class Settings extends Component {
    static defaultProps = {
        ...defaultState,
    };

    constructor(props) {
        super(props);

        this.cont = React.createRef();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this.state = { visible: this.props.visible };
    }

    close(callback) {
        const { speed = 0.25, onSettingsClose } = this.props;
        const _self = this;

        TweenMax.to(this.cont.current, speed, {
            opacity: 0,
            ease: Power2.easeInOut,
            onComplete: () => {
                this.setState({ visible: false });

                if (typeof callback === 'function') {
                    callback();
                }

                if (typeof onSettingsClose === 'function') {
                    onSettingsClose();
                }
            },
        });
    }

    open(callback) {
        if (!this.cont) {
            return;
        }

        let { speed = 0.25, onSettingsOpen } = this.props;

        let _self = this;

        TweenMax.set(this.cont.current, { display: 'block', opacity: 0 });
        TweenMax.to(this.cont.current, speed, {
            opacity: 1,
            //ease: Power2.easeInOut,
            onComplete: () => {
                this.cont.current.focus();
                this.setState({ visible: true });

                if (typeof callback === 'function') {
                    callback();
                }

                if (typeof onSettingsOpen === 'function') {
                    onSettingsOpen();
                }
            },
        });
    }

    toggle() {
        const { visible } = this.state;

        if (visible !== true) {
            this.open();
        } else {
            this.close();
        }
    }

    dismiss(e) {
        if (e.target.id === 'lightbox') {
            this.close();
        }
    }

    onSwitchClick(e, { pref, other }) {
        const { onSwitchClick = noop } = this.props;

        e.target.classList.toggle('active');

        onSwitchClick({ pref, value: other });
    }

    renderSettings() {
        const { prefs = {}, settings = [] } = this.props;

        return settings.map((item, i) => {
            let { text = [], values = [], labels = [], help, pref } = item;

            let value = op.get(prefs, pref);
            let idx = values.indexOf(value);
            idx = idx == -1 ? 0 : idx;

            let active = idx === 1 ? 'active' : '';
            let other = idx === 0 && values.length > 1 ? values[1] : values[0];

            return (
                <li className='re-toolkit-card-list-item' key={`setting-${i}`}>
                    {text.length > 0 && (
                        <div className='re-toolkit-card-list-text'>
                            <div>{text[idx]}</div>
                            {help ? <small>{help}</small> : null}
                        </div>
                    )}
                    <div>
                        <button
                            type='button'
                            className={`re-toolkit-switch ${active}`}
                            onClick={e => {
                                this.onSwitchClick(e, { pref, other });
                            }}>
                            {labels.length > 0
                                ? labels.map((label, l) => {
                                      return (
                                          <span key={`label-${l}`}>
                                              {label}
                                          </span>
                                      );
                                  })
                                : null}
                        </button>
                    </div>
                </li>
            );
        });
    }

    render() {
        const { visible } = this.state;
        const { buttons = {} } = this.props;
        const display = visible === false ? 'none' : 'block';
        const opacity = visible === false ? 0 : 1;

        return (
            <div
                id='lightbox'
                ref={this.cont}
                onClick={this.dismiss}
                className='re-toolkit-settings'
                style={{ display, opacity }}>
                <Card
                    id='settings-card'
                    title='Settings'
                    onButtonClick={this.close}
                    buttons={buttons}>
                    <ul className='re-toolkit-card-list'>
                        {this.renderSettings()}
                    </ul>
                </Card>
            </div>
        );
    }
}
