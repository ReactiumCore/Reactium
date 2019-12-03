const ENUMS = {
    ACTION_TYPE: 'DOMAIN_UPDATE',
    DEBUG: false,
    DIRECTORY: 'uploads',
    DOMAIN: 'Media',
    MAX_UPLOADS: 3,
    STATUS: {
        CANCELED: 'canceled',
        COMPLETE: 'complete',
        QUEUED: 'queued',
        UPLOADING: 'uploading',
    },
    TYPE: {
        AUDIO: ['MP3', 'OGG', 'WAV'],
        PDF: ['PDF'],
        VIDEO: [
            'WEBM',
            'MPG',
            'MP2',
            'MPEG',
            'MPE',
            'MPV',
            'OGG',
            'MP4',
            'M4P',
            'M4V',
            'AVI',
            'WMV',
            'MOV',
            'QT',
            'FLV',
            'SWF',
            'AVCHD',
        ],
    },
};

export { ENUMS as default };
