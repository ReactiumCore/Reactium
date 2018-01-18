import express from 'express';
import renderer from './renderer';

const router = express.Router();
router.get('*', (req, res) => {
    let context = {};
    renderer(req, res, context)
    .then(content => {
        if (context.url) {
          return res.redirect(301, context.url);
        }
        if (context.notFound) {
          res.status(404);
        }

        res.send(content);
    })
    .catch(err => {
        console.error(err);
        res.status(500);
    });
});

export default router;
