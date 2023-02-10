import React from 'react';
import { Router as Dom } from 'react-router-dom';
import { useHookComponent } from 'reactium-core/sdk';

export const Router = ({ history }) => {
    const RoutedContent = useHookComponent('RoutedContent');
    return (
        <Dom history={history}>
            <RoutedContent />
        </Dom>
    );
};
