import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
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
  const [visible, setVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Fetching users...')
    fetch('http://localhost:3004/users')
      .then((response) => {
        console.log('Response status:', response.status)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log('Users data:', data)
        console.log('Users data length:', Array.isArray(data) ? data.length : 'Not an array')
        setUsers(data || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
        setUsers([])
        setLoading(false)
      })
  }, [])

  const handleModifyUser = (user) => {
    setCurrentUser(user)
    setVisible(true)
  }

  const handleSaveUser = () => {
    if (currentUser.password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (currentUser.id) {
      fetch(`http://localhost:3004/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      })
        .then(() => {
          setUsers((prev) => prev.map((user) => (user.id === currentUser.id ? currentUser : user)))
          setVisible(false)
        })
        .catch((error) => console.error('Error updating user:', error))
    } else {
      fetch('http://localhost:3004/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      })
        .then((response) => response.json())
        .then((newUser) => {
          setUsers((prev) => [...prev, newUser])
          setVisible(false)
        })
        .catch((error) => console.error('Error adding user:', error))
    }
  }

  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?')
    if (confirmDelete) {
      fetch(`http://localhost:3004/users/${id}`, {
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
      fetch(`http://localhost:3004/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })
        .then(() => {
          setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)))
        })
        .catch((error) => console.error('Error updating status:', error))
    }
  }

  console.log('Current users state:', users)
  console.log('Loading state:', loading)

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          Users ({users.length})
          <CButton
            color="info"
            size="sm"
            className="float-end"
            onClick={() => {
              setCurrentUser({
                name: '',
                email: '',
                tlf: '',
                dni: '',
                role: 'Admin',
                avatar: { src: '', status: 'secondary' },
                status: 'Active',
              })
              setVisible(true)
            }}
          >
            Add New User
          </CButton>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center">
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center">
              <p>No users found</p>
            </div>
          ) : (
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th className="text-center">
                    <CIcon icon={cilPeople} />
                  </th>
                  <th>Name</th>
                  <th>DNI</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="text-center">
                      <CAvatar
                        size="md"
                        src={user.avatar?.src || ''}
                        status={user.avatar?.status || 'secondary'}
                      />
                    </td>
                    <td>
                      <div>{user.name}</div>
                      <div className="small text-body-secondary">
                        <span>Status:</span> {user.status}
                      </div>
                    </td>
                    <td>{user.dni}</td>
                    <td>{user.role}</td>
                    <td>
                      <div>{user.email}</div>
                      <div className="small text-body-secondary">
                        <span>Phone:</span> {user.tlf}
                      </div>
                    </td>
                    <td>
                      <CButton color="success" size="sm" onClick={() => handleModifyUser(user)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
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
                      </CDropdown>
                      <CButton color="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </CButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
          <CButton color="info" onClick={handleSaveUser}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Users
