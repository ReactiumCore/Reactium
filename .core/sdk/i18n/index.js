import SDK, { isBrowserWindow } from '@atomic-reactor/reactium-sdk-core';
import Jed from 'jed';

const { Hook } = SDK;

class i18n {
    locale = 'en_US';

    constructor() {
        this.setDefaultLocale();
    }

    setDefaultLocale = async () => {
        if (!isBrowserWindow()) this.locale = 'en_US';
        else {
            const langRaw =
                window.navigator.userLanguage || window.navigator.language;
            const [lang, location] = langRaw.replace('-', '_').split('_');
            this.locale = `${lang}_${location}`;
        }

        return Hook.run('set-default-locale', this);
    };

    getStrings() {
        // TODO: ssr version
        const defaultStrings = { strings: JSON.stringify({}) };

        try {
            if (isBrowserWindow()) {
                const context = require.context(
                    'babel-loader!@atomic-reactor/webpack-po-loader!reactium-translations',
                    true,
                    /.pot?$/,
                );

                if (
                    context
                        .keys()
                        .find(
                            translation =>
                                translation === `./${this.locale}.po`,
                        )
                ) {
                    return context(`./${this.locale}.po`);
                }

                return context('./template.pot');
            } else {
                return defaultStrings;
            }
        } catch (error) {
            return defaultStrings;
        }
    }

    getJed() {
        return new Jed(JSON.parse(this.getStrings().strings));
    }
}

export default new i18n();
