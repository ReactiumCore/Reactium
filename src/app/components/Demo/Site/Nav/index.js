/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * -----------------------------------------------------------------------------
 * Nav
 * -----------------------------------------------------------------------------
 */

const Nav = ({ buttons, fixed }) => (
    <nav className={fixed === true ? 'main fixed' : 'main'}>
        <div>
            <ul>
                {buttons.map((item, i) => (
                    <li key={`nav-${i}`}>
                        <NavLink {...item}>{item.label}</NavLink>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
);

Nav.defaultProps = {
    fixed: false,
    buttons: [
        { type: 'nav', exact: true, to: '/demo/site/menu', label: 'Menu' },
        {
            type: 'nav',
            exact: true,
            to: '/demo/site/catering',
            label: 'Catering',
        },
        { type: 'nav', exact: true, to: '/demo/site/about', label: 'About Us' },
        {
            type: 'nav',
            exact: true,
            to: '/demo/site/contact',
            label: 'Contact',
        },
    ],
};

export default Nav;
