import React from 'react';
import deps from 'dependencies';

export default {
    mount: params => (dispatch, getState) => {
        // Demonstrate Run-time Plugins
        dispatch(
            deps.actions.Plugable.addPlugin({
                zone: 'demo-test-nested-example',
                id: 'inline-plugin-example',
                component: 'Checkbox',
                path: 'form/',
                order: 0,
                name: 'inline-plugin-example2',
                text: 'Test Checkbox Plugin',
                value: 'inline-plugin-example',
            }),
        );
        dispatch(
            deps.actions.Plugable.addPlugin({
                zone: 'demo-test-nested-example',
                id: 'inline-plugin-example2',
                component: () => <small>Runtime Plugin</small>,
                order: 0,
            }),
        );

        let state = getState()['Test'];
        let { loaded = false } = state;

        if (loaded !== true) {
            return deps.services.Test.fetchHello()
                .then(data => {
                    dispatch({ type: deps.actionTypes.TEST_MOUNT, data });
                })
                .catch(error => {
                    dispatch({
                        type: deps.actionTypes.TEST_MOUNT,
                        data: { msg: '' },
                    });
                });
        } else {
            return Promise.resolve(
                dispatch({ type: deps.actionTypes.TEST_MOUNT, data: state }),
            );
        }
    },

    click: () => dispatch => {
        dispatch({ type: deps.actionTypes.TEST_CLICK });
    },
};
