import i18n from '../i18n';

/**
 * @api {Function} __(text) __()
 * @apiDescription Wrap this around string literals to make them translateable with gettext Poedit utility.
 Run `arcli i18n` to extract strings to `src/reactium-translations/template.pot` by default.
 * @apiName __
 * @apiParam {StringLiteral} text the text to be translated. Important: this should not be a variable. It must be a string literal, or
 `arcli i18n` command will not be able to locate the string. This string may not be an ES6 template literal.
 * @apiGroup i18n
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
 * @apiGroup i18n
 */
export const _n = (...params) => i18n.getJed().ngettext(...params);
