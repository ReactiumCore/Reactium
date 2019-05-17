/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import _ from 'underscore';
import op from 'object-path';

/**
 * -----------------------------------------------------------------------------
 * React Component: Header
 * -----------------------------------------------------------------------------
 */

const selectedTheme = ({ themes = [], style, assetPath = '/assets' }) => {
    style = style.replace(/^\/assets/, assetPath);
    let theme =
        _.findWhere(themes, { css: style }) ||
        _.findWhere(themes, { selected: true });
    theme =
        typeof theme === 'undefined'
            ? _.findWhere(themes, { css: '/assets/style/style.css' }) ||
              _.findWhere(themes, { css: `${assetPath}/style/style.css` })
            : theme;

    return op.get(theme, 'css', style);
};

const Header = ({
    logo,
    minThemes,
    onThemeChange,
    themes,
    title,
    version,
    style,
    assetPath = '/assets',
}) => (
    <header className='re-toolkit-header'>
        {logo && (
            <a href='/toolkit'>
                <img
                    className='re-toolkit-header-logo'
                    src={logo.replace(/^\/assets/, assetPath)}
                />
            </a>
        )}
        {title && <h1>{title}</h1>}
        {version && <small>{version}</small>}
        {themes.length > minThemes && (
            <select
                className='re-toolkit-select'
                defaultValue={selectedTheme({ themes, style, assetPath })}
                onChange={onThemeChange}>
                <option value={false}>Theme</option>
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
    minThemes: 0,
    onThemeChange: null,
    themes: [],
    title: null,
    version: null,
};

export default Header;
