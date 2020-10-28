import SDK from '@atomic-reactor/reactium-sdk-core';
import op from 'object-path';
const { Hook, Utils } = SDK;

class ServiceWorker {
    constructor() {
        this.script = '/assets/js/sw/sw.js';
    }

    set script(path) {
        this.scriptPath = path;
    }

    get script() {
        return this.scriptPath;
    }

    set worker(wb) {
        this.wb = wb;
    }

    get worker() {
        return this.wb;
    }

    init = async () => {
        await Hook.run('service-worker-init');
    };

    async version() {
        const worker = this.worker;
        return (
            worker &&
            worker.messageSW &&
            worker.messageSW({
                type: 'GET_VERSION',
            })
        );
    }
}

const swManager = new ServiceWorker();

Hook.register('service-worker-init', async () => {
    if (typeof window === 'undefined') return;
    const { Workbox } = await import('workbox-window');
    const sw = new Workbox(swManager.script, { scope: '/' });
    swManager.worker = sw;

    sw.addEventListener('install', event => {
        console.log('Service Worker installed.');
    });

    sw.addEventListener('waiting', event => {
        console.log('Service Worker waiting to update.');
    });

    sw.addEventListener('activated', event => {
        if (!event.isUpdate) {
            console.log('Service Worker activated.');
        } else {
            console.log('Service Worker updated.');
        }
    });

    sw.addEventListener('controlling', event => {
        console.log('Service Worker captured client connections.');
    });

    try {
        await sw.register();
        console.log('SW registered.');
    } catch (error) {
        console.error({ error });
    }
});

export default swManager;
