/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import HeaderNav from './HeaderNav';

/**
 * -----------------------------------------------------------------------------
 * React Component: Header
 * -----------------------------------------------------------------------------
 */

const Header = ({ backgroundImage, children, nav, style = {} }) => {
    if (backgroundImage) {
        style['backgroundImage'] = backgroundImage;
    }

    return (
        <header style={style}>
            <div className={'shadow'} />
            <HeaderNav links={nav} />
            {children}
        </header>
    );
};

Header.defaultProps = {
    style: { marginBottom: 0 },
    backgroundImage: 'url(/assets/images/demo-site/header.png)',
    nav: [
        {
            to: '/demo/site',
            label: 'Home',
        },
        {
            to: 'https://www.instagram.com/explore/tags/hotdogs',
            icon: '/assets/images/demo-site/icon-instagram.png',
            label: '#hotdogs',
            target: '_blank',
        },
    ],
};

export default Header;
