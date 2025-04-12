import React, { useState } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
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
import {
  cilPeople,
  cilPencil,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpeg'
import avatar2 from 'src/assets/images/avatars/2.jpeg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

const Users = () => {
  const [tableExample, setTableExample] = useState([
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Ismael Sanchez',
        new: true,
        registered: 'Jan 1, 2023',
        role: 'Admin',
        email: 'ismael.sanchez@example.com',
        tlf: '0412-3456789',
        dni: 'V-12345678',
        status: 'Active',
      },
    },
    {
      avatar: { src: avatar2, status: 'success' },
      user: {
        name: 'Liliana Sanchez',
        new: false,
        registered: 'Jan 1, 2023',
        role: 'Manager',
        email: 'liliana.sanchez@example.com',
        tlf: '0412-9876543',
        dni: 'V-87654321',
        status: 'Inactive',
      },
    },
    {
      avatar: { src: avatar4, status: 'success' },
      user: {
        name: 'Enéas Kwadwo',
        new: true,
        registered: 'Jan 1, 2023',
        role: 'Manager',
        email: 'eneas.kwadwo@example.com',
        tlf: '0412-1234567',
        dni: 'V-11223344',
        status: 'Suspended',
      },
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
        role: 'Event Coordinator',
        email: 'friderik.david@example.com',
        tlf: '0412-7654321',
        dni: 'V-55667788',
        status: 'Inactive',
      },
    },
  ])

  const [visible, setVisible] = useState(false) // Estado para mostrar/ocultar el modal
  const [currentUser, setCurrentUser] = useState(null) // Usuario seleccionado para editar

  const handleModifyUser = (index) => {
    setCurrentUser({ ...tableExample[index], index }) // Guarda el usuario actual y su índice
    setVisible(true) // Muestra el modal
  }

  const handleSaveUser = () => {
    const updatedTable = [...tableExample]
    updatedTable[currentUser.index] = currentUser // Actualiza el usuario en la tabla
    setTableExample(updatedTable) // Actualiza el estado de la tabla
    setVisible(false) // Cierra el modal
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentUser((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      },
    }))
  }

  const handleStatusChange = (index, newStatus) => {
    const updatedTable = [...tableExample]
    updatedTable[index].user.status = newStatus
    updatedTable[index].avatar.status =
      newStatus === 'Active' ? 'success' : newStatus === 'Inactive' ? 'secondary' : 'danger'
    setTableExample(updatedTable)
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Users</CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive style={{ width: '100%' }}>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  <CIcon icon={cilPeople} />
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">DNI</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Roles</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Contact</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {tableExample.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center">
                    <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.user.name}</div>
                    <div className="small text-body-secondary text-nowrap">
                      <span>Status</span>:{' '}{item.user.status}
                    </div>
                  </CTableDataCell>
                  
                  <CTableDataCell>
                    <div>{item.user.dni}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.user.role}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.user.email}</div>
                    <div className="small text-body-secondary text-nowrap">
                      <span>TLF</span>:{' '}{item.user.tlf}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="success" size="sm" onClick={() => handleModifyUser(index)}>
                      <CIcon icon={cilPencil} />
                    </CButton>{' '}
                    <CDropdown>
                      <CDropdownToggle color="secondary" size="sm">
                        Change Status
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem onClick={() => handleStatusChange(index, 'Active')}>
                          Active
                        </CDropdownItem>
                        <CDropdownItem onClick={() => handleStatusChange(index, 'Inactive')}>
                          Inactive
                        </CDropdownItem>
                        <CDropdownItem onClick={() => handleStatusChange(index, 'Suspended')}>
                          Suspended
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal para editar usuario */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>Edit User</CModalHeader>
        <CModalBody>
          {currentUser && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  value={currentUser.user.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  value={currentUser.user.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Phone</CFormLabel>
                <CFormInput
                  type="text"
                  name="tlf"
                  value={currentUser.user.tlf}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>DNI</CFormLabel>
                <CFormInput
                  type="text"
                  name="dni"
                  value={currentUser.user.dni}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Role</CFormLabel>
                <select
                  className="form-select"
                  name="role"
                  value={currentUser.user.role}
                  onChange={handleInputChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                </select>
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