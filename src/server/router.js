import fs from 'fs';
import path from 'path';
import express from 'express';

const router = express.Router();

const template = (name, data = {}) => {
    let ext = name.split('.').pop();
    if (ext !== 'hbs' && ext !== 'html') {
        name += '.hbs';
    }
    let file = path.resolve(process.cwd(), 'src/server/views', name);
    if (!fs.existsSync(file)) {
        return `template not found ${file}`;
    }

    let markup = fs.readFileSync(file, 'utf-8');

    Object.keys(data).forEach((key) => {
        let reg = new RegExp('{{'+key+'}}', 'gi');
        markup = markup.replace(reg, data[key]);
    });

    markup = markup.replace(/{{\s*[\w\.]+\s*}}/g, '');

    return markup;
};


router.all('*', (req, res) => {
    // TODO: Inject a component's content

    // get component content
    let content = 'hello world!';

    res.send(template('index', {router: content}));
});

export default router;
