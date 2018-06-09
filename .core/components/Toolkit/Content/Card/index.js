
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';

/**
 * -----------------------------------------------------------------------------
 * React Component: Card
 * -----------------------------------------------------------------------------
 */

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    componentDidMount() {
        this.forceUpdate();
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    renderButtons(buttons) {
        let { onButtonClick:onClick } = this.state;
        return buttons.map((item, i) => {
            let { title, name, icon } = item;
            return (
                <button onClick={(e) => { onClick(e, this); }} type={'button'} title={title} key={`button-${i}`} id={name}>
                    <svg>
                        <use xlinkHref={icon}></use>
                    </svg>
                </button>
            );
        });
    }

    render() {
        let { children = null, buttons = {}, title = null } = this.state;

        let { header:hbuttons = [], footer:fbuttons = [] } = buttons;

        return (
            <div className={'re-toolkit-card'}>
                {(!title && hbuttons.length < 1) ? null : (
                    <div className={'re-toolkit-card-heading'}>
                        {(!title) ? <div /> : (<h3>{title}</h3>)}
                        {this.renderButtons(hbuttons)}
                    </div>
                )}
                <div className={'re-toolkit-card-body'}>
                    <div className={'re-toolkit-card-body-wrap'}>
                        {children}
                    </div>
                </div>
                {(fbuttons.length < 1) ? null : (
                    <div className={'re-toolkit-card-footer'}>
                        {this.renderButtons(fbuttons)}
                    </div>
                )}
            </div>
        );
    }
}

Card.defaultProps = {
    title: null,
    onButtonClick: null,
    buttons: {
        header: [
            {name: 'toggle-fullscreen', title: 'toggle fullscreen', icon: '#re-icon-close'}
        ],
        footer: [],
    }
};
