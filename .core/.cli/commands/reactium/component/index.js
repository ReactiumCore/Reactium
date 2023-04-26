import Reactium from '@atomic-reactor/reactium-sdk-core';

arcli.Reactium = Reactium;

const { ActionSequence, ora, path } = arcli;

const ENUMS = {
    CANCELED: 'component canceled!',
    DESC: 'Reactium: Create or replace a component',
    FLAGS: {
        destination: {
            flag: '-d, --destination [destination]',
            desc: 'Component parent directory',
        },
        name: {
            flag: '-n, --name [name]',
            desc: 'String used when importing',
        },
        route: {
            flag: '-r, --route [route]',
            desc: 'Direct routes to the component',
        },
        hooks: {
            flag: '-H, --hooks [hooks]',
            desc:
                'Create Reactium hooks file and register component for useHookComponent() usage',
        },
        style: {
            flag: '-s, --style [style]',
            desc: 'Create a stylesheet file',
        },
        domain: {
            flag: '-D, --domain [domain]',
            desc: 'Create domain.js file',
        },
        unattended: {
            flag: '-u, --unattended [unattended]',
            desc: 'Bypass the preflight confirmation and any input prompts',
        },
    },
    NAME: 'component',
};

export const NAME = ENUMS.NAME;

// prettier-ignore
const HELP = () => console.log(`
Example:
  $ arcli component -h

  $ arcli component -n Test

  $ arcli component -s atoms

  $ arcli component -r "/route-1, /route-1/:param"
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

    try {
        await Reactium.Hook.run('arcli-component-init', {
            ...props,
            params,
            ENUMS,
        });
    } catch (err) {
        console.log(err);
        process.exit();
    }

    try {
        await Reactium.Hook.run('arcli-component-enums', {
            ...props,
            params,
            ENUMS,
        });
    } catch (err) {
        console.log(err);
        process.exit();
    }

    if (params.unattended !== true) {
        try {
            await Reactium.Hook.run('arcli-component-input', {
                ...props,
                params,
                ENUMS,
            });
        } catch (err) {
            console.log(err);
            process.exit();
        }
    }

    try {
        await Reactium.Hook.run('arcli-component-conform', {
            ...props,
            params,
            ENUMS,
        });
    } catch (err) {
        console.log(err);
        process.exit();
    }

    if (params.unattended !== true) {
        try {
            await Reactium.Hook.run('arcli-component-preflight', {
                ...props,
                params,
            });
        } catch (err) {
            console.log(err);
            process.exit();
        }

        try {
            await Reactium.Hook.run('arcli-component-confirm', {
                ...props,
                params,
                ENUMS,
            });
        } catch (err) {
            console.log(err);
            process.exit();
        }

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
    try {
        await Reactium.Hook.run('arcli-component-actions', {
            ...props,
            params,
            actions,
            spinner,
            ENUMS,
        });
    } catch (err) {
        console.log(err);
        process.exit();
    }

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
