/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { Plugins } from 'reactium-core/components/Plugable';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: TestPlugin
 * -----------------------------------------------------------------------------
 */
const TestPlugin = ({ count = 0 }) => {
    return (
        <div className="test-plugin-example">
            <h2>Count {count}</h2>
            <Plugins zone="demo-test-nested-example" />
        </div>
    );
};

export default TestPlugin;
