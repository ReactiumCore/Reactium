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
 * About
 * -----------------------------------------------------------------------------
 */

const About = ({ features = {}, title }) => (
    <Template title={title}>
        <main role='main'>
            <Features {...features} />
        </main>
    </Template>
);

About.defaultProps = {
    title: 'About | Reactium',
    features: {
        layout: ['col-xs-12 col-md-6 col-lg-5', 'col-xs-12 col-md-6 col-lg-7'],
        items: [
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-03.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'About Us',
            },
        ],
    },
};

export default About;
