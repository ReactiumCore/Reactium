
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import React, { Component, Fragment } from 'react';
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
        this.cards = {};
        this.onResize = this.onResize.bind(this);
        this.onCardButtonClick = this.onCardButtonClick.bind(this);
        this.state = {
            ...this.props,
        };
    }

    componentDidMount() {

        this.onResize();
        setInterval(this.onResize, 200);

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

    onResize() {
        if (this.iframes.length > 0) {
            this.iframes.forEach((elm) => {
                this.resizeIframe(elm);
            });
        }
    }

    onCardButtonClick(e, card) {
        //console.log('[Reactium]', this.cards);
        //console.log('[Reactium] onCardButtonClick:', e.currentTarget.id, card.state);
    }

    registerCard({elm, id}) {
        if (!elm) { return; }

        this.cards[id] = elm;
    }

    registerIframe(elm) {
        if (!elm) { return; }

        this.iframes.push(elm);
    }

    resizeIframe(iframe) {
        try {
            let h = iframe.contentWindow.document.body.scrollHeight;
                h = (h < 1) ? 100 : h;

            iframe.parentNode.style.height = h;
            iframe.style.height = h;
        } catch (err) { }
    }

    getDisplayName(Component) {
        return (
            Component.displayName || Component.name ||
            (typeof Component === 'string' && Component.length > 0
            ? Component
            : 'Unknown')
        );
    }

    renderCrumbs({title, group, element}) {
        let { onCrumbClick } = this.state;
        let elms = [];

        if (!element) {
            elms.push(<span key={`group-${group}`}>{title}</span>);
        } else {
            elms.push(<span key={`group-${group}-element`}><Link to={`/toolkit/${group}`} onClick={onCrumbClick}>{title}</Link></span>);
            //elms.push(<span>{element}</span>);
        }

        return (
            <div className={'re-toolkit-content-crumbs'}>
                {elms.map(elm => elm)}
            </div>
        );
    }

    renderCmp({ cname, cpath }) {
        return (`
            <html>
                <head>
                    <link rel="stylesheet" href="/assets/style/style.css">
                </head>
                <body style="padding: 25px;">
                    <Component type="${cname}" path="${cpath}"></Component>
                    <script>
                        window.ssr = false;
                        window.restAPI = '/api';
                        window.parseAppId = '${parseAppId}';
                    </script>
                    <script src="/vendors.js"></script>
                    <script src="/main.js"></script>
                </body>
            </html>
        `);
    }

    renderIframe({component:Component, id}) {
        let type = typeof Component;
        let { group } = this.state;

        switch(type) {
            case 'string':
                return (
                    <iframe
                        src={Component}
                        id={`iframe-${id}`}
                        onLoad={this.onResize}
                        ref={this.registerIframe.bind(this)}
                    />
                );

            case 'function':
                // let cmp   = renderToString(<Component />);
                let cname = this.getDisplayName(Component);
                let cpath = `${group}/elements/${cname}`;
                let markup = this.renderCmp({cname, cpath});

                return (
                    <iframe
                        srcDoc={markup}
                        id={`iframe-${id}`}
                        onLoad={this.onResize}
                        ref={this.registerIframe.bind(this)}
                    />
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

        let { group } = this.state;
        this.cards   = {};

        return Object.keys(data).map((key, k) => {
            let id   = [group, key].join('_');
            let item = data[key];

            let { label, component } = item;
            let { buttons = {} } = options;

            buttons = JSON.stringify(buttons);
            buttons = JSON.parse(buttons);

            return (
                <Card
                    id={id}
                    title={label}
                    buttons={buttons}
                    key={`card-${id}`}
                    onButtonClick={this.onCardButtonClick}
                    ref={(elm) => { this.registerCard({elm, id}); }}>
                    {this.renderIframe({ component, id })}
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
