import Reactium from 'reactium-core/sdk';

/**
 * Register your API here. You can access this API anywhere in your application
 * like:
 * import Reactium from 'reactium/core/sdk';
 * const api = Reactium.MyAPI;
 * api.post('/foo', { bar: 'baz' });
 */
// Reactium.Hook.register('init', async () => {
//     Reactium.API.register('MyAPI', {
//         api: require('axios').create({
//           baseURL: 'https://example.com',
//           timeout: 1000,
//           headers: {'X-Custom-Header': 'foobar'}
//         })
//     });
// });

Reactium.Foo = 'Bar';
