/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from "react";
import { Link } from "react-router-dom";

/**
 * -----------------------------------------------------------------------------
 * Functional Component: HeaderNav
 * -----------------------------------------------------------------------------
 */
const HeaderNav = props => {
    let { links = [] } = props;
    return links.length < 1 ? null : (
        <div className={`header-nav`}>
            {links.map((item, i) => {
                let { icon, label = "", to = "/", target = null } = item;
                return target !== null ? (
                    <a href={to} target={target} key={`link-${i}`}>
                        {!icon ? null : <img src={icon} />}
                        {label}
                    </a>
                ) : (
                    <Link to={to} key={`link-${i}`}>
                        {!icon ? null : <img src={icon} />}
                        {label}
                    </Link>
                );
            })}
        </div>
    );
};

export default HeaderNav;
