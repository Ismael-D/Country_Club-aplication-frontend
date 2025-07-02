import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users/Users'))

// Modules
const Events = React.lazy(() => import('./views/modules/events/Events'))
const Employees = React.lazy(() => import('./views/modules/employees/Employees'))
const Maintenance = React.lazy(() => import('./views/modules/maintenance/Maintenance'))
const Members = React.lazy(() => import('./views/modules/members/Members'))
const inventory = React.lazy(() => import('./views/modules/inventory/Inventory'))
const events = React.lazy(() => import('./views/modules/members/events'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/modules', name: 'Modules', element: Users, exact: true },
  { path: '/modules/events', name: 'Events', element: Events },
  { path: '/modules/employees', name: 'Employees', element: Employees },
  { path: '/modules/maintenance', name: 'Maintenance', element: Maintenance },
  { path: '/modules/members', name: 'Members', element: Members },
  { path: '/modules/inventory', name: 'Inventory', element: inventory },
  { path: '/modules/members/events', name: 'Events', element: events },
]

export default routes
