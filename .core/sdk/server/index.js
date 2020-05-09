import SDK from '@atomic-reactor/reactium-sdk-core';

const Server = {};

Server.Middleware = SDK.Utils.registryFactory('ExpressMiddleware', 'name');

export default Server;
