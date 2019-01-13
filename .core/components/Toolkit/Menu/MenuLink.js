import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuLink = ({
    label,
    onItemClick,
    redirect,
    route,
    target,
    className = 'link',
}) =>
    redirect === true ? (
        <a className={className} href={route} target={target}>
            {label}
        </a>
    ) : (
        <NavLink
            className={className}
            exact={true}
            to={route}
            onClick={onItemClick}>
            {label}
        </NavLink>
    );

export default MenuLink;
