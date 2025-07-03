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
import { userService } from '../../services/api'

const ROLES = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'manager' },
  { id: 3, name: 'event_coordinator' },
];

const Users = () => {
  const [users, setUsers] = useState([])
  const [visible, setVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState({ visible: false, message: '', onConfirm: null })

  useEffect(() => {
    console.log('Fetching users...')
    userService.getAll({ limit: 100 })
      .then((response) => {
        // Procesar la respuesta del backend
        const arr = response?.data?.data?.users
        // Restaurar avatar aleatorio y color de status visual
        function getStatusColor(status) {
          switch ((status||'').toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'secondary';
            case 'suspended': return 'danger';
            default: return 'secondary';
          }
        }
        // Asignar solo color y letra inicial
        const usersWithAvatar = (Array.isArray(arr) ? arr : []).map((user) => {
          const name = user.firstName || user.first_name || user.name || ''
          const initial = name ? name[0].toUpperCase() : '?'
          return {
            ...user,
            avatar: {
              text: initial,
              color: getStatusColor(user.status)
            }
          }
        })
        setUsers(usersWithAvatar)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
        setUsers([])
        setLoading(false)
      })
  }, [])

  const handleModifyUser = (user) => {
    setCurrentUser({
      id: user.id,
      first_name: user.firstName || user.first_name || '',
      last_name: user.lastName || user.last_name || '',
      email: user.email || '',
      phone: user.phone || user.tlf || '',
      DNI: user.dni || user.DNI || '',
      role_id: user.role?.id || user.role_id || 3,
      status: user.status || 'active',
      password: '',
      birth_date: user.birthDate || user.birth_date || '',
    })
    setConfirmPassword('')
    setVisible(true)
  }

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ visible: true, message, onConfirm })
  }

  const handleDeleteUser = (id) => {
    showConfirm('¿Está seguro de que desea eliminar este usuario?', () => {
      userService.delete(id)
        .then(() => {
          setUsers((prev) => prev.filter((user) => user.id !== id))
          setConfirmModal({ ...confirmModal, visible: false })
          window.location.reload()
        })
        .catch((error) => console.error('Error deleting user:', error))
    })
  }

  const handleSaveUser = () => {
    if (currentUser.password && currentUser.password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    // Mapear los campos para el backend (solo los permitidos)
    const userToSave = {}
    if (currentUser.first_name) userToSave.first_name = currentUser.first_name
    if (currentUser.last_name) userToSave.last_name = currentUser.last_name
    if (currentUser.email) userToSave.email = currentUser.email
    if (currentUser.phone) userToSave.phone = currentUser.phone
    if (currentUser.DNI) userToSave.DNI = currentUser.DNI
    if (currentUser.role_id) userToSave.role_id = Number(currentUser.role_id)
    if (currentUser.status) userToSave.status = String(currentUser.status).toLowerCase().trim()
    if (currentUser.password) userToSave.password = currentUser.password
    if (currentUser.birth_date) userToSave.birth_date = currentUser.birth_date

    const doUpdate = () => {
      if (currentUser.id) {
        userService.update(currentUser.id, userToSave)
          .then(() => {
            setUsers((prev) => prev.map((user) => (user.id === currentUser.id ? { ...user, ...userToSave } : user)))
            setVisible(false)
            setConfirmModal({ ...confirmModal, visible: false })
            window.location.reload()
          })
          .catch((error) => {
            console.error('Error updating user:', error)
            console.error('Detalles del error:', error.response?.data)
            if (error.response?.data?.errors) {
              error.response.data.errors.forEach((err) => console.error('Campo inválido:', err))
            }
          })
      } else {
        userService.create(userToSave)
          .then((newUser) => {
            setUsers((prev) => [...prev, newUser])
            setVisible(false)
            setConfirmModal({ ...confirmModal, visible: false })
            window.location.reload()
          })
          .catch((error) => {
            console.error('Error adding user:', error)
            console.error('Detalles del error:', error.response?.data)
            if (error.response?.data?.errors) {
              error.response.data.errors.forEach((err) => console.error('Campo inválido:', err))
            }
          })
      }
    }

    showConfirm(currentUser.id ? '¿Está seguro de que desea actualizar este usuario?' : '¿Está seguro de que desea agregar este usuario?', doUpdate)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = (id, newStatus) => {
    const allowed = ['active', 'inactive', 'suspended']
    const statusValue = String(newStatus).toLowerCase().trim()
    if (!allowed.includes(statusValue)) {
      console.error('Valor de status inválido:', statusValue)
      return
    }
    showConfirm('¿Está seguro de que desea cambiar el estado de este usuario?', () => {
      const userToUpdate = { status: statusValue }
      userService.update(id, userToUpdate)
        .then(() => {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === id ? { ...user, status: statusValue } : user
            )
          )
          setConfirmModal({ ...confirmModal, visible: false })
          window.location.reload()
        })
        .catch((error) => {
          console.error('Error updating status:', error)
          console.error('Detalles del error:', error.response?.data)
          if (error.response?.data?.errors) {
            error.response.data.errors.forEach((err) => console.error('Campo inválido:', err))
          }
        })
    })
  }

  const safeUsers = Array.isArray(users) ? users : []

  console.log('Current users state:', users)
  console.log('Loading state:', loading)

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          Users ({safeUsers.length})
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
                role: { name: 'Admin' },
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
          ) : safeUsers.length === 0 ? (
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
                {safeUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="text-center">
                      <CAvatar color={user.avatar?.color} textColor="white">{user.avatar?.text}</CAvatar>
                    </td>
                    <td>
                      <div>{user.name || `${user.firstName || ''} ${user.lastName || ''}`}</div>
                      <div className="small text-body-secondary">
                        <span>Status:</span> {user.status}
                      </div>
                    </td>
                    <td>{user.dni}</td>
                    <td>{user.role?.name || user.role || ''}</td>
                    <td>
                      <div>{user.email}</div>
                      <div className="small text-body-secondary">
                        <span>Phone:</span> {user.tlf || user.phone || ''}
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
                      <CButton
                        color="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDeleteUser(user.id)}
                      >
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

      {/* Modal para editar/agregar usuario */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <strong>{currentUser?.id ? 'Edit User' : 'Add New User'}</strong>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>First Name</CFormLabel>
            <CFormInput
              name="first_name"
              value={currentUser?.first_name || ''}
              onChange={handleInputChange}
            />
            <CFormLabel>Last Name</CFormLabel>
            <CFormInput
              name="last_name"
              value={currentUser?.last_name || ''}
              onChange={handleInputChange}
            />
            <CFormLabel>Email</CFormLabel>
            <CFormInput
              name="email"
              value={currentUser?.email || ''}
              onChange={handleInputChange}
            />
            <CFormLabel>Phone</CFormLabel>
            <CFormInput
              name="phone"
              value={currentUser?.phone || ''}
              onChange={handleInputChange}
            />
            <CFormLabel>DNI</CFormLabel>
            <CFormInput
              name="DNI"
              value={currentUser?.DNI || ''}
              onChange={handleInputChange}
            />
            <CFormLabel>Role</CFormLabel>
            <select
              className="form-select"
              name="role_id"
              value={currentUser?.role_id || 3}
              onChange={handleInputChange}
            >
              {ROLES.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <CFormLabel>Status</CFormLabel>
            <select
              className="form-select"
              name="status"
              value={currentUser?.status || 'active'}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <CFormLabel>Birth Date</CFormLabel>
            <CFormInput
              type="date"
              name="birth_date"
              value={currentUser?.birth_date ? String(currentUser.birth_date).substring(0, 10) : ''}
              onChange={handleInputChange}
            />
            <CFormLabel>Password</CFormLabel>
            <CFormInput
              type="password"
              name="password"
              value={currentUser?.password || ''}
              onChange={handleInputChange}
            />
            <CFormLabel>Confirm Password</CFormLabel>
            <CFormInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </CForm>
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

      <CModal visible={confirmModal.visible} onClose={() => setConfirmModal({ ...confirmModal, visible: false })}>
        <CModalHeader>Confirmación</CModalHeader>
        <CModalBody>{confirmModal.message}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setConfirmModal({ ...confirmModal, visible: false })}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={() => { confirmModal.onConfirm && confirmModal.onConfirm() }}>
            Aceptar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Users
