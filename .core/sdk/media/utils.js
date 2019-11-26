import _ from 'underscore';
import b64 from 'base64-js';
import ENUMS from './enums';

const fileToBytes = file => b64.toByteArray(file.dataURL.split(',').pop());

const fileToChunks = (file, chunkSize) => {
    const chunks = _.chain(fileToBytes(file))
        .chunk(chunkSize || ENUMS.MAX_BYTES)
        .value();

    return { ...chunks };
};

const fileUploadShim = async file => {
    const uploadObj = {
        bytesSent: 0,
        chunked: true,
        filename: null,
        progress: 0,
        total: 0,
        totalChunkCount: 0,
    };

    const data = {
        ...uploadObj,
        filename: file.name,
        total: file.size,
    };

    // create the ID value
    if (!op.get(file, 'ID')) {
        file.ID = uuid();
    }

    // create dataURL value
    if (!file.datauURL) {
        const dataURL = await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onerror = () => {
                reader.abort();
                reject();
            };

            reader.onload = ({ target }) => resolve(target.result);
            reader.readAsDataURL(file);
        });

        file.dataURL = dataURL;
    }

    return file;
};

export { fileToBytes, fileToChunks, fileUploadShim };
