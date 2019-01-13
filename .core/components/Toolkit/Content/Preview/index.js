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
    static defaultProps = {
        visible: true,
        component: null,
        group: null,
        id: null,
        style: '/assets/style/style.css',
        toolkit: '/assets/style/toolkit.css',
    };

    static contextTypes = {
        store: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.h = null;
        this.iframe = React.createRef();
        this.resize = this.resize.bind(this);
        this.state = { visible: this.props.visible };
    }

    componentDidMount() {
        if (typeof window === 'undefined') {
            return;
        }
        window.addEventListener('resize', this.resize);
    }

    componentWillUnMount() {
        if (typeof window === 'undefined') {
            return;
        }

        window.removeEventListener('resize', this.resize);
    }

    componentDidUpdate(prevProps) {
        const { style: prevStyle, update: lastUpdate } = prevProps;
        const { style: currStyle, update } = this.props;

        if (this.iframe.current && prevStyle !== currStyle) {
            const stylesheet = this.iframe.current.node.contentWindow.document.head.querySelector(
                'link[rel=stylesheet]',
            );
            stylesheet.setAttribute('href', currStyle);
        }

        if (update !== lastUpdate) {
            this.resize();
        }
    }

    resize() {
        const { visible } = this.state;

        if (!this.iframe.current || visible === false) {
            return;
        }

        try {
            const iframe = this.iframe.current.node;

            if (['h', '%'].includes(String(iframe.style.height).substr(-1))) {
                return;
            }

            const h = Math.max(
                iframe.contentWindow.document.body.scrollHeight,
                100,
            );

            if (this.h !== h) {
                this.h = h;
                iframe.style.height = `${h}px`;
            }
        } catch (err) {}
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
        const {
            component: Component,
            group,
            id,
            visible,
            style,
            path,
            dna,
        } = this.props;

        if (!Component || !group || !id) {
            return null;
        }

        const display = visible ? 'block' : 'none';
        const markup = this.renderCmp(this.props);

        return (
            <Frame
                style={{ display }}
                id={`iframe-${id}`}
                onLoad={this.resize}
                frameBorder={0}
                scrolling={'no'}
                ref={this.iframe}
                initialContent={markup}
                mountTarget='#router'>
                <Component />
            </Frame>
        );
    }
}
