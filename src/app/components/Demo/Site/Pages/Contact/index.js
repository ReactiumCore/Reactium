/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import Features from 'components/Demo/Site/Features';
import Template from 'components/Demo/Site/Template';

/**
 * -----------------------------------------------------------------------------
 * Contact
 * -----------------------------------------------------------------------------
 */

const ContactInfo = () => {
    return (
        <>
            123 Sesame Str.
            <br />
            Columbus, Ohio 43215
            <br />
            614.555.0422
        </>
    );
};

const Contact = ({ features = {}, title }) => (
    <Template title={title}>
        <main role='main'>
            <Features {...features} />
        </main>
    </Template>
);

Contact.defaultProps = {
    title: 'Contact | Reactium',
    features: {
        layout: ['col-xs-12 col-md-6 col-lg-5', 'col-xs-12 col-md-6 col-lg-7'],
        items: [
            {
                title: 'Contact Us',
                backgroundImage: 'url(/assets/images/demo-site/feature-02.png)',
                caption: <ContactInfo />,
            },
        ],
    },
};

export default Contact;
