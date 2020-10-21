import React from 'react';
import { Router } from 'react-router-dom';
import { useHookComponent } from 'reactium-core/sdk';

export default ({ history }) => {
    const RoutedContent = useHookComponent('RoutedContent');
    return (
        <Router history={history}>
            <RoutedContent />
        </Router>
    );
};
