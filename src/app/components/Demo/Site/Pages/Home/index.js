/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";
import Template from "components/Demo/Site/Template";
import Hero from "components/Demo/Site/Hero";
import Features from "components/Demo/Site/Features";

/**
 * -----------------------------------------------------------------------------
 * React Component: Home
 * -----------------------------------------------------------------------------
 */

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => ({
            ...prevState,
            ...nextProps
        }));
    }

    render() {
        let { hero, features = {} } = this.state;

        return (
            <Template>
                <main role="main">
                    <Hero {...hero} />
                    <Features {...features} />
                </main>
            </Template>
        );
    }
}

Home.defaultProps = {
    hero: {
        icon: "/assets/images/demo-site/icon-hotdog.png",
        cta: {
            to: "/demo/site/catering",
            type: "link",
            children: ["More Dogs ‘n Make Em Hot"]
        },
        content: [
            "Dirty Dogs serves all-beef, vegan and",
            "vegetarian hot dogs."
        ]
    },
    features: {
        layout: ["col-xs-12 col-md-6", "col-xs-12 col-md-6"],
        items: [
            {
                backgroundImage: "url(/assets/images/demo-site/feature-01.png)",
                caption:
                    "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.",
                title: "Gourmet All Beef Hotdogs"
            },
            {
                backgroundImage: "url(/assets/images/demo-site/feature-02.png)",
                caption:
                    "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.",
                title: "Vegan Hotdogs"
            },
            {
                backgroundImage: "url(/assets/images/demo-site/feature-03.png)",
                caption:
                    "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.",
                title: "Vegetarian Hotdogs"
            }
        ]
    }
};
