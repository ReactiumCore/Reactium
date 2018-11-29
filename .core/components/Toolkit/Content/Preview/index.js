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
            ...this.props,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps,
        }));

        const { style } = nextProps;
        if (this.iframe && style !== this.state.style) {
            const stylesheet = this.iframe.contentWindow.document.head.querySelector(
                'link[rel=stylesheet]'
            );
            stylesheet.setAttribute('href', style);
        }
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
        this.iframe = elm && elm.node;
    }

    renderCmp({ style, toolkit }) {
        let browserSync;
        if (document) {
            browserSync = document.getElementById('__bs_script__');
            browserSync = browserSync ? browserSync.outerHTML : '';
        }

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="${style}">
                    <link rel="stylesheet" href="${toolkit}">
                </head>
                <body style="padding: 25px">
                    <div id="router"></div>
                    ${browserSync}
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
            dna,
        } = this.state;

        if (!Component || !group || !id) {
            return null;
        }

        let display = visible ? 'block' : 'none';
        let markup = this.renderCmp(this.state);

        return (
            <Frame
                style={{ display }}
                id={`iframe-${id}`}
                onLoad={this.resize}
                frameBorder={0}
                scrolling={'no'}
                ref={this.registerIframe}
                initialContent={markup}
                mountTarget='#router'>
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
    style: '/assets/style/style.css',
    toolkit: '/assets/style/toolkit.css',
};

Preview.contextTypes = {
    store: PropTypes.object,
};
