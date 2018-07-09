/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from "react";
import HeaderNav from "./HeaderNav";

/**
 * -----------------------------------------------------------------------------
 * React Component: Header
 * -----------------------------------------------------------------------------
 */

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };

        this.container = null;
    }

    componentDidMount() {
        if (this.state.hasOwnProperty("mount")) {
            this.state.mount(this);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps
        }));
    }

    render() {
        let { backgroundImage, children, style = {}, nav } = this.state;

        if (backgroundImage) {
            style["backgroundImage"] = backgroundImage;
        }

        return (
            <header
                style={style}
                ref={elm => {
                    this.container = elm;
                }}
            >
                <div className={`shadow`} />
                <HeaderNav links={nav} />
                {children}
            </header>
        );
    }
}

Header.defaultProps = {
    style: { marginBottom: 0 },
    backgroundImage: "url(/assets/images/demo-site/header.png)",
    nav: [
        {
            to: "/demo/site",
            label: "Home"
        },
        {
            to: "https://www.instagram.com/explore/tags/hotdogs",
            icon: "/assets/images/demo-site/icon-instagram.png",
            label: "#hotdogs",
            target: "_blank"
        }
    ]
};
