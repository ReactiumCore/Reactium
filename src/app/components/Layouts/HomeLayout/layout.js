import RodTest from 'appdir/components/RodTest';

// use cases:
// 1. region is hard coded to a component, page loaded data
// e.g.
//   - product tile, product assigned by admin user
//   - list of products, coming from cloud function
//   - node of data, assigned from drupal cms
//   - individual properties set by admin
// 2. admin user can choose components. Options:
//   - properties can be set admin
//   - component can be added, it handles it's own data
export default {
    name: 'home',
    title: 'Home Page',
    regions: [
      // 1. hard coded component, page loaded data
      {
        name: 'hero',
        type: 'fixed',
        rod: RodTest,
      },
      // 2. free-form components
      {
        name: 'content',
        type: 'editable'
      }
    ],
};
