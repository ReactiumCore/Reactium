import i18n from '../i18n';

/**
 * @api {Function} __(text) __()
 * @apiDescription Wrap this around string literals to make them translateable with gettext Poedit utility.
 Run `arcli i18n` to extract strings to `src/reactium-translations/template.pot` by default.
 * @apiName __
 * @apiParam {StringLiteral} text the text to be translated. Important: this should not be a variable. It must be a string literal, or
 `arcli i18n` command will not be able to locate the string. This string may not be an ES6 template literal.
 * @apiGroup Translation
 * @apiExample Usage
import React from 'react';
import { __ } = 'reactium-core/sdk';

export default () => {
    return (
        <div>{__('My Translatable string.')}</div>
    );
};
 */
export const __ = (...params) => i18n.getJed().gettext(...params);

/**
 * @api {Function} _n(singular,plural,count) _n()
 * @apiDescription Wrap this around string literals to make them translateable with gettext Poedit utility.
 Run `arcli i18n` to extract strings to `src/reactium-translations/template.pot` by default.
 * @apiName _n
 * @apiParam {StringLiteral} singular the singular form text to be translated. Important: this should not be a variable. It must be a string literal, or
 `arcli i18n` command will not be able to locate the string. This string may not be an ES6 template literal.
 * @apiParam {StringLiteral} plural the plural form text to be translated. Important: this should not be a variable. It must be a string literal, or
 `arcli i18n` command will not be able to locate the string. This string may not be an ES6 template literal.
 * @apiParam {Number} count the number related to singular or plural string
 * @apiGroup Translation
 * @apiExample Usage
import React from 'react';
import { _n } = 'reactium-core/sdk';

export default props => {
    const count = props.count;
    // singular / plural translation
    const label = _n('%s thing', '%s things', count).replace('%s', count);
    return (
        <div>{label}</div>
    );
};
 */
export const _n = (...params) => i18n.getJed().ngettext(...params);
