/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import Lipsum from 'toolkit/Lipsum';

/**
 * -----------------------------------------------------------------------------
 * React Component: Fonts
 * -----------------------------------------------------------------------------
 */

class Fonts extends Component {
    static dependencies() {
        return typeof module !== 'undefined' ? module.children : [];
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return Object.assign({}, prevState, nextProps);
        });
    }

    renderText({ name, cls }) {
        let { alphabet, text } = this.state;

        return (
            <section>
                <h2 className={'mb-20'}>{name}</h2>
                <div className={'p-10 bg-grey-light'}>
                    <kbd>.{cls}</kbd>
                </div>
                <div className={'mb-20 p-10 bg-grey-light'}>
                    <kbd>font-family: '{name}';</kbd>
                </div>
                <p className={cls}>{text}</p>
                <p className={`${cls} uppercase`}>{text}</p>
                <p className={cls}>{alphabet}</p>
                <p className={`${cls} uppercase`}>{alphabet}</p>
                <p className={cls}>
                    <Lipsum length={400} />.
                </p>
                <p className={cls}>
                    <small>small: {text}</small>
                </p>
                <p className={cls}>
                    Superscript <sup>1</sup>
                </p>
                <p className={cls}>
                    Subscript <sub>2</sub>
                </p>
                <p className={cls}>
                    <strike>Strikethrough</strike>
                </p>
                <p className={cls}>
                    <u>Underline</u>
                </p>
                <p className={cls}>
                    <strong>Strong</strong>
                </p>
                <p className={cls}>
                    <span className={'medium'}>Medium</span>
                </p>
                <p className={cls}>
                    <span className={'light'}>Light</span>
                </p>
            </section>
        );
    }

    render() {
        return (
            <Fragment>
                {this.renderText({ name: 'Montserrat', cls: 'montserrat' })}
            </Fragment>
        );
    }
}

// Default properties
Fonts.defaultProps = {
    alphabet:
        'a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 . , : ; ? ! @ # $ % ^ & * ( ) [ ] { } < > | \\ / - = _ +',
    text: 'The quick brown fox jumps over the lazy dog'
};

export default Fonts;
