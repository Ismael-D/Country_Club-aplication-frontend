import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const MembersApp = () => {
  const [members, setMembers] = useState([])
  const [filter, setFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentMember, setCurrentMember] = useState(null)

  // Fetch members from json-server
  useEffect(() => {
    fetch('http://localhost:3001/members')
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error('Error fetching members:', error))
  }, [])

  const handleAddMember = () => {
    setCurrentMember({
      nombres: '',
      apellidos: '',
      dni: '',
      correo: '',
      telefono: '',
      fechaPago: '',
      deuda: '',
      estado: '',
    })
    setShowModal(true)
  }

  const handleSaveMember = () => {
    if (currentMember.id) {
      // Update existing member
      fetch(`http://localhost:3001/members/${currentMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMember),
      })
        .then(() => {
          setMembers((prev) =>
            prev.map((member) =>
              member.id === currentMember.id ? currentMember : member
            )
          )
          setShowModal(false)
        })
        .catch((error) => console.error('Error updating member:', error))
    } else {
      // Add new member
      fetch('http://localhost:3001/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMember),
      })
        .then((response) => response.json())
        .then((data) => {
          setMembers((prev) => [...prev, data])
          setShowModal(false)
        })
        .catch((error) => console.error('Error adding member:', error))
    }
  }

  const handleDeleteMember = (id) => {
    fetch(`http://localhost:3001/members/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMembers((prev) => prev.filter((member) => member.id !== id))
      })
      .catch((error) => console.error('Error deleting member:', error))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentMember((prev) => ({ ...prev, [name]: value }))
  }

  const filteredMembers = members.filter((member) =>
    `${member.nombres} ${member.apellidos}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Lista de Miembros</CCardHeader>
        <CCardBody>
          <div className="mb-3">
            <CFormInput
              type="text"
              placeholder="Buscar por nombre o apellido"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <CButton color="primary" className="mt-2" onClick={handleAddMember}>
              Agregar Miembro
            </CButton>
          </div>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombres</CTableHeaderCell>
                <CTableHeaderCell>Apellidos</CTableHeaderCell>
                <CTableHeaderCell>DNI</CTableHeaderCell>
                <CTableHeaderCell>Correo</CTableHeaderCell>
                <CTableHeaderCell>Teléfono</CTableHeaderCell>
                <CTableHeaderCell>Fecha de Pago</CTableHeaderCell>
                <CTableHeaderCell>Deuda</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredMembers.map((member) => (
                <CTableRow key={member.id}>
                  <CTableDataCell>{member.nombres}</CTableDataCell>
                  <CTableDataCell>{member.apellidos}</CTableDataCell>
                  <CTableDataCell>{member.dni}</CTableDataCell>
                  <CTableDataCell>{member.correo}</CTableDataCell>
                  <CTableDataCell>{member.telefono}</CTableDataCell>
                  <CTableDataCell>{member.fechaPago}</CTableDataCell>
                  <CTableDataCell>{member.deuda}</CTableDataCell>
                  <CTableDataCell>{member.estado}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => {
                        setCurrentMember(member)
                        setShowModal(true)
                      }}
                    >
                      Editar
                    </CButton>{' '}
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      Eliminar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal para agregar/editar miembro */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>{currentMember?.id ? 'Editar Miembro' : 'Agregar Miembro'}</CModalHeader>
        <CModalBody>
          {currentMember && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>Nombres</CFormLabel>
                <CFormInput
                  type="text"
                  name="nombres"
                  value={currentMember.nombres}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Apellidos</CFormLabel>
                <CFormInput
                  type="text"
                  name="apellidos"
                  value={currentMember.apellidos}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>DNI</CFormLabel>
                <CFormInput
                  type="text"
                  name="dni"
                  value={currentMember.dni}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Correo</CFormLabel>
                <CFormInput
                  type="email"
                  name="correo"
                  value={currentMember.correo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Teléfono</CFormLabel>
                <CFormInput
                  type="tel"
                  name="telefono"
                  value={currentMember.telefono}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Fecha de Pago</CFormLabel>
                <CFormInput
                  type="date"
                  name="fechaPago"
                  value={currentMember.fechaPago}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Deuda</CFormLabel>
                <CFormInput
                  type="number"
                  name="deuda"
                  value={currentMember.deuda}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Estado</CFormLabel>
                <select
                  className="form-select"
                  name="estado"
                  value={currentMember.estado}
                  onChange={handleInputChange}
                >
                  <option value="al_dia">Al día</option>
                  <option value="con_deuda">Con deuda</option>
                </select>
              </div>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSaveMember}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default MembersApp