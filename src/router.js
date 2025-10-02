import {Router} from '@vaadin/router';

/**
 * Application Router Configuration
 */
export class AppRouter {
  static init(outlet) {
    if (!outlet) {
      console.error('Router outlet not found');
      return null;
    }

    const router = new Router(outlet);

    router.setRoutes([
      {
        path: '/',
        component: 'employee-list',
        action: () => {
          import('./components/employee-list.js');
        },
      },
      {
        path: '/add',
        component: 'employee-form',
        action: () => {
          import('./components/employee-form.js');
        },
      },
      {
        path: '/edit/:id',
        component: 'employee-form',
        action: () => {
          import('./components/employee-form.js');
        },
      },
      {
        path: '(.*)',
        redirect: '/',
      },
    ]);

    return router;
  }
}
