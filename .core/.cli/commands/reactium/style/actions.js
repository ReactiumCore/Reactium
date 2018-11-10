const fs = require('fs-extra');
const path = require('path');
const op = require('object-path');
const prettier = require('prettier');
const chalk = require('chalk');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        backup: ({ action, params, props }) => {
            const { filename, filepath, overwrite } = params;
            const { cwd, root } = props;

            return new Promise((resolve, reject) => {
                if (overwrite !== true) {
                    resolve({ action, status: 200 });
                    return;
                }

                message(`backing up ${chalk.cyan(filename)}...`);

                const now = Date.now();
                const dir = path.normalize(`${cwd}/.BACKUP/style`);
                const backup = path.normalize(`${dir}/${now}.${filename}`);

                // Create the backup directory
                fs.ensureDirSync(dir);

                // Copy
                fs.copy(path.normalize(filepath), backup, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },

        create: ({ action, params }) => {
            const { destination, filename, filepath, overwrite } = params;

            const actionType = overwrite === true ? 'overwritting' : 'creating';

            message(`${actionType} stylesheet ${chalk.cyan(filename)}...`);

            fs.ensureDirSync(path.normalize(destination));

            // Template content
            const template = path.normalize(`${__dirname}/template/style.hbs`);
            const content = handlebars(fs.readFileSync(template, 'utf-8'))(
                params
            );

            return new Promise((resolve, reject) => {
                fs.writeFile(filepath, content, error => {
                    if (error) {
                        reject(error.Error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },

        inject: ({ action, params }) => {
            const { importString = [], inject = [] } = params;

            const promises =
                inject.length > 0
                    ? inject.map(
                          (filepath, i) =>
                              new Promise((resolve, reject) => {
                                  const istring = `\n@import '${
                                      importString[i]
                                  }';`;
                                  let content = fs.readFileSync(
                                      filepath,
                                      'utf-8'
                                  );
                                  if (content.indexOf(istring) < 0) {
                                      content += istring;
                                      fs.writeFile(filepath, content, error => {
                                          if (error) {
                                              reject(error);
                                          } else {
                                              resolve({
                                                  action,
                                                  filepath,
                                                  status: 200,
                                              });
                                          }
                                      });
                                  } else {
                                      resolve({
                                          action,
                                          filepath,
                                          status: 200,
                                      });
                                  }
                              })
                      )
                    : [];

            return promises.length > 0
                ? Promise.all(promises)
                : new Promise(resolve => resolve({ action, status: 200 }));
        },
    };
};
