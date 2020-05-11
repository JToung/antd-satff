export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User1/Login' },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // { path: '/', redirect: '/operator/home', authority: ['admin', 'user'] },
      { path: '/', redirect: '/user' },
      {
        path: '/staff',
        name: 'staff',
        icon: 'dashboard',
        routes: [
          {
            path: '/staff/home',
            name: 'home',
            component: './staff/Home/Home',
          },
          {
            path: '/staff/center',
            name: 'center',
            component: './Staff/Center',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/staff/center',
                redirect: '/staff/center/info',
              },
              {
                path: '/staff/center/info',
                name: 'info',
                component: './Staff/Center/Center',
              },
              {
                path: '/staff/center/update',
                name: 'update',
                component: './Staff/Center/Update',
              },
            ],
          },
        ],
      },
      //category
      {
        path: '/category',
        name: 'category',
        icon: 'profile',
        component: './Category/Category/category',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/category',
            redirect: '/category/info',
          },
          {
            path: '/category/info',
            name: 'info',
            component: './Category/Category/analysis',
          },
          {
            path: '/category/list',
            name: 'list',
            component: './Category/Category/category-list',
          },
          {
            path: '/category/view-categroy/:_id',
            name: 'view-categroy',
            component: './Category/Category/details/view',
          },
          {
            path: '/category/delete-categroy/:_id',
            name: 'delete-categroy',
            component: './Category/Category/details/delete',
          },
          {
            path: '/category/editor-categroy/:_id',
            name: 'editor-categroy',
            component: './Category/Category/details/editor',
          },
          {
            path: '/category/new-categroy',
            name: 'new-categroy',
            component: './Category/Category/details/new',
          },
          {
            path: '/category/uporoff-categroy/:_id',
            name: 'uporoff-categroy',
            component: './Category/Category/details/uporoff',
          },
        ],
      },
      {
        path: '/item',
        name: 'item',
        icon: 'profile',
        component: './Item/item',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/item',
            redirect: '/item/info',
          },
          {
            path: '/item/info',
            name: 'info',
            component: './Item/analysis',
          },
          {
            path: '/item/list',
            name: 'list',
            component: './Item/item-list',
          },
          {
            path: '/item/view-item/:_id',
            name: 'view-item',
            component: './Item/details/view',
          },
          {
            path: '/item/delete-item/:_id',
            name: 'delete-item',
            component: './Item/details/delete',
          },
          {
            path: '/item/editor-item/:_id',
            name: 'editor-item',
            component: './Item/details/editor',
          },
          {
            path: '/item/new-item',
            name: 'new-item',
            component: './Item/details/new',
          },
          {
            path: '/item/uporoff-item/:_id',
            name: 'uporoff-item',
            component: './Item/details/uporoff',
          },
        ],
      },
      {
        path: '/messages',
        name: 'messages',
        icon: 'profile',
        component: './Messages/messages',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/messages',
            redirect: '/messages/info',
          },
          {
            path: '/messages/info',
            name: 'info',
            component: './Messages/messages',
          },
        ],
      },
      //Label
      // {
      //   path: '/label',
      //   name: 'label',
      //   component: './Label/label',
      //   hideChildrenInMenu: true,
      //   routes: [
      //     {
      //       path: '/label/',
      //       redirect: '/label/list',
      //     },
      //     {
      //       path: '/label/list',
      //       name: 'info',
      //       component: './Label/list',
      //     },
      //     {
      //       path: '/label/delete-label',
      //       name: 'delete-label',
      //       component: './Label/details/delete',
      //     },
      //     {
      //       path: '/label/editor-label',
      //       name: 'editor-label',
      //       component: './Label/details/editor',
      //     },
      //     {
      //       path: '/label/new-label',
      //       name: 'new-label',
      //       component: './Label/details/new',
      //     },
      //     {
      //       path: '/label/shangjia-label',
      //       name: 'shangjia-label',
      //       component: './Label/details/shangjia',
      //     },
      //   ],
      // },
      //item
      // dashboard
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   icon: 'dashboard',
      //   routes: [
      //     {
      //       path: '/dashboard/analysis',
      //       name: 'analysis',
      //       component: './Dashboard/Analysis',
      //     },
      //     {
      //       path: '/dashboard/monitor',
      //       name: 'monitor',
      //       component: './Dashboard/Monitor',
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'workplace',
      //       component: './Dashboard/Workplace',
      //     },
      //   ],
      // },
      // // forms
      // {
      //   path: '/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/form/step-form',
      //           redirect: '/form/step-form/info',
      //         },
      //         {
      //           path: '/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advancedform',
      //       // authority: ['admin'],
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/basic/:id',
      //       hideInMenu: true,
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       // authority: ['admin'],
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      // {
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   routes: [
      //     // exception
      //     {
      //       path: '/exception/403',
      //       name: 'not-permission',
      //       component: './Exception/403',
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'not-find',
      //       component: './Exception/404',
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'server-error',
      //       component: './Exception/500',
      //     },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/TriggerException',
      //     },
      //   ],
      // },
      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // //  editor
      // {
      //   name: 'editor',
      //   icon: 'highlight',
      //   path: '/editor',
      //   routes: [
      //     {
      //       path: '/editor/flow',
      //       name: 'flow',
      //       component: './Editor/GGEditor/Flow',
      //     },
      //     {
      //       path: '/editor/mind',
      //       name: 'mind',
      //       component: './Editor/GGEditor/Mind',
      //     },
      //     {
      //       path: '/editor/koni',
      //       name: 'koni',
      //       component: './Editor/GGEditor/Koni',
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
