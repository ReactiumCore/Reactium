/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';

/**
 * -----------------------------------------------------------------------------
 * Nav
 * -----------------------------------------------------------------------------
 */

let Nav = ({ buttons, fixed }, ref) => (
    <nav className={fixed === true ? 'main fixed' : 'main'} ref={ref}>
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

Nav = forwardRef(Nav);

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
