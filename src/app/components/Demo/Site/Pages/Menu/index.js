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
 * Menu
 * -----------------------------------------------------------------------------
 */

const Menu = ({ features = {}, title }) => (
    <Template title={title}>
        <main role='main'>
            <Features {...features} />
        </main>
    </Template>
);

Menu.defaultProps = {
    title: 'Menu | Reactium',
    features: {
        layout: ['col-xs-12 col-md-6', 'col-xs-12 col-md-6'],
        items: [
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-01.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Gourmet All Beef Hotdogs',
            },
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-02.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Vegan Hotdogs',
            },
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-03.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Vegetarian Hotdogs',
            },
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-01.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Gourmet All Beef Hotdogs',
            },
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-02.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Vegan Hotdogs',
            },
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-03.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Vegetarian Hotdogs',
            },
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-01.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Gourmet All Beef Hotdogs',
            },
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-02.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Vegan Hotdogs',
            },
            {
                backgroundImage: 'url(/assets/images/demo-site/feature-03.png)',
                caption:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
                title: 'Vegetarian Hotdogs',
            },
        ],
    },
};

export default Menu;
