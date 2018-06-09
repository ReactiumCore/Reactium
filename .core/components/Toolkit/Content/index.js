
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import Card from './Card';


/**
 * -----------------------------------------------------------------------------
 * React Component: Content
 * -----------------------------------------------------------------------------
 */

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
    }

    componentDidMount() {
        if (this.state.hasOwnProperty('mount')) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));
    }

    onCardButtonClick(e, card) {
        console.log('onCardButtonClick:', e.currentTarget.id, card.state.id);
    }

    resizeIframe(e) {
        let h = e.target.contentWindow.document.body.scrollHeight;
            h = (h < 100) ? 100 : h;

        e.target.style.height = h;
    }

    render() {
        let { card, title } = this.state;

        return (
            <Fragment>
                <section className={'re-toolkit-content'}>
                    <h2>{title}</h2>
                    <Card id={'testing'} title={'Elements'} onButtonClick={this.onCardButtonClick.bind(this)} buttons={card.buttons}>
                        <iframe
                            src={'/preview/test'}
                            onLoad={(e) => { this.resizeIframe(e); }}
                        />
                    </Card>
                </section>
                <Helmet titleTemplate="%s | Style Guide">
                    <title>{title}</title>
                    <html lang="en" />
                    <body className="re-toolkit" />
                </Helmet>
            </Fragment>
        );
    }
}

Content.defaultProps = {
    title: 'Group',
    card: {
        buttons: {
            header: [
                {name: 'toggle-fullscreen', title: 'toggle fullscreen', icon: '#re-icon-fullscreen'}
            ],
            footer: [
                {name: 'toggle-code', title: 'code view', icon: '#re-icon-markup'},
                {name: 'toggle-link', title: 'dependencies', icon: '#re-icon-link'},
                {name: 'toggle-docs', title: 'docs', icon: '#re-icon-docs'},
            ],
        }
    }
};
