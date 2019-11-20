import uuid from 'uuid/v4';

const ENUMS = {
    ERROR: {
        ID: 'Pulse.register() - ID is a required parameter',
        CALLBACK:
            'Pulse.register() - The callback function is a required parameter',
    },
    DEBUG: false,
    DEFAULT: {
        ATTEMPTS: -1,
        AUTOSTART: true,
        DELAY: 1000,
        REPEAT: -1,
    },
    STATUS: {
        ERROR: 'ERROR',
        READY: 'READY',
        RUNNING: 'RUNNING',
        STARTED: 'STARTED',
        STOPED: 'STOPPED',
    },
};

export default ENUMS;
