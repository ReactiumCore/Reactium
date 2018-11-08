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
            <div className="plugins">
                <Plugins zone="demo-test-nested-example" />
            </div>
        </div>
    );
};

export default TestPlugin;
