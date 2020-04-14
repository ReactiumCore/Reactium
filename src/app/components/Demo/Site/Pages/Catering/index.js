/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import Hero from 'components/Demo/Site/Hero';
import Template from 'components/Demo/Site/Template';

/**
 * -----------------------------------------------------------------------------
 * React Component: Catering
 * -----------------------------------------------------------------------------
 */

const Catering = ({ hero, title }) => (
    <Template title={title}>
        <main role='main'>
            <Hero {...hero} />
        </main>
    </Template>
);

Catering.defaultProps = {
    title: 'Catering | Reactium',
    hero: {
        icon: '/assets/images/demo-site/icon-hotdog.png',
        cta: {
            to: '/demo/site',
            type: 'link',
            children: ['Learn More'],
        },
        content: ['Catering?', 'Yeah, we do that!'],
    },
};

export default Catering;
