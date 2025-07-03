import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilPeople,
  cilCalendarCheck,
  cilUser,
  cilContact,
  cilBrushAlt,
  cilClipboard,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const navItems = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    roles: ['admin', 'manager', 'event_coordinator'],
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    roles: ['admin'],
  },
  {
    component: CNavTitle,
    name: 'Modules',
    roles: ['admin', 'manager', 'event_coordinator'],
  },
  {
    component: CNavItem,
    name: 'Events',
    to: '/modules/events',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
    roles: ['admin', 'event_coordinator'],
  },
  {
    component: CNavItem,
    name: 'Members',
    to: '/modules/members',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
    roles: ['admin', 'manager'],
  },
  {
    component: CNavItem,
    name: 'Employees',
    to: '/modules/employees',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    roles: ['admin', 'manager'],
  },
  {
    component: CNavItem,
    name: 'Maintenance',
    to: '/modules/maintenance',
    icon: <CIcon icon={cilBrushAlt} customClassName="nav-icon" />,
    roles: ['admin', 'manager'],
  },
  {
    component: CNavItem,
    name: 'Inventory',
    to: '/modules/inventory',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    roles: ['admin', 'manager'],
  },
  {
    component: CNavTitle,
    name: 'Extras',
    roles: ['admin', 'manager', 'event_coordinator'],
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
        roles: ['admin', 'manager', 'event_coordinator'],
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
        roles: ['admin', 'manager', 'event_coordinator'],
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
        roles: ['admin', 'manager', 'event_coordinator'],
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
        roles: ['admin', 'manager', 'event_coordinator'],
      },
    ],
    roles: ['admin', 'manager', 'event_coordinator'],
  },
  {
    component: CNavItem,
    name: 'Calendario de Eventos',
    to: '/eventos/calendario',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
    roles: ['admin', 'event_coordinator'],
  },
]

function filterNavByRole(items, role) {
  return items
    .filter(item => !item.roles || item.roles.includes(role))
    .map(item => {
      if (item.items) {
        return { ...item, items: filterNavByRole(item.items, role) }
      }
      return item
    })
}

export function getNavByRole(role) {
  return filterNavByRole(navItems, role)
}

export default navItems
