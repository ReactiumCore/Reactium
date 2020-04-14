/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../Header';
import Nav from '../Nav';
import Footer from '../Footer';

/**
 * -----------------------------------------------------------------------------
 * React Component: Template
 * -----------------------------------------------------------------------------
 */

export default class Template extends Component {
    constructor(props) {
        super(props);

        this.mb = null;
        this.navbar = null;
        this.header = null;
        this.ival = null;
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', this.onScroll);
            this.ival = setInterval(() => {
                this.setState({ mounted: window.templateMounted });
            });
        }
    }

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            clearInterval(this.ival);
            this.ival = null;
            window.removeEventListener('scroll', this.onScroll);
        }
    }

    onScroll(e) {
        if (!this.navbar || !this.header) {
            return;
        }

        const {
            height: headerHeight,
        } = this.header.container.getBoundingClientRect();
        const { top, height } = this.navbar.container.getBoundingClientRect();
        const y = scrollY - headerHeight;

        if (this.mb !== y) {
            const fixed = y >= 0;
            this.mb = y >= 0 ? height : 0;
            this.setState({ navbarFixed: fixed, headerMarginBottom: this.mb });
        }
    }

    render() {
        const {
            title,
            bodyClass,
            navbarFixed,
            headerMarginBottom,
            children,
            style,
            description,
            header = {},
        } = this.props;

        const headerStyle = { marginBottom: headerMarginBottom };
        return (
            <>
                <Helmet>
                    <link rel='stylesheet' href={style} />
                    <title>{title}</title>
                    <meta name='description' content={description} />
                    <html lang='en' />
                    <body className={bodyClass} />
                </Helmet>

                <Header
                    style={headerStyle}
                    {...header}
                    ref={elm => {
                        this.header = elm;
                    }}
                />

                <Nav
                    fixed={navbarFixed}
                    ref={elm => {
                        this.navbar = elm;
                    }}
                />

                {children}

                <Footer />
            </>
        );
    }
}

Template.defaultProps = {
    header: {},
    navbarFixed: false,
    headerMarginBottom: 0,
    bodyClass: 'demo-site',
    title: 'Reactium',
    description: 'This is an example Reactium Site',
    style: '/assets/style/demo-site.css',
};
