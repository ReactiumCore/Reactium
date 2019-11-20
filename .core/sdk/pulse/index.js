import uuid from 'uuid/v4';
import ENUMS from './enums';
import op from 'object-path';

const _ID = Symbol(uuid());
const _attempt = Symbol(uuid());
const _attempts = Symbol(uuid());
const _autostart = Symbol(uuid());
const _callback = Symbol(uuid());
const _count = Symbol(uuid());
const _complete = Symbol(uuid());
const _delay = Symbol(uuid());
const _error = Symbol(uuid());
const _params = Symbol(uuid());
const _pending = Symbol(uuid());
const _registry = Symbol(uuid());
const _repeat = Symbol(uuid());
const _timer = Symbol(uuid());
const _status = Symbol(uuid());

const debug = (...args) => {
    if (ENUMS.DEBUG !== true) {
        return;
    }

    console.log(...args);
};

class Pulse {
    constructor() {
        this.Task = PulseTask;
        this.ENUMS = ENUMS;
        this[_registry] = {};
    }

    get(ID) {
        return op.get(this[_registry], ID);
    }

    register(ID, callback, options = {}, ...params) {
        if (!ID) {
            throw new Error(ENUMS.ERROR.ID);
            return;
        }

        if (!callback) {
            throw new Error(ENUMS.ERROR.CALLBACK);
            return;
        }

        options['ID'] = ID;
        options['callback'] = callback;

        if (!this.get(ID)) {
            this[_registry][ID] = new PulseTask(options, params);
        }

        return this.get(ID);
    }

    unregister(ID) {
        if (ID) {
            const task = this.get(ID);
            if (task) {
                task.stop();
                const ival = setInterval(() => {
                    if (task.status === ENUMS.STATUS.RUNNING) {
                        return;
                    }
                    clearInterval(ival);
                    delete this[_registry][ID];
                }, 1);
            }
        }

        return this;
    }

    start(ID) {
        const task = this.get(ID);
        if (task) {
            task.start();
        }

        return this;
    }

    startAll() {
        Object.values(this[_registry])
            .filter(task => Boolean(task.status !== ENUMS.STATUS.STARTED))
            .forEach(task => task.start());

        return this;
    }

    stop(ID) {
        const task = this.get(ID);
        if (task) {
            task.stop();
        }

        return this;
    }

    stopAll() {
        Object.values(this[_registry]).forEach(task => task.stop());
        return this;
    }
}

/**
 * @api {Object} Reactium.Pulse.Task Pulse.Task
 * @apiGroup Reactium.Pulse.Task
 * @apiName Reactium.Pulse.Task
 * @apiDescription Pulse Task object that performs the heavy lifting for the Pulse API.
 */
class PulseTask {
    constructor(options = {}, params) {
        this[_callback] = op.get(options, 'callback');

        this[_status] = ENUMS.STATUS.READY;

        this[_ID] = op.get(options, 'ID', uuid());
        this[_attempt] = 0;
        this[_attempts] = op.get(options, 'attempts', ENUMS.DEFAULT.ATTEMPTS);
        this[_autostart] = op.get(
            options,
            'autostart',
            ENUMS.DEFAULT.AUTOSTART,
        );
        this[_complete] = false;
        this[_count] = 0;
        this[_delay] = op.get(options, 'delay', ENUMS.DEFAULT.DELAY);
        this[_error] = null;
        this[_params] = params;
        this[_repeat] = op.get(options, 'repeat', ENUMS.DEFAULT.REPEAT);
        this[_repeat] = isNaN(this[_repeat])
            ? ENUMS.DEFAULT.REPEAT
            : this[_repeat];

        this[_timer] = null;

        if (this[_autostart] === true) {
            this.start();
        }
    }

    /**
     * @api {Property} Reactium.Pulse.Task.attempt Pulse.Task.attempt
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.attempt
     * @apiDescription [read-only] The current attempt for the active task. Returns: `Number`.
     */
    get attempt() {
        return this[_attempt];
    }

    /**
     * @api {Property} Reactium.Pulse.Task.attempts Pulse.Task.attempts
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.attempts
     * @apiDescription The number of times a task will retry before it fails. Default: `-1`. You can set this value after the task has started.
     */
    get attempts() {
        return this[_attempts];
    }

    set attempts(value) {
        if (!isNaN(value)) {
            this[_attempts] = Number(value);
        }
    }

    /**
     * @api {Property} Reactium.Pulse.Task.autostart Pulse.Task.autostart
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.autostart
     * @apiDescription [read-only] If the task autastarted upon creation. Default: `true`.
     */
    get autostart() {
        return this[_autostart];
    }

    /**
     * @api {Property} Reactium.Pulse.Task.complete Pulse.Task.complete
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.complete
     * @apiDescription [read-only] Relevant only when the `repeat` property is higher than 1. Returns: `Boolean`.
     */
    get complete() {
        return this.progress >= 1;
    }

    /**
     * @api {Property} Reactium.Pulse.Task.count Pulse.Task.count
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.count
     * @apiDescription [read-only] The current number of times the task has succeeded. Returns: `Number`.
     */
    get count() {
        return this[_count];
    }

    /**
     * @api {Property} Reactium.Pulse.Task.delay Pulse.Task.delay
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.attempt
     * @apiDescription The current attempt for the active task. Returns: `Number`.
     */
    get delay() {
        return this[_delay];
    }

    set delay(value) {
        this[_delay] = Number(value);
    }

    /**
     * @api {Property} Reactium.Pulse.Task.error Pulse.Task.error
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.error
     * @apiDescription [read-only] The current error message if applicable. Returns: `string`.
     */
    get error() {
        return String(this[_error]);
    }

    /**
     * @api {Property} Reactium.Pulse.Task.ID Pulse.Task.ID
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.ID
     * @apiDescription [read-only] The unique ID of the task. Returns: `String`.
     */
    get ID() {
        return String(this[_ID]);
    }

    /**
     * @api {Property} Reactium.Pulse.Task.timer Pulse.Task.timer
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.timer
     * @apiDescription [read-only] The reference to the current setTimeout. This value will change for each task run. Returns: `Number`.
     */
    get timer() {
        return this[_timer];
    }

    /**
     * @api {Property} Reactium.Pulse.Task.progress Pulse.Task.progress
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.progress
     * @apiDescription [read-only] The current amount of the repeat that has been completed. Relevant only when `repeat` is higher than 1. Returns: `0-1`.
     */
    get progress() {
        if (this.repeat === ENUMS.DEFAULT.REPEAT) {
            return 0;
        }

        const p = this.count / this.repeat;

        this[_complete] = p === 1;

        return p;
    }

    /**
     * @api {Property} Reactium.Pulse.Task.failed Pulse.Task.failed
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.failed
     * @apiDescription [read-only] Expresses if the current task has reached the maximum attempts. Returns: `Boolean`.
     */
    get failed() {
        if (this.attempts < 0) {
            return false;
        }
        if (this.attempt < this.attempts) {
            return false;
        }

        return true;
    }

    /**
     * @api {Property} Reactium.Pulse.Task.status Pulse.Task.status
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.status
     * @apiDescription [read-only] The current status of the task. For comparing the status use the Pulse.ENUMS.STATUS values
     * @apiExample Example usage:
const task = Pulse.get('MyTask');
if (task.status === Pulse.ENUMS.STATUS.STOPPED) {
    task.start();
}
     */
    get status() {
        this[_complete] = this.progress === 1;
        return this[_status];
    }

    /**
     * @api {Property} Reactium.Pulse.Task.repeat Pulse.Task.repeat
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.repeat
     * @apiDescription The current number of times to run the task. Returns: `Number`.
     */
    get repeat() {
        return this[_repeat];
    }

    set repeat(value) {
        this[_repeat] = value;
    }

    onSuccess(result) {
        debug('onSuccess()', this);

        if (
            this.status === ENUMS.STATUS.STOPPED ||
            this[_pending] === ENUMS.STATUS.STOPPED
        ) {
            console.log(0);
            return this.stop();
        }

        this[_timer] = null;
        this[_error] = null;
        this[_attempt] = 1;
        this[_status] = ENUMS.STATUS.READY;

        if (this[_repeat] === -1) {
            return this.start();
        }

        if (this.complete) {
            return this.stop();
        } else {
            return this.start();
        }

        return this;
    }

    onError(err) {
        debug('onError()', this);
        this[_error] = err;
        this[_status] = ENUMS.STATUS.ERROR;
        this[_count] = Math.max(0, this.count - 1);
        return this.retry();
    }

    /**
     * @api {Property} Reactium.Pulse.Task.now() Pulse.Task.now()
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.now
     * @apiDescription Force run the task without waiting for it's delay. If the task is running this is a `noop`.
     */
    async now() {
        if (this.status === ENUMS.STATUS.RUNNING) {
            return;
        }

        debug('now()', this);
        this.stop();
        this[_status] = ENUMS.STATUS.RUNNING;

        try {
            this[_attempt] += 1;
            this[_count] += 1;

            const result = await this[_callback](this, this[_params]);

            if (result instanceof Error || result === false) {
                throw new Error(result || 'PulseTask Error');
            } else {
                this.onSuccess(result);
            }
        } catch (err) {
            this.onError(err);
        }

        return this;
    }

    /**
     * @api {Property} Reactium.Pulse.Task.reset() Pulse.Task.reset()
     * @apiGroup Reactium.Pulse
     * @apiName Reactium.Pulse.Task.reset
     * @apiDescription Resets the task's attempt count and run count. Useful for catastrophic failures in your callback function.
     */
    reset() {
        this.stop();

        this[_attempt] = 0;
        this[_complete] = false;
        this[_count] = 0;
        this[_error] = null;

        debug('reset()', this);

        return this.start();
    }

    /**
     * @api {Property} Reactium.Pulse.Task.retry() Pulse.Task.retry()
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.retry
     * @apiDescription Force a retry of the task. Useful for when you want to manually handle retries within your callback function.
     */
    retry() {
        debug('retry()', this);

        if (this[_attempts] < 0) {
            this.stop().start();
        } else {
            if (this[_attempt] >= this[_attempts]) {
                this.stop();
            } else {
                this.stop().start();
            }
        }

        return this;
    }

    /**
     * @api {Property} Reactium.Pulse.Task.start() Pulse.Task.start()
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.start
     * @apiDescription Start the task. Useful for when you want manually start a task in your callback function.
     */
    start() {
        debug('start()', this);

        if (this[_timer] === null) {
            this[_timer] = setTimeout(
                () => this.now(this, this[_params]),
                this[_delay],
            );
        }

        return this;
    }

    /**
     * @api {Property} Reactium.Pulse.Task.stop() Pulse.Task.stop()
     * @apiGroup Reactium.Pulse.Task
     * @apiName Reactium.Pulse.Task.stop
     * @apiDescription Stop the task
     */
    stop() {
        debug('stop()', this);

        if (this.status === ENUMS.STATUS.RUNNING) {
            this[_pending] = ENUMS.STATUS.STOPPED;
            return this;
        }

        clearTimeout(this[_timer]);
        this[_complete] = this[_count] >= this[_repeat];
        this[_status] = ENUMS.STATUS.STOPPED;
        this[_pending] = null;
        this[_timer] = null;
        return this;
    }
}

export default new Pulse();

/**
 * @api {Object} Reactium.Pulse Pulse
 * @apiGroup Reactium.Pulse
 * @apiName Reactium.Pulse
 * @apiDescription Simple interface for creating long or short polls.
 *
 * ### Motivation
 Often is the case where you find yourself sprinkling `setTimeout` or
 `setInterval` all over your code and before you know it, you have so many or
 rewrite the same structures over and over with a slight twist here and there.
 The Pulse API is designed to lighten the load on those situations and give a
 clean interface to easily create and manage polls.
 */

/**
  * @api {Function} Pulse.get(ID) Pulse.get()
  * @apiGroup Reactium.Pulse
  * @apiName Pulse.get
  * @apiDescription Retrieve a registered task. Returns a `Pulse.Task` object.
  * @apiParam {String} ID The ID of the task.
  * @apiExample Example usage:
const task = Reactium.Pulse.get('MyTask');
  */

/**
 * @api {Function} Pulse.register(ID,callback,options,params) Pulse.register()
 * @apiGroup Reactium.Pulse
 * @apiName Pulse.register
 * @apiDescription Register a new task. The callback function can be any
function and supports returning a `Promise` from the function. If a
`Promise` is rejected, or the callback function returns an `Error` object
or `false`, a retry will be triggered if possible. In cases where no more
retries can be executed, the task will fail.

 * @apiParam {String} ID The unique ID of the task.
 * @apiParam {Function} callback The function to execute when the task is run. The first parameter passed to the callback function will be a reference to the current task object.
 * @apiParam {Object} [options] The `Pulse.Task` configuration object.
 * @apiParam {Number} [..attempts=-1] Number of times to retry a task. By default the task will retry indefinitely.
 * @apiParam {Boolean} [..autostart=true] Start the task when it is registered.
 * @apiParam {Number} [..delay=1000] Time in milliseconds before the task is run again. The task will not run again until after it's callback has been executed.
 * @apiParam {Number} [..repeat=-1] Number of times to repeat the task. Used in determining if the task is complete. A task with -1 as the value will never complete.
 * @apiParam {Arguments} [params] Additional parameters to pass to the callback function.
 * @apiExample Example usage:
import React, { useEffect } from 'react';
import Reactium from 'reactium-core/sdk';

const MyComponent = () => {
  const myFunction = (task, ...params) => {
      // Do something here
      const result = 1 === 2;

      if (task.failed) { // Attempted the task 5 times
          console.log('myFunction FAILED after', task.attempts, 'attempts with the following parameters:', ...params);
      }

      if (task.complete) { // Succeeded 5 times
          console.log('myFunction COMPLETED after', task.attempts, 'attempts with the following parameters:', ...params);
      }

      // Trigger a retry because we're returning `false`
      return result;
  };

  useEffect(() => {
      // Register myFunction as a task
      Reactium.Pulse.register('MyComponent', myFunction, {
          attempts: 5,
          delay: 1000,
          repeat: 5
      }, 'param 1', 'param 2', 'param 3');

      // Unregister task when the component unmounts
      return () => Reactium.Pulse.unregister('MyComponent');
  }, [Reactium.Pulse]);

  return <div>MyComponent</div>;
};

export default MyComponent;

 * @apiExample Persist
// For cases where you want the task to persist even after the component has
// been unmounted or the route has changed causing a rerender:


import React, { useEffect } from 'react';
import Reactium from 'reactium-core/sdk';

const MyComponent = () => {

  useEffect(() => {
      Reactium.Pulse.register('MyComponent', MyComponent.staticTask);
  }, [Reactium.Pulse]);

  return <div>MyComponent</div>
};

MyComponent.staticTask = (task, ...params) => new Promise((resolve, reject) => {
  // Perform an async task
  setTimeout(() => resolve('this is awkward...'), 10000);
});

export default MyComponent;
 */

/**
 * @api {Function} Pulse.unregister(ID) Pulse.unregister()
 * @apiGroup Reactium.Pulse
 * @apiName Pulse.unregister
 * @apiDescription Stop and unregister a task. If the task is running, it's current attempt will resolve before the task is removed.
 * @apiParam {String} ID The task unique ID.
 * @apiExample Example usage:
useEffect(() => {
   // Register myFunction as a task
   Reactium.Pulse.register('MyComponent', myFunction, {
       attempts: 5,
       delay: 1000,
       repeat: 5
   }, 'param 1', 'param 2', 'param 3');

   // Unregister task when the component unmounts
   return () => Reactium.Pulse.unregister('MyComponent');
}, [Reactium.Pulse]);
  */

/**
 * @api {Function} Pulse.start(ID) Pulse.start()
 * @apiGroup Reactium.Pulse
 * @apiName Pulse.start
 * @apiDescription Start a registered task if it is stopped.
 * @apiParam {String} ID The task unique ID.
 * @apiExample Example usage:
Reactium.Pulse.start('MyTask');
 */

/**
 * @api {Function} Pulse.startAll() Pulse.startAll()
 * @apiGroup Reactium.Pulse
 * @apiName Pulse.startAll
 * @apiDescription Start all stopped tasks.
 * @apiExample Example usage:
Reactium.Pulse.startAll();
 */

/**
 * @api {Function} Pulse.stop(ID) Pulse.stop()
 * @apiGroup Reactium.Pulse
 * @apiName Pulse.stop
 * @apiDescription Stop a registered task if it is running.
 * @apiParam {String} ID The task unique ID.
 * @apiExample Example usage:
Reactium.Pulse.stop('MyTask');
 */

/**
 * @api {Function} Pulse.stopAll() Pulse.stopAll()
 * @apiGroup Reactium.Pulse
 * @apiName Pulse.stopAll
 * @apiDescription Stop all running registered tasks.
 * @apiExample Example usage:
Reactium.Pulse.stopAll();
 */
