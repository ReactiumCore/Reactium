/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";

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
        this.state = { ...this.props };
        this.onLoad = this.onLoad.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll);
        window.addEventListener("load", this.onLoad);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
        this.setState({ mounted: false });
    }

    onLoad() {
        setTimeout(() => {
            this.setState({ mounted: true });
        }, 100);
    }

    onScroll(e) {
        let {
            height: headerHeight
        } = this.header.container.getBoundingClientRect();
        let { top, height } = this.navbar.container.getBoundingClientRect();
        let y = scrollY - headerHeight;

        if (this.mb !== y) {
            let fixed = y >= 0;
            this.mb = y >= 0 ? height : 0;
            this.setState({ navbarFixed: fixed, headerMarginBottom: this.mb });
        }
    }

    render() {
        let {
            mounted,
            title,
            bodyClass,
            navbarFixed,
            headerMarginBottom,
            children,
            style,
            description,
            header = {}
        } = this.state;

        let headerStyle = { marginBottom: headerMarginBottom };

        if (mounted !== true) {
            return (
                <Helmet>
                    <link rel="stylesheet" href={style} />
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <html lang="en" />
                    <body className={bodyClass} />
                </Helmet>
            );
        }

        return (
            <Fragment>
                <Helmet>
                    <link rel="stylesheet" href={style} />
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <html lang="en" />
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
            </Fragment>
        );
    }
}

Template.defaultProps = {
    header: {},
    navbarFixed: false,
    headerMarginBottom: 0,
    bodyClass: "demo-site",
    title: "Reactium",
    description: "This is an example Reactium Site",
    style: "/assets/style/demo-site.css"
};
