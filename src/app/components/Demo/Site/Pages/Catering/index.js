/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";
import Template from "components/Demo/Site/Template";
import Hero from "components/Demo/Site/Hero";

/**
 * -----------------------------------------------------------------------------
 * React Component: Catering
 * -----------------------------------------------------------------------------
 */

export default class Catering extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
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
        let { hero } = this.state;

        return (
            <Template>
                <main role="main">
                    <Hero {...hero} />
                </main>
            </Template>
        );
    }
}

Catering.defaultProps = {
    hero: {
        icon: "/assets/images/demo-site/icon-hotdog.png",
        cta: {
            to: "/demo/site",
            type: "link",
            children: ["Learn More"]
        },
        content: ["Catering?", "Yeah, we do that!"]
    }
};
