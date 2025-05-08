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
  const [users, setUsers] = useState([])

  // Fetch data from db.json
  useEffect(() => {
    fetch('http://localhost:3001/users') // Cambia la URL si es necesario
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error))
  }, [])

  // Estadísticas calculadas
  const totalUsers = users.length
  const newUsers = users.filter((user) => user.new).length
  const recurringUsers = totalUsers - newUsers
  const averageUsage = (
    users.reduce((sum, user) => sum + (user.usage?.value || 0), 0) / totalUsers || 0
  ).toFixed(2)

  const paymentMethods = users.reduce((acc, user) => {
    const method = user.payment?.name || 'Unknown'
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {})

  return (
    <>
      <CRow>
        <CCol xs={12} md={6} xl={4}>
          <CCard className="mb-4">
            <CCardHeader>Total Users</CCardHeader>
            <CCardBody>
              <h4>{totalUsers}</h4>
              <CProgress thin color="primary" value={(totalUsers / 100) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} xl={4}>
          <CCard className="mb-4">
            <CCardHeader>New Users</CCardHeader>
            <CCardBody>
              <h4>{newUsers}</h4>
              <CProgress thin color="success" value={(newUsers / totalUsers) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} xl={4}>
          <CCard className="mb-4">
            <CCardHeader>Recurring Users</CCardHeader>
            <CCardBody>
              <h4>{recurringUsers}</h4>
              <CProgress thin color="warning" value={(recurringUsers / totalUsers) * 100} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Average Usage</CCardHeader>
            <CCardBody>
              <h4>{averageUsage}%</h4>
              <CProgress thin color="info" value={averageUsage} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <CCardHeader>Payment Methods</CCardHeader>
            <CCardBody>
              {Object.entries(paymentMethods).map(([method, count], index) => (
                <div key={index} className="mb-2">
                  <strong>{method}</strong>: {count} users
                  <CProgress
                    thin
                    color="secondary"
                    value={(count / totalUsers) * 100}
                    className="mt-1"
                  />
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader>Users Table</CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>User</CTableHeaderCell>
                <CTableHeaderCell>Country</CTableHeaderCell>
                <CTableHeaderCell>Usage</CTableHeaderCell>
                <CTableHeaderCell>Payment Method</CTableHeaderCell>
                <CTableHeaderCell>Activity</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((user, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{user.name || 'Unknown'}</CTableDataCell>
                  <CTableDataCell>{user.country?.name || 'Unknown'}</CTableDataCell>
                  <CTableDataCell>{user.usage?.value || 0}%</CTableDataCell>
                  <CTableDataCell>{user.payment?.name || 'Unknown'}</CTableDataCell>
                  <CTableDataCell>{user.activity || 'N/A'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
