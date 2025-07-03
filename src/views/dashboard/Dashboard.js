import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CProgress,
} from '@coreui/react'
import { memberService, employeeService, inventoryService } from '../../services/api'

const Dashboard = () => {
  const [members, setMembers] = useState([])
  const [employees, setEmployees] = useState([])
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    memberService.getAll()
      .then((response) => {
        const arr = response?.data?.data
        setMembers(Array.isArray(arr) ? arr : [])
      })
      .catch((error) => {
        console.error('Error fetching members:', error)
        setMembers([])
      })

    employeeService.getAll()
      .then((response) => {
        const arr = response?.data?.data
        setEmployees(Array.isArray(arr) ? arr : [])
      })
      .catch((error) => {
        console.error('Error fetching employees:', error)
        setEmployees([])
      })

    inventoryService.getAll()
      .then((response) => {
        const arr = response?.data?.data
        setInventory(Array.isArray(arr) ? arr : [])
      })
      .catch((error) => {
        console.error('Error fetching inventory:', error)
        setInventory([])
      })
  }, [])

  // Estadísticas de miembros
  const safeMembers = Array.isArray(members) ? members : []
  const totalMembers = safeMembers.length
  const membersAlDia = safeMembers.filter((member) => member.estado === 'al_dia').length
  const membersConDeuda = safeMembers.filter((member) => member.estado === 'con_deuda').length

  // Estadísticas de empleados
  const safeEmployees = Array.isArray(employees) ? employees : []
  const totalEmployees = safeEmployees.length
  const averageSalary = (
    safeEmployees.reduce((sum, employee) => sum + parseFloat(employee.salario || 0), 0) /
      (totalEmployees || 1)
  ).toFixed(2)
  const employeesByPosition = safeEmployees.reduce((acc, employee) => {
    acc[employee.posicion] = (acc[employee.posicion] || 0) + 1
    return acc
  }, {})

  // Estadísticas de inventario
  const safeInventory = Array.isArray(inventory) ? inventory : []
  const totalInventoryItems = safeInventory.length
  const inventoryByState = safeInventory.reduce(
    (acc, item) => {
      acc[item.estado] = (acc[item.estado] || 0) + 1
      return acc
    },
    { Nuevo: 0, Usado: 0, Dañado: 0 },
  )
  const inventoryByMovement = safeInventory.reduce(
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
              <CProgress thin color="success" value={(membersAlDia / (totalMembers || 1)) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={4}>
          <CCard className="mb-4">
            <CCardHeader>Miembros con Deuda</CCardHeader>
            <CCardBody>
              <h4>{membersConDeuda}</h4>
              <CProgress thin color="danger" value={(membersConDeuda / (totalMembers || 1)) * 100} />
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
                    value={(count / (totalInventoryItems || 1)) * 100}
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
                    value={(count / (totalInventoryItems || 1)) * 100}
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
