
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { getDisplayName } from 'reactium-core/components/Toolkit/_lib/tools';


/**
 * -----------------------------------------------------------------------------
 * React Component: Preview
 * -----------------------------------------------------------------------------
 */

export default class Preview extends Component {
    constructor(props) {
        super(props);

        this.resize = this.resize.bind(this);
        this.registerIframe = this.registerIframe.bind(this);
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

    resize() {
        let { visible } = this.state;
        if (!this.iframe || visible === false) { return; }

        try {
            let h = this.iframe.contentWindow.document.body.scrollHeight;
                h = (h < 1) ? 100 : h;

            this.iframe.style.height = h;
        } catch (err) { }
    }

    registerIframe(elm) {
        this.iframe = elm;
    }

    renderCmp({ cname, cpath, style }) {

        return (`
            <html>
                <head>
                    <link rel="stylesheet" href="${style}">
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


    render() {
        let { component:Component, group, id, visible, style, path } = this.state;

        if (!Component || !group || !id) { return null; }

        let type    = typeof Component;
        let display = (visible) ? 'block' : 'none';

        switch(type) {
            case 'string': {
                return (
                    <iframe
                        src={Component}
                        style={{display}}
                        id={`iframe-${id}`}
                        onLoad={this.resize}
                        ref={this.registerIframe}
                    />
                );
            }

            case 'function': {
                let cname  = path || getDisplayName(Component);
                let cpath  = `${group}/elements/${cname}`;
                let markup = this.renderCmp({cname, cpath, style});

                return (
                    <iframe
                        srcDoc={markup}
                        style={{display}}
                        id={`iframe-${id}`}
                        onLoad={this.resize}
                        ref={this.registerIframe}
                    />
                );
            }

            default: {
                return null;
            }
        }
    }
}

Preview.defaultProps = {
    visible   : true,
    component : null,
    group     : null,
    id        : null,
    style     : '/assets/style/style.css',
};
