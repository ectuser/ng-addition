import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'client',
    loadComponent: () => import('./client/client.component').then(mod => mod.ClientRouteComponent),
    children: [
      { 
        path: 'todo',
        children: [
          { 
            path: '',
            loadComponent: () => import('./todo/todo.component').then(mod => mod.TodoComponent),
          },
          {
            path: ':id',
            loadComponent: () => import('./concrete-todo/concrete-todo.component').then(mod => mod.ConcreteTodoComponent),
          },
          { 
            path: 'error',
            loadComponent: () => import('./todo-error/todo-error.component').then(mod => mod.TodoErrorComponent),
          },
        ],
      },
    ],
  },
];
