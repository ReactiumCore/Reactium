import React from 'react';
import ServerRouter from './server';
import ClientRouter from './browser';

const Router = ({server = false, location, context}) => {
    if ( server ) {
        return <ServerRouter location={location} context={context} />;
    }

    return <ClientRouter />;
};

export default Router;
