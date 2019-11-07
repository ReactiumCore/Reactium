import uuid from 'uuid/v4';
import op from 'object-path';

/**
 * @api {Objectt} Reactium.Handle Handle
 * @apiName Reactium.Handle
 * @apiDescription Similar concept to an imperative handle created when using
 `React.forwardRef()` and the `useImperativeHandle()` React hook. Reactium
 provides the `Reactium.Handle` object to manage references created in your
 components to allow imperative control of your component from outside the component.
This is used when you wish to change the internal state of your component from
outside using a technique other than changing the component `props` (i.e. declarative control).

 This technique makes use of references created with `React.createRef()` or the `useRef()` hook for functional components.
 The developer can then assign the `current` property of this reference to be an object containing methods or callbacks
 (i.e. methods that can invoke `this.setState()` or the update callback returned by `useState()` hook)
 that will cause the state of the component to change (and rerender).

 By registering this "handle reference" on the `Reactium.Handle` singleton, other distant components can
 exercise imperative control over your component.

 For developers that prefer the use of React hooks, Reactium provides two hooks for your use:
 `useRegisterHandle()` and `useHandle()` to register and use these handles respectively.
 * @apiGroup Reactium
 *
 */
class Handle {
    handles = {};
    subscriptions = {};

    /**
     * @api {Function} Handle.subscribe(cb) Handle.subscribe()
     * @apiDescription Subscribe to changes in imperative handle references
     (registrations and unregistrations). Returns unsubscribe function.
     * @apiParam {Function} cb callback to be called when a handle is registered or unregistered
     * @apiName Handle.subscribe
     * @apiGroup Reactium.Handle
     * @apiExample MyComponent.js
import React, {useState, useEffect} from 'react';
import Reactium from 'reactium-core/sdk';
import op from 'object-path'

export default () => {
    const [handle, updateHandle] = useState(Reactium.Handle.get('path.to.handle'));
    useEffect(() => Reactium.Handle.subscribe(() => {
        const h = Reactium.Handle.get('path.to.handle');
        if (handle.current !== h.current) updateHandle(h);
    }), []);

    const doSomething = () => {
        if (op.has(handle, 'current.action')) handle.current.action;
    };

    return (<button onClick={doSomething}>Some Action</button>);
};
     */
    subscribe(cb) {
        if (typeof cb === 'function') {
            const id = uuid();
            this.subscriptions[id] = cb;
            return () => {
                delete this.subscriptions[id];
            };
        }
    }

    /**
     * @api {Function} Handle.register(id,ref) Handle.register()
     * @apiDescription Register an imperative handle reference. See
     `useRegisterHandle()` React hook for easier pattern for functional components.
     * @apiParam {Mixed} id Array of properties, or `.` separated object path. e.g. ['path','to','handle'] or 'path.to.handle'
     * @apiParam {Ref} ref React reference created with `React.createRef()`` or `React.useRef()`.
     * @apiName Handle.register
     * @apiGroup Reactium.Handle
     * @apiExample MyControllableComponent.js
import React, {useEffect, useState, useRef} from 'react';
import Reactium from 'reactium-core/sdk';

// This component is externally controllable on registered handle
// with id: 'controlled.handle' or ['controlled', 'handle']
export default () => {
    const [count, setCount] = useState(1);
    const increment = () => setCount(count + 1);
    const ref = useRef({
        increment,
    });

    useEffect(() => {
        Reactium.register('controlled.handle', ref);
        return () => Reactium.unregister('controlled.handle');
    }, [count]);

    return (<div>Count is {count}</div>);
};
     */
    register(id = '', ref) {
        const path = Array.isArray(id) ? id : id.split('.');
        op.set(this.handles, path, ref);
        this._update();
    }

    /**
     * @api {Function} Handle.unregister(id) Handle.unregister()
     * @apiDescription Unregister an imperative handle reference. See `Handle.register()` for example usage.
     * @apiParam {Mixed} id Array of properties, or `.` separated object path. e.g. ['path','to','handle'] or 'path.to.handle'
     * @apiName Handle.unregister
     * @apiGroup Reactium.Handle
     */
    unregister(id = '') {
        const path = Array.isArray(id) ? id : id.split('.');
        op.del(this.handles, path);
        this._update();
    }

    _update() {
        Object.values(this.subscriptions).forEach(cb => cb());
    }

    /**
     * @api {Function} Handle.get(id) Handle.get()
     * @apiDescription Get a specific imperative handle reference, by object path (id).
     If id is full object path to the handle, returns a React reference if it exists, otherwise `undefined`.
     If id is partial object path, returns object containing one or more references if the path exists, otherwise 'undefined'.
     * @apiParam {Mixed} id Array of properties, or `.` separated object path. e.g. ['path','to','handle'] or 'path.to.handle'
     * @apiName Handle.get
     * @apiGroup Reactium.Handle
     * @apiExample CountList.js
     import React from 'react';
     import Counter from './Counter';
     import CounterControl from './CounterControl';

     const CountList = props => {
         return (
             <>
                 <Counter id='1'/>
                 <Counter id='2'/>
                 <CounterControl />
             </>
         );
     };

     export default CountList;
     * @apiExample Counter.js
     import React, { useState } from 'react';
     import { useRegisterHandle } from 'reactium-core/sdk';

     const Counter = ({id = 1}) => {
         const [count, setCount] = useState(Number(id));

         // hook form of Handle.register and Handle.unregister
         // handles ref creation for you
         useRegisterHandle(['counter', id], () => ({
             increment: () => setCount(count + 1),
         }), [count]);

         return (
             <div>
                 <h1>Counter {id}</h1>
                 Count: {count}
             </div>
         );
     };

     export default Counter;
     * @apiExample CounterControl.js
     import React from 'react';
     import Reactium from 'reactium-core/sdk';

     const CounterControl = () => {
        // get object with all handles in the "counter" partial path
         const handles = Reactium.Handle.get('counter');

         const click = () => {
            // equivalent to getting handle 'counter.1' and `counter.2` separately
            // loop through all counters and call increment on click
             Object.values(handles).forEach(({current}) => current.increment())
         };

         return (
             <div>
                 <h1>CounterControl</h1>
                 <button onClick={click}>Increment All Counters</button>
             </div>
         );
     };

     export default CounterControl;
     */
    get(id = '') {
        const path = Array.isArray(id) ? id : id.split('.');
        return op.get(this.handles, path);
    }

    /**
     * @api {Function} Handle.list() Handle.list()
     * @apiDescription Get full object containing all current reference handles.
     * @apiName Handle.list
     * @apiGroup Reactium.Handle
     */
    list() {
        return this.handles;
    }
}

export default new Handle();
