/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { forwardRef } from 'react';
import HeaderNav from './HeaderNav';

/**
 * -----------------------------------------------------------------------------
 * React Component: Header
 * -----------------------------------------------------------------------------
 */

let Header = ({ backgroundImage, children, nav, style = {} }, ref) => {
    if (backgroundImage) {
        style['backgroundImage'] = backgroundImage;
    }

    return (
        <header style={style} ref={ref}>
            <div className={'shadow'} />
            <HeaderNav links={nav} />
            {children}
        </header>
    );
};

Header = forwardRef(Header);

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
