
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { TweenMax, Power2 } from 'gsap';
import Card from '../Content/Card';
import op from 'object-path';


/**
 * -----------------------------------------------------------------------------
 * React Component: Settings
 * -----------------------------------------------------------------------------
 */

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.cont    = null;
        this.open    = this.open.bind(this);
        this.close   = this.close.bind(this);
        this.toggle  = this.toggle.bind(this);
        this.dismiss = this.dismiss.bind(this);

        this.state   = { ...this.props };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    close(callback) {
        if (!this.cont) { return; }

        let { speed = 0.25, onSettingsClose } = this.state;

        let _self = this;

        TweenMax.to(this.cont, speed, {
            opacity: 0,
            ease: Power2.easeInOut,
            onComplete: () => {
                this.setState({visible: false});

                if (typeof callback === 'function') {
                    callback();
                }

                if (typeof onSettingsClose === 'function') {
                    onSettingsClose();
                }
            }
        });
    }

    open(callback) {
        if (!this.cont) { return; }

        let { speed = 0.25, onSettingsOpen } = this.state;

        let _self = this;

        TweenMax.set(this.cont, {display: 'block', opacity: 0});
        TweenMax.to(this.cont, speed, {
            opacity: 1,
            //ease: Power2.easeInOut,
            onComplete: () => {
                this.cont.focus();
                this.setState({visible: true});

                if (typeof callback === 'function') {
                    callback();
                }

                if (typeof onSettingsOpen === 'function') {
                    onSettingsOpen();
                }
            }
        });
    }

    toggle() {
        if (!this.cont) { return; }

        let { visible } = this.state;

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

    onSwitchClick(e, {pref, other}) {
        let { onSwitchClick } = this.state;

        e.target.classList.toggle('active');

        if (typeof onSwitchClick === 'function') {
            onSwitchClick({pref, value: other});
        }

        // TODO: ADD action that saves the pref to the Toolkit.state
    }

    renderSettings() {

        let { settings = [], prefs = {} } = this.state;

        return settings.map((item, i) => {
            let { text = [], values = [], labels = [], help, pref } = item;

            let value = op.get(prefs, pref);
            let idx   = values.indexOf(value);
                idx   = (idx == -1) ? 0 : idx;

            let active = (idx === 1) ? 'active' : '';
            let other = (idx === 0 && values.length > 1) ? values[1] : values[0];

            return (
                <li className={'re-toolkit-card-list-item'} key={`setting-${i}`}>
                    {(text.length > 0)
                        ? (
                            <div className={'re-toolkit-card-list-text'}>
                                <div>{text[idx]}</div>
                                {(help) ? (<small>{help}</small>) : null}
                            </div>
                        )
                        : null
                    }
                    <div>
                        <button
                            type={'button'}
                            className={`re-toolkit-switch ${active}`}
                            onClick={(e) => {
                                this.onSwitchClick(e, {pref, other});
                             }}>
                            {(labels.length > 0)
                                ? labels.map((label, l) => { return (<span key={`label-${l}`}>{label}</span>); })
                                : null
                            }
                        </button>
                    </div>
                </li>
            )
        });
    }

    render() {

        let { buttons = {}, visible = false } = this.state;

        let display = (visible === false) ? 'none' : 'block';
        let opacity = (visible === false) ? 0 : 1;

        return (
            <div
                id={'lightbox'}
                ref={(elm) => { this.cont = elm; }}
                onClick={this.dismiss}
                className={'re-toolkit-settings'} style={{display, opacity}}>
                <Card
                    id={'settings-card'}
                    title={'Settings'}
                    onButtonClick={this.close}
                    buttons={buttons}>
                    <ul className={'re-toolkit-card-list'}>
                        {this.renderSettings()}
                    </ul>
                </Card>
            </div>
        );
    }
}

Settings.defaultProps = {
    onSettingsClose : null,
    onSettingsOpen  : null,
    onSwitchClick   : null,
    visible         : false,
    speed           : 0.125,
    manifest        : {},
    prefs           : {},
    buttons         : {
        header: [
            {name: 'toggle-settings', title: 'close', icon: '#re-icon-close'}
        ]
    }
};
