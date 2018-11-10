const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
const zip = require('folder-zipper');
const decamelize = require('decamelize');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const now = Date.now();

    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    const backupfile = ({ params, props, file }) => {
        const { cwd } = props;
        const { from } = params;

        const regex = new RegExp(from, 'i');
        if (regex.test(file)) {
            return;
        }

        const filename = path.basename(file);
        const backupFilePath = path.normalize(
            `${cwd}/.BACKUP/${now}.${filename}`
        );

        fs.copySync(file, backupFilePath);
    };

    return {
        backup: ({ action, params, props }) => {
            const { cwd } = props;
            const { directory, from } = params;

            message(`backing up ${from} component...`);

            const now = Date.now();
            const backupDir = path.normalize(`${cwd}/.BACKUP/component`);
            const backupZip = path.normalize(`${backupDir}/${now}.${from}.zip`);

            // Create the backup directory
            fs.ensureDirSync(backupDir);

            // Backup the component directory
            return zip(directory, backupZip).then(() => {
                return { action, status: 200 };
            });
        },

        content: ({ action, params, props }) => {
            const { cwd } = props;
            const { files, to, from } = params;

            const ID = decamelize(from).toUpperCase();
            const NEWID = decamelize(to).toUpperCase();

            const regex = new RegExp(from, 'gm');
            const regexLower = new RegExp(String(from).toLowerCase(), 'gm');
            const regexUpper = new RegExp(ID, 'gm');

            return new Promise((resolve, reject) => {
                files.forEach((file, i) => {
                    backupfile({ params, props, file });

                    let content = String(fs.readFileSync(file))
                        .replace(regex, to)
                        .replace(regexLower, String(to).toLowerCase())
                        .replace(regexUpper, NEWID);

                    fs.writeFileSync(file, content, 'utf-8');
                });

                resolve({ action, status: 200 });
            });
        },

        filename: ({ action, params, props }) => {
            const { cwd } = props;
            const { files, to, from } = params;

            const regex = new RegExp(from, 'gm');

            const promises = files
                .filter(file => regex.test(path.basename(file)))
                .map(file => {
                    const dirname = path.dirname(file);
                    const filename = String(path.basename(file)).replace(
                        from,
                        to
                    );
                    const newfile = path.normalize(`${dirname}/${filename}`);

                    return new Promise((resolve, reject) => {
                        fs.copy(file, newfile, error => {
                            if (error) {
                                reject(error);
                            } else {
                                fs.removeSync(file);
                                resolve();
                            }
                        });
                    });
                });

            return Promise.all(promises)
                .then(() => {
                    return { action, status: 200 };
                })
                .catch(err => err);
        },

        move: ({ action, params, props }) => {
            const { directory, destination } = params;
            fs.ensureDirSync(destination);

            return new Promise((resolve, reject) => {
                fs.copy(directory, destination, error => {
                    if (error) {
                        reject(error);
                    } else {
                        fs.removeSync(directory);
                        resolve({ action, status: 200 });
                    }
                });
            });
        },
    };
};
