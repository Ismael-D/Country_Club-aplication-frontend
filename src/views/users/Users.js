import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilPencil } from '@coreui/icons'

const Users = () => {
  const [users, setUsers] = useState([])
  const [visible, setVisible] = useState(false) // Estado para mostrar/ocultar el modal
  const [currentUser, setCurrentUser] = useState(null) // Usuario seleccionado para editar
  const [confirmPassword, setConfirmPassword] = useState('') // Nuevo estado para confirmar contraseña

  // Fetch users from json-server
  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error))
  }, [])

  const handleModifyUser = (user) => {
    setCurrentUser(user) // Guarda el usuario actual
    setVisible(true) // Muestra el modal
  }

  const handleSaveUser = () => {
    if (currentUser.password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (currentUser.id) {
      // Actualizar usuario existente
      fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      })
        .then(() => {
          setUsers((prev) =>
            prev.map((user) => (user.id === currentUser.id ? currentUser : user))
          )
          setVisible(false) // Cierra el modal
        })
        .catch((error) => console.error('Error updating user:', error))
    } else {
      // Agregar nuevo usuario
      fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      })
        .then((response) => response.json())
        .then((newUser) => {
          setUsers((prev) => [...prev, newUser])
          setVisible(false) // Cierra el modal
        })
        .catch((error) => console.error('Error adding user:', error))
    }
  }

  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?')
    if (confirmDelete) {
      fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setUsers((prev) => prev.filter((user) => user.id !== id))
        })
        .catch((error) => console.error('Error deleting user:', error))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = (id, newStatus) => {
    const updatedUser = users.find((user) => user.id === id)
    if (updatedUser) {
      updatedUser.status = newStatus
      fetch(`http://localhost:3001/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })
        .then(() => {
          setUsers((prev) =>
            prev.map((user) => (user.id === id ? updatedUser : user))
          )
        })
        .catch((error) => console.error('Error updating status:', error))
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          Users
          <CButton
            color="primary"
            size="sm"
            className="float-end"
            onClick={() => {
              setCurrentUser({
                name: '',
                email: '',
                tlf: '',
                dni: '',
                role: 'Admin', // Valor predeterminado
                avatar: { src: '', status: 'secondary' },
                status: 'Active', // Estado predeterminado
              })
              setVisible(true)
            }}
          >
            Add New User
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="text-center">
                  <CIcon icon={cilPeople} />
                </CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>DNI</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
                <CTableHeaderCell>Contact</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((user) => (
                <CTableRow key={user.id}>
                  <CTableDataCell className="text-center">
                    <CAvatar size="md" src={user.avatar?.src || ''} status={user.avatar?.status || 'secondary'} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{user.name}</div>
                    <div className="small text-body-secondary">
                      <span>Status:</span> {user.status}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{user.dni}</CTableDataCell>
                  <CTableDataCell>{user.role}</CTableDataCell>
                  <CTableDataCell>
                    <div>{user.email}</div>
                    <div className="small text-body-secondary">
                      <span>Phone:</span> {user.tlf}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="success" size="sm" onClick={() => handleModifyUser(user)}>
                      <CIcon icon={cilPencil} />
                    </CButton>{' '}
                    <CDropdown>
                      <CDropdownToggle color="secondary" size="sm">
                        Change Status
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem onClick={() => handleStatusChange(user.id, 'Active')}>
                          Active
                        </CDropdownItem>
                        <CDropdownItem onClick={() => handleStatusChange(user.id, 'Inactive')}>
                          Inactive
                        </CDropdownItem>
                        <CDropdownItem onClick={() => handleStatusChange(user.id, 'Suspended')}>
                          Suspended
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>{' '}
                    <CButton color="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal para agregar/editar usuario */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>{currentUser?.id ? 'Edit User' : 'Add User'}</CModalHeader>
        <CModalBody>
          {currentUser && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  value={currentUser.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  value={currentUser.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Phone</CFormLabel>
                <CFormInput
                  type="text"
                  name="tlf"
                  value={currentUser.tlf || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>DNI</CFormLabel>
                <CFormInput
                  type="text"
                  name="dni"
                  value={currentUser.dni || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Role</CFormLabel>
                <select
                  className="form-select"
                  name="role"
                  value={currentUser.role || ''}
                  onChange={handleInputChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                </select>
              </div>
              <div className="mb-3">
                <CFormLabel>Password</CFormLabel>
                <CFormInput
                  type="password"
                  name="password"
                  value={currentUser.password || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Confirm Password</CFormLabel>
                <CFormInput
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveUser}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Users