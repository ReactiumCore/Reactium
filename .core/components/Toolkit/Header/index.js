/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import _ from 'underscore';

/**
 * -----------------------------------------------------------------------------
 * React Component: Header
 * -----------------------------------------------------------------------------
 */

const selectedTheme = ({ themes = [], style }) => {
    return themes.length > 1
        ? _.findWhere(themes, { css: style })
        : { css: null };
};

const Header = ({
    logo,
    minThemes,
    onThemeChange,
    themes,
    title,
    version,
    style,
}) => (
    <header className='re-toolkit-header'>
        {logo && (
            <a href='/toolkit'>
                <img className='re-toolkit-header-logo' src={logo} />
            </a>
        )}
        {title && <h1>{title}</h1>}
        {version && <small>{version}</small>}
        {themes.length > minThemes && (
            <select
                className='re-toolkit-select'
                defaultValue={selectedTheme({ themes, style })}
                onChange={onThemeChange}>
                {themes.map(({ css, name }, i) => (
                    <option key={i} value={css}>
                        {name}
                    </option>
                ))}
            </select>
        )}
    </header>
);

Header.defaultProps = {
    logo: null,
    minThemes: 1,
    onThemeChange: null,
    themes: [],
    title: null,
    version: null,
};

export default Header;
