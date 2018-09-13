/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import { Provider } from 'react-redux';
import { getDisplayName } from 'reactium-core/components/Toolkit/_lib/tools';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import PropTypes from 'prop-types';

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
        this.iframe = elm.node;
    }

    renderCmp({ style }) {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="${style}">
                </head>
                <body style="padding: 25px">
                    <div id="router"></div>
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

        let display = visible ? 'block' : 'none';
        let markup = this.renderCmp({ style });

        return (
            <Frame
                style={{ display }}
                id={`iframe-${id}`}
                onLoad={this.resize}
                frameBorder={0}
                scrolling={'no'}
                ref={this.registerIframe}
                initialContent={markup}
                mountTarget="#router">
                <Component />
            </Frame>
        );
    }
}

Preview.defaultProps = {
    visible: true,
    component: null,
    group: null,
    id: null,
    style: '/assets/style/style.css'
};

Preview.contextTypes = {
    store: PropTypes.object
};
