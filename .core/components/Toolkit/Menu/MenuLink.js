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
        <a
            className={className}
            href={route}
            target={target}
            onClick={onItemClick}>
            {label}
        </a>
    ) : (
        <NavLink className={className} exact={true} to={route}>
            {label}
        </NavLink>
    );

export default MenuLink;
