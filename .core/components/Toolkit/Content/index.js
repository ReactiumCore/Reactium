
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import React, { Component, Fragment } from 'react';
//import getDisplayName from 'react-display-name';
import { Link } from 'react-router-dom';
import Card from './Card';


/**
 * -----------------------------------------------------------------------------
 * React Component: Content
 * -----------------------------------------------------------------------------
 */

export default class Content extends Component {
    constructor(props) {
        super(props);

        this.iframes = [];
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
        console.log('onCardButtonClick:', e.currentTarget.id, card.state);
    }

    getDisplayName(Component) {
        return (
            Component.displayName || Component.name ||
            (typeof Component === 'string' && Component.length > 0
            ? Component
            : 'Unknown')
        );
    }

    resizeIframe(e) {
        let h = e.target.contentWindow.document.body.scrollHeight;
            h = (h < 1) ? 100 : h;

        e.target.parentNode.style.height = h;
        e.target.style.height = h;
    }

    renderCrumbs({title, group, element}) {
        let { onCrumbClick } = this.state;
        let elms = [];

        if (!element) {
            elms.push(<span>{title}</span>);
        } else {
            elms.push(<span><Link to={`/toolkit/${group}`} onClick={onCrumbClick}>{title}</Link></span>);
            //elms.push(<span>{element}</span>);
        }

        return (
            <div className={'re-toolkit-content-crumbs'}>
                {elms}
            </div>
        );
    }

    renderIframe(Component) {
        let type = typeof Component;

        switch(type) {
            case 'string':
                return (
                    <iframe src={Component} onLoad={this.resizeIframe} />
                );

            case 'function':
                // let cname = this.getDisplayName(Component);
                // let markup = `
                //     <html>
                //         <head>
                //             <link rel="stylesheet" href="/assets/style/style.css">
                //         </head>
                //         <body style="padding: 25px;">
                //             <div id="router"></div>
                //             <Component type="${cname}"></Component>
                //             <script>
                //                 window.ssr = false;
                //                 window.restAPI = '/api';
                //                 window.parseAppId = 'Actinium';
                //             </script>
                //             <script src="/vendors.js"></script>
                //             <script src="/main.js"></script>
                //         </body>
                //     </html>
                // `;

                let cmp   = renderToString(<Component />);
                let markup = `
                    <html>
                        <head>
                            <link rel="stylesheet" href="/assets/style/style.css">
                        </head>
                        <body style="padding: 25px;">
                            ${cmp}
                        </body>
                    </html>
                `;

                return (
                    <iframe sandbox={'allow-scripts allow-same-origin'} id={Date.now()} src={''} srcDoc={markup} onLoad={this.resizeIframe} />
                );

            default:
                return null;
        }
    }

    renderCode(Component) {
        // if (typeof Component !== 'function') { return null; }
        //
        // let cmp = renderToString(<Component />);
    }

    renderCards(data, options) {

        return Object.keys(data).map((key, k) => {
            let item = data[key];
            let { label, component } = item;

            return (
                <Card key={`card-${k}`} title={label} onButtonClick={this.onCardButtonClick.bind(this)} buttons={options.buttons}>
                    {this.renderIframe(component)}
                    {this.renderCode(component)}
                </Card>
            );
        });
    }

    render() {
        let { card, title, data, element, group } = this.state;

        if (!data) { return null; }

        if (typeof data !== 'function') {

            element = data[element] || {};

            let { label = null } = element;

            return (
                <Fragment>
                    <section className={'re-toolkit-content'}>
                        {this.renderCrumbs({title, group, element: label})}
                        {this.renderCards(data, card)}
                    </section>
                </Fragment>
            );
        } else {
            const Component = data;
            return (
                <Fragment>
                    <section className={'re-toolkit-content'}>
                        {this.renderCrumbs({title})}
                        {<Component />}
                    </section>
                </Fragment>
            )
        }
    }
}

Content.defaultProps = {
    onCrumbClick: null,
    data: {},
    title: null,
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
