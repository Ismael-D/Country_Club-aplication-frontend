import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const Dashboard = () => {
  const [members, setMembers] = useState([])
  const [employees, setEmployees] = useState([])
  const [inventory, setInventory] = useState([])

  // Fetch data from json-server (temporary for development)
  useEffect(() => {
    fetch('http://localhost:3004/members')
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error('Error fetching members:', error))

    fetch('http://localhost:3004/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error))

    fetch('http://localhost:3004/inventory')
      .then((response) => response.json())
      .then((data) => setInventory(data))
      .catch((error) => console.error('Error fetching inventory:', error))
  }, [])

  // Estadísticas de miembros
  const totalMembers = members.length
  const membersAlDia = members.filter((member) => member.estado === 'al_dia').length
  const membersConDeuda = members.filter((member) => member.estado === 'con_deuda').length

  // Estadísticas de empleados
  const totalEmployees = employees.length
  const averageSalary = (
    employees.reduce((sum, employee) => sum + parseFloat(employee.salario || 0), 0) /
      totalEmployees || 0
  ).toFixed(2)
  const employeesByPosition = employees.reduce((acc, employee) => {
    acc[employee.posicion] = (acc[employee.posicion] || 0) + 1
    return acc
  }, {})

  // Estadísticas de inventario
  const totalInventoryItems = inventory.length
  const inventoryByState = inventory.reduce(
    (acc, item) => {
      acc[item.estado] = (acc[item.estado] || 0) + 1
      return acc
    },
    { Nuevo: 0, Usado: 0, Dañado: 0 },
  )
  const inventoryByMovement = inventory.reduce(
    (acc, item) => {
      acc[item.tipoMovimiento] = (acc[item.tipoMovimiento] || 0) + 1
      return acc
    },
    { Entrada: 0, Salida: 0 },
  )

  return (
    <>
      <CRow>
        {/* Estadísticas de miembros */}
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardHeader>Total Miembros</CCardHeader>
            <CCardBody>
              <h4>{totalMembers}</h4>
              <CProgress thin color="primary" value={(totalMembers / 100) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardHeader>Miembros al Día</CCardHeader>
            <CCardBody>
              <h4>{membersAlDia}</h4>
              <CProgress thin color="success" value={(membersAlDia / totalMembers) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardHeader>Miembros con Deuda</CCardHeader>
            <CCardBody>
              <h4>{membersConDeuda}</h4>
              <CProgress thin color="danger" value={(membersConDeuda / totalMembers) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Estadísticas de empleados */}
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Total Empleados</CCardHeader>
            <CCardBody>
              <h4>{totalEmployees}</h4>
              <CProgress thin color="info" value={(totalEmployees / 100) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Salario Promedio</CCardHeader>
            <CCardBody>
              <h4>${averageSalary}</h4>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Estadísticas de inventario */}
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardHeader>Total Artículos</CCardHeader>
            <CCardBody>
              <h4>{totalInventoryItems}</h4>
              <CProgress thin color="primary" value={(totalInventoryItems / 100) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardHeader>Artículos por Estado</CCardHeader>
            <CCardBody>
              {Object.entries(inventoryByState).map(([state, count], index) => (
                <div key={index} className="mb-2">
                  <strong>{state}</strong>: {count}
                  <CProgress
                    thin
                    color="secondary"
                    value={(count / totalInventoryItems) * 100}
                    className="mt-1"
                  />
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardHeader>Movimientos de Inventario</CCardHeader>
            <CCardBody>
              {Object.entries(inventoryByMovement).map(([movement, count], index) => (
                <div key={index} className="mb-2">
                  <strong>{movement}</strong>: {count}
                  <CProgress
                    thin
                    color="warning"
                    value={(count / totalInventoryItems) * 100}
                    className="mt-1"
                  />
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
