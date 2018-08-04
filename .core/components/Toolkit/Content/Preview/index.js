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
            ...this.props
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
            ...nextProps
        }));
    }

    resize() {
        let { visible } = this.state;
        if (!this.iframe || visible === false) {
            return;
        }

        try {
            let h = this.iframe.contentWindow.document.body.scrollHeight;
            h = h < 1 ? 100 : h;

            this.iframe.style.height = `${h}px`;
        } catch (err) {}
    }

    registerIframe(elm) {
        this.iframe = elm;
    }

    renderCmp({ cname, cpath, style }) {
        let spath = process.env.NODE_ENV === 'development' ? '' : '/assets/js';

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="${style}">
                </head>
                <body style="padding: 25px;">
                    <Component type="${cname}" path="${cpath}"></Component>
                    <script src="${spath}/vendors.js"></script>
                    <script src="${spath}/main.js"></script>
                </body>
            </html>
        `;
    }

    render() {
        let {
            component: Component,
            group,
            id,
            visible,
            style,
            path,
            dna
        } = this.state;

        if (!Component || !group || !id) {
            return null;
        }

        let type = typeof Component;
        let display = visible ? 'block' : 'none';

        switch (type) {
            case 'string': {
                return (
                    <iframe
                        src={Component}
                        style={{ display }}
                        id={`iframe-${id}`}
                        onLoad={this.resize}
                        frameBorder={0}
                        scrolling={'no'}
                        ref={this.registerIframe}
                    />
                );
            }

            case 'function': {
                let cname = dna.split('/').pop();
                let cpath = `${group}/${cname}`;

                let markup = this.renderCmp({ cname, cpath, style });

                return (
                    <iframe
                        srcDoc={markup}
                        style={{ display }}
                        id={`iframe-${id}`}
                        onLoad={this.resize}
                        frameBorder={0}
                        scrolling={'no'}
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
    visible: true,
    component: null,
    group: null,
    id: null,
    style: '/assets/style/style.css'
};
