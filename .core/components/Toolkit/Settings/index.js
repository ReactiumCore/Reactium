
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { TweenMax, Power2 } from 'gsap';
import Card from '../Content/Card';

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

    close() {
        if (!this.cont) { return; }

        let { speed = 0.25 } = this.state;

        let _self = this;

        TweenMax.to(this.cont, speed, {
            opacity: 0,
            ease: Power2.easeInOut,
            onComplete: () => {
                this.setState({visible: false});
            }
        });
    }

    open() {
        if (!this.cont) { return; }

        let { speed = 0.25 } = this.state;

        let _self = this;

        TweenMax.set(this.cont, {display: 'block', opacity: 0});
        TweenMax.to(this.cont, speed, {
            opacity: 1,
            //ease: Power2.easeInOut,
            onComplete: () => {
                this.cont.focus();
                this.setState({visible: true});
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

    onSwitchClick(e) {
        e.target.classList.toggle('active');

        // TODO: ADD action that saves the pref to the Toolkit.state
    }

    // TODO: Create function to list options and render them as switch list elements. 

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
                        <li className={'re-toolkit-card-list-item'}>
                            <div className={'re-toolkit-card-list-text'}>
                                <div>Lorem Ipsum Dolor Sit</div>
                                <small>Lorem Ipsum Dolor Sit Lorem Ipsum</small>
                            </div>
                            <div>
                                <button type={'button'} className={'re-toolkit-switch'} onClick={this.onSwitchClick.bind(this)}>
                                    <span>L</span><span>R</span>
                                </button>
                            </div>
                        </li>
                        <li className={'re-toolkit-card-list-item'}>
                            <div className={'re-toolkit-card-list-text'}>
                                Lorem Ipsum Dolor Sit Lorem Ipsum Dolor Sit Lorem Ipsum Dolor Sit Lorem Ipsum Dolor Sit
                            </div>
                            <div>
                                <button type={'button'} className={'re-toolkit-switch active'} onClick={this.onSwitchClick.bind(this)} />
                            </div>
                        </li>
                    </ul>
                </Card>
            </div>
        );
    }
}

Settings.defaultProps = {
    visible: false,
    speed: 0.125,
    buttons: {
        header: [
            {name: 'toggle-settings', title: 'close', icon: '#re-icon-close'}
        ]
    }
};
