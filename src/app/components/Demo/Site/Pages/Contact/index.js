/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from "react";
import Template from "components/Demo/Site/Template";
import Features from "components/Demo/Site/Features";

/**
 * -----------------------------------------------------------------------------
 * React Component: Contact
 * -----------------------------------------------------------------------------
 */

const ContactInfo = () => {
    return (
        <Fragment>
            123 Sesame Str.<br />Columbus, Ohio 43215<br />
            614.555.0422
        </Fragment>
    );
};

export default class Contact extends Component {
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
        let { features = {}, title } = this.state;

        return (
            <Template title={title}>
                <main role="main">
                    <Features {...features} />
                </main>
            </Template>
        );
    }
}

Contact.defaultProps = {
    title: "Contact | Reactium",
    features: {
        layout: ["col-xs-12 col-md-6 col-lg-5", "col-xs-12 col-md-6 col-lg-7"],
        items: [
            {
                title: "Contact Us",
                backgroundImage: "url(/assets/images/demo-site/feature-02.png)",
                caption: <ContactInfo />
            }
        ]
    }
};
