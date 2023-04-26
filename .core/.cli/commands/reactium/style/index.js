import Reactium from '@atomic-reactor/reactium-sdk-core';

const { ActionSequence, ora, path } = arcli;

const ENUMS = {
    CANCELED: 'style canceled!',
    DESC: 'Reactium: Create or replace a component stylesheet',
    FLAGS: {
        destination: {
            flag: '-d, --destination [destination]',
            desc: 'Directory to save stylesheet',
        },
        type: {
            flag: '-t, --type [type]',
            desc: 'Stylesheet type',
        },
        unattended: {
            flag: '-u, --unattended [unattended]',
            desc: 'Bypass the preflight confirmation and any input prompts',
        },
    },
    NAME: 'style',
};

// prettier-ignore
const HELP = () => console.log(`
Example:
  $ arcli style -h
`);

const ACTION = async ({ opt, props }) => {
    // load hooks
    for (const file of arcli.globby(
        [
            './.core/**/reactium-arcli.js',
            './src/**/reactium-arcli.js',
            './reactium_modules/**/reactium-arcli.js',
            './node_modules/**/reactium-arcli.js',
        ],
        {
            dot: true,
        },
    )) {
        await import(path.resolve(file));
    }

    let params = arcli.flagsToParams({ opt, flags: Object.keys(ENUMS.FLAGS) });

    await Reactium.Hook.run('arcli-style-init', {
        ...props,
        params,
        ENUMS,
    });

    await Reactium.Hook.run('arcli-style-enums', {
        ...props,
        params,
        ENUMS,
    });

    if (params.unattended !== true) {
        await Reactium.Hook.run('arcli-style-input', {
            ...props,
            params,
            ENUMS,
        });
    }

    await Reactium.Hook.run('arcli-style-conform', {
        ...props,
        params,
        ENUMS,
    });

    if (params.unattended !== true) {
        await Reactium.Hook.run('arcli-style-preflight', {
            ...props,
            params,
        });

        await Reactium.Hook.run('arcli-style-confirm', {
            ...props,
            params,
            ENUMS,
        });

        if (params.confirm !== true) {
            arcli.message(ENUMS.CANCELED);
            return;
        }
    }

    console.log('');

    // Start the spinner

    const spinner = ora({ spinner: 'dots', color: 'cyan' });
    spinner.start();

    let actions = {};
    await Reactium.Hook.run('arcli-style-actions', {
        ...props,
        params,
        actions,
        ENUMS,
    });

    return ActionSequence({
        actions,
        options: { params, props, spinner },
    })
        .then(success => {
            spinner.succeed('complete!');
            console.log('');
            return success;
        })
        .catch(error => {
            spinner.fail('error!');
            console.error(error);
            return error;
        });
};

export const COMMAND = ({ program, props }) => {
    program
        .command(ENUMS.NAME)
        .description(ENUMS.DESC)
        .on('--help', HELP)
        .action(opt => ACTION({ opt, props, program }));

    program.commands
        .filter(cmd => Boolean(cmd._name === ENUMS.NAME))
        .forEach(cmd =>
            Object.values(ENUMS.FLAGS).forEach(({ flag, desc }) =>
                cmd.option(flag, desc),
            ),
        );

    return program;
};

export const NAME = ENUMS.NAME;
