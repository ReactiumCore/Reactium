import _ from 'underscore';
import uuid from 'uuid/v4';
import ENUMS from './enums';
import op from 'object-path';
import Reactium from 'reactium-core/sdk';
import { fileToChunks, fileUploadShim } from './utils';

const debug = (caller, ...args) =>
    ENUMS.DEBUG === true ? console.log(caller, ...args) : () => {};

const valueToArray = value => _.compact(Array.isArray(value) ? value : [value]);

const reduxCheck = () => {
    if (!Reactium.Plugin.redux) {
        throw new Error(
            'Reactium.Media.upload() requires the Reactium.Plugin.redux store.',
        );
        return true;
    }
};

const cloudCheck = () => {
    if (!Reactium.Cloud) {
        throw new Error(
            'Reactium.Media.uploadChunk() requires the Reactium.Cloud API.',
        );
        return true;
    }
};

class Media {
    constructor() {
        this.ENUMS = ENUMS;
        this.fileToChunks = fileToChunks;
    }

    async upload(files = [], directory = 'uploads') {
        if (reduxCheck()) return;

        files = valueToArray(files);

        if (files.length < 1) return;

        const { dispatch, getState } = Reactium.Plugin.redux.store;
        const { files: currentFiles = {}, uploads = {} } = getState().Media;

        // Queue chunks
        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            // Shim the file object if it's been uploaded outside of a Dropzone
            if (!file.upload) {
                upload = await fileUploadShim(file);
            }

            const { ID, upload } = file;

            if (op.get(uploads, ID)) return;

            file.action = ENUMS.STATUS.UPLOADING;
            file.directory =
                file.directory || op.get(file, 'directory', directory);

            const obj = {
                ID,
                ...upload,
                chunks: await fileToChunks(file),
                directory: file.directory,
                status: ENUMS.STATUS.QUEUED,
            };

            obj['totalChunkCount'] = Object.keys(obj.chunks).length;

            if (!op.get(currentFiles, ID)) {
                currentFiles[ID] = file;
            }

            uploads[ID] = obj;
        }

        // Update state
        return dispatch({
            domain: ENUMS.DOMAIN,
            type: ENUMS.ACTION_TYPE,
            update: { files: currentFiles, uploads },
        });
    }

    async uploadChunk(upload) {
        if (reduxCheck() || cloudCheck()) return;

        delete upload.chunks;

        return Reactium.Cloud.run('upload-chunk', upload).then(result => {
            const { chunk, ID, index, total } = upload;
            const { dispatch, getState } = Reactium.Plugin.redux.store;
            const {
                completed = [],
                files = {},
                uploads = {},
            } = getState().Media;

            const bytesSent =
                op.get(uploads, [ID, 'bytesSent'], 0) + chunk.length;

            const progress = bytesSent / total;

            const status =
                progress >= 1 ? ENUMS.STATUS.COMPLETE : ENUMS.STATUS.UPLOADING;

            op.set(uploads, [ID, 'bytesSent'], bytesSent);
            op.set(uploads, [ID, 'progress'], progress);
            op.set(uploads, [ID, 'action'], status);
            op.set(files, [ID, 'action'], status);

            if (status === ENUMS.STATUS.COMPLETE) {
                const { file } = result;
                op.set(uploads, [ID, 'url'], file.url);
                op.set(files, [ID, 'url'], file.url);
                completed.push(ID);
            }

            dispatch({
                domain: ENUMS.DOMAIN,
                type: ENUMS.ACTION_TYPE,
                update: { completed, files, uploads },
            });

            result['upload'] = upload;
            return result;
        });
    }

    removeChunks(file) {
        const { dispatch, getState } = Reactium.Plugin.redux.store;
        const { files = {}, uploads = {} } = getState().Media;

        const { ID } = file;
        delete files[ID];
        delete uploads[ID];

        dispatch({
            domain: ENUMS.DOMAIN,
            type: ENUMS.ACTION_TYPE,
            update: { files, uploads },
        });
    }

    async fetch({ directory, page = 1, search }) {
        const { dispatch, getState } = Reactium.Plugin.redux.store;
        const { library = {} } = getState().Media;

        const media = await Reactium.Cloud.run('media', {
            directory,
            page,
            search,
        });
        const { directories = ['uploads'], files, ...pagination } = media;

        if (Object.keys(files).length > 0) {
            library[page] = files;
        } else {
            delete library[page];
        }

        return await dispatch({
            domain: ENUMS.DOMAIN,
            type: ENUMS.ACTION_TYPE,
            update: { directories, library, pagination, fetched: Date.now() },
        });
    }
}

export default new Media();
