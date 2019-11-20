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
        ERROR: Symbol(uuid()),
        READY: Symbol(uuid()),
        RUNNING: Symbol(uuid()),
        STARTED: Symbol(uuid()),
        STOPPED: Symbol(uuid()),
    },
};

export default ENUMS;
