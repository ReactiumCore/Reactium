import _ from 'underscore';
import uuid from 'uuid/v4';
import ENUMS from './enums';
import op from 'object-path';
import Reactium from 'reactium-core/sdk';
import api from 'appdir/api/config';
import Parse from 'appdir/api';
import moment from 'moment';

const SCRIPT = '/assets/js/umd/media-uploader/media-uploader.js';

const debug = (caller, ...args) =>
    ENUMS.DEBUG === true ? console.log(caller, ...args) : () => {};

const paramToArray = value => _.compact(Array.isArray(value) ? value : [value]);

const mapFileToUpload = file => {
    const {
        ID,
        name: filename,
        progress = 0,
        size: total,
        status,
        statusAt,
    } = file;

    return {
        ID,
        action,
        file,
        filename,
        progress,
        status,
        statusAt,
        total,
    };
};

class Media {
    constructor() {
        this.ENUMS = ENUMS;
        this.worker = null;

        const Worker = typeof window !== 'undefined' ? window.Worker : null;

        if (Worker !== null) {
            const sessionToken = Parse.User.current().getSessionToken();

            this.worker = new Worker(SCRIPT);
            this.worker.addEventListener('message', e =>
                this.__onWorkerMessage(e),
            );
            this.worker.postMessage({
                action: 'initialize',
                params: { ...api, sessionToken },
            });
        }
    }

    __onStatus(params) {
        const { uploads = {} } = this.state;
        const { ID, progress, status, url } = params;

        op.set(uploads, [ID, 'status'], status);
        op.set(uploads, [ID, 'statusAt'], Date.now());

        if (progress > 0) {
            op.set(uploads, [ID, 'progress'], Number(progress));
        }

        if (op.has(params, 'url')) {
            op.set(uploads, [ID, 'url'], params.url);
        }

        this.setState({ uploads });
    }

    __onWorkerMessage(e) {
        const { type, params } = e.data;

        switch (type) {
            case 'status':
                this.__onStatus(params);
                break;
        }
    }

    get state() {
        const { getState } = Reactium.Plugin.redux.store;
        return getState().Media;
    }

    setState(newState = {}) {
        const { dispatch } = Reactium.Plugin.redux.store;
        dispatch({
            type: ENUMS.ACTION_TYPE,
            domain: ENUMS.DOMAIN,
            update: newState,
        });
    }

    upload(files, directory = ENUMS.DIRECTORY) {
        // 0.0 - convert single file to array of files
        files = paramToArray(files);

        // 1.0 - Get State
        const { uploads = {} } = this.state;

        // 2.0 - Loop through files array
        files.forEach(file => {
            // 2.1 - Update uploads state object
            const upload = mapFileToUpload(file);
            upload['directory'] = directory;
            uploads[file.ID] = upload;
            upload['status'] = ENUMS.STATUS.QUEUED;

            // 2.2 - Send file to media-upload Web Worker
            this.worker.postMessage({ action: 'addFile', params: upload });
        });

        // 3.0 - Update State
        this.setState({ uploads });
    }

    cancel(files) {
        // 0.0 - Covnert single file to array of files
        files = paramToArray(files);

        // 1.0 - Get State
        const { uploads = {} } = this.state;

        // 2.0 - Loop through files array
        files.forEach(file => {
            delete uploads[file.ID];
            this.worker.postMessage({ action: 'removeFile', params: file.ID });
        });

        // 3.0 - Update State
        this.setState({ uploads });
    }

    clear(expired = 5) {
        // 1.0 - get state
        const { uploads = {} } = this.state;
        const len = Object.keys(uploads).length;
        let changed = false;

        // 2.0 - Get completed uploads
        const completed = _.where(Object.values(uploads), {
            status: ENUMS.STATUS.COMPLETE,
        }).filter(item => {
            const { ID, statusAt } = item;
            const diff = moment().diff(moment(new Date(statusAt)), 'seconds');
            return diff >= expired;
        });

        completed.forEach(item => {
            changed = true;
            delete uploads[item.ID];
        });

        if (changed) {
            this.setState({ uploads });
        }
    }

    async fetch({ page = 1, search }) {
        const { library = {} } = this.state;
        const media = await Reactium.Cloud.run('media', {
            page,
            search,
            limit: 50,
        });
        const { directories = [ENUMS.DIRECTORY], files, ...pagination } = media;

        if (Object.keys(files).length > 0) {
            library[page] = files;
        } else {
            delete library[page];
        }

        this.setState({
            directories,
            library,
            pagination,
            fetched: Date.now(),
        });
    }
}

export default new Media();
