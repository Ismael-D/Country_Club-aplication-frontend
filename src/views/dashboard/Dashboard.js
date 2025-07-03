import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { Pie, Bar, Line } from 'react-chartjs-2'
import { memberService, employeeService, inventoryService, eventService, eventTypeService } from '../../services/api'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  const [members, setMembers] = useState([])
  const [employees, setEmployees] = useState([])
  const [inventory, setInventory] = useState([])
  const [events, setEvents] = useState([])
  const [eventTypes, setEventTypes] = useState([])

  const role = localStorage.getItem('role') || 'event_coordinator'

  useEffect(() => {
    if (role === 'admin' || role === 'manager') {
      memberService.getAll().then(res => setMembers(res?.data?.data || []))
      employeeService.getAll().then(res => setEmployees(res?.data?.data || []))
      inventoryService.getAll().then(res => setInventory(res?.data?.data || []))
    }
    eventService.getAll().then(res => setEvents(res?.data?.data || []))
    eventTypeService.getAll().then(res => setEventTypes(res?.data || []))
  }, [role])

  const safeMembers = Array.isArray(members) ? members : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const safeEvents = Array.isArray(events) ? events : [];
  const safeEventTypes = Array.isArray(eventTypes) ? eventTypes : [];

  // --- Datos para gráficas ---
  // Miembros por estado
  const memberStates = ['active', 'inactive', 'suspended']
  const membersByState = memberStates.map(state => safeMembers.filter(m => m.status === state).length)

  // Empleados por posición
  const positions = [...new Set(safeEmployees.map(e => e.position || e.posicion))]
  const employeesByPosition = positions.map(pos => safeEmployees.filter(e => (e.position || e.posicion) === pos).length)

  // Inventario por estado
  const inventoryStates = ['Nuevo', 'Usado', 'Dañado']
  const inventoryByState = inventoryStates.map(state => safeInventory.filter(i => i.estado === state).length)

  // Eventos por tipo
  const eventsByType = safeEventTypes.map(type => safeEvents.filter(ev => ev.event_type_id === type.id).length)

  // Eventos por estado
  const eventStatuses = ['scheduled', 'ongoing', 'completed', 'canceled']
  const eventsByStatus = eventStatuses.map(status => safeEvents.filter(ev => ev.status === status).length)

  // Próximos eventos
  const upcomingEvents = safeEvents
    .filter(ev => new Date(ev.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  // --- Render por rol ---
  if (role === 'admin') {
    return (
      <>
        <CRow>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>Miembros por Estado</CCardHeader>
              <CCardBody>
                <Pie
                  data={{
                    labels: memberStates,
                    datasets: [{ data: membersByState, backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'] }]
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>Empleados por Posición</CCardHeader>
              <CCardBody>
                <Bar
                  data={{
                    labels: positions,
                    datasets: [{ label: 'Empleados', data: employeesByPosition, backgroundColor: '#36A2EB' }]
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>Inventario por Estado</CCardHeader>
              <CCardBody>
                <Bar
                  data={{
                    labels: inventoryStates,
                    datasets: [{ label: 'Artículos', data: inventoryByState, backgroundColor: '#FFCE56' }]
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>Próximos Eventos</CCardHeader>
              <CCardBody>
                <ul>
                  {upcomingEvents.map(ev => (
                    <li key={ev.id}>
                      <b>{ev.name}</b> - {new Date(ev.date).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }

  if (role === 'manager') {
    return (
      <>
        <CRow>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>Evolución de Membresías</CCardHeader>
              <CCardBody>
                <Line
                  data={{
                    labels: safeMembers.map(m => m.registration_date?.substring(0, 10)),
                    datasets: [{
                      label: 'Nuevos miembros',
                      data: safeMembers.map((_, i) => i + 1),
                      borderColor: '#36A2EB',
                      fill: false
                    }]
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>Empleados por Posición</CCardHeader>
              <CCardBody>
                <Pie
                  data={{
                    labels: positions,
                    datasets: [{ data: employeesByPosition, backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'] }]
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol md={12}>
            <CCard className="mb-4">
              <CCardHeader>Inventario Bajo Stock</CCardHeader>
              <CCardBody>
                <ul>
                  {safeInventory.filter(i => i.current_stock < 10).map(i => (
                    <li key={i.id}>{i.name} - Stock: {i.current_stock}</li>
                  ))}
                </ul>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }

  if (role === 'event_coordinator') {
    return (
      <>
        <CRow>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>Próximos Eventos</CCardHeader>
              <CCardBody>
                <ul>
                  {upcomingEvents.map(ev => (
                    <li key={ev.id}>
                      <b>{ev.name}</b> - {new Date(ev.date).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>Eventos por Tipo</CCardHeader>
              <CCardBody>
                <Pie
                  data={{
                    labels: safeEventTypes.map(t => t.name),
                    datasets: [{ data: eventsByType, backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'] }]
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol md={12}>
            <CCard className="mb-4">
              <CCardHeader>Eventos por Estado</CCardHeader>
              <CCardBody>
                <Bar
                  data={{
                    labels: eventStatuses,
                    datasets: [{ label: 'Eventos', data: eventsByStatus, backgroundColor: '#36A2EB' }]
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }

  // Rol desconocido
  return (
    <CCard className="mb-4">
      <CCardHeader>Bienvenido</CCardHeader>
      <CCardBody>
        <p>Tu rol no tiene widgets asignados.</p>
      </CCardBody>
    </CCard>
  )
}

export default Dashboard
