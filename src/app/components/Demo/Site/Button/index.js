/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * -----------------------------------------------------------------------------
 * React Component: Button
 * -----------------------------------------------------------------------------
 */

const PrimaryButton = ({ type = 'button', ...props }) => {
    switch (type) {
        case 'link':
            return <Link {...props} />;

        case 'nav':
            return <NavLink {...props} />;

        case 'label':
            return <label {...props} />;

        default:
            return <button {...props} />;
    }
};

PrimaryButton.defaultProps = {
    className: 'btn btn-primary',
    type: 'button',
};

export { PrimaryButton as default, PrimaryButton };
