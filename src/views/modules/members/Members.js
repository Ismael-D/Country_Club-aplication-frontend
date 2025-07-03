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
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilUserUnfollow, cilCheckCircle } from '@coreui/icons'
import { useNavigate } from 'react-router-dom' // Importar useNavigate
import { memberService } from '../../services/api'

const MembersApp = () => {
  const [members, setMembers] = useState([])
  const [filter, setFilter] = useState('')
  const [filterType, setFilterType] = useState('name') // Tipo de filtro seleccionado
  const [showModal, setShowModal] = useState(false)
  const [currentMember, setCurrentMember] = useState(null)
  const navigate = useNavigate() // Hook para manejar la navegación

  useEffect(() => {
    memberService.getAll()
      .then((data) => {
        const updatedMembers = data.map((member) => {
          const { deuda, estado } = calculateDebt(member.fechaPago)
          return {
            ...member,
            deuda,
            estado,
          }
        })
        setMembers(updatedMembers)
      })
      .catch((error) => console.error('Error fetching members:', error))
  }, [])

  const calculateDebt = (fechaPago) => {
    if (!fechaPago) return { deuda: 0, estado: 'al_dia' }

    const lastPaymentDate = new Date(fechaPago)
    const today = new Date()
    const monthsDifference =
      today.getFullYear() * 12 +
      today.getMonth() -
      (lastPaymentDate.getFullYear() * 12 + lastPaymentDate.getMonth())
    const deuda = monthsDifference > 0 ? monthsDifference * 50 : 0 // $50 por mes de deuda
    return {
      deuda,
      estado: deuda > 0 ? 'con_deuda' : 'al_dia', // Determinar el estado
    }
  }

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
    const { deuda, estado } = calculateDebt(currentMember.fechaPago)
    const updatedMember = {
      ...currentMember,
      deuda,
      estado,
    }

    if (updatedMember.id) {
      // Update existing member
      memberService.update(updatedMember.id, updatedMember)
        .then(() => {
          setMembers((prev) =>
            prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)),
          )
          setShowModal(false)
        })
        .catch((error) => console.error('Error updating member:', error))
    } else {
      // Add new member
      memberService.create(updatedMember)
        .then((data) => {
          setMembers((prev) => [...prev, data])
          setShowModal(false)
        })
        .catch((error) => console.error('Error adding member:', error))
    }
  }

  const handleMarkAsPaid = (id) => {
    const today = new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
    const updatedMembers = members.map((member) =>
      member.id === id ? { ...member, fechaPago: today, deuda: 0, estado: 'al_dia' } : member,
    )
    setMembers(updatedMembers)

    const memberToUpdate = updatedMembers.find((member) => member.id === id)
    memberService.delete(id)
      .then(() => {
        setMembers((prev) => prev.filter((member) => member.id !== id))
      })
      .catch((error) => console.error('Error updating member:', error))
  }

  const handleDeleteMember = (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este miembro?')
    if (confirmDelete) {
      memberService.delete(id)
        .then(() => {
          setMembers((prev) => prev.filter((member) => member.id !== id))
        })
        .catch((error) => console.error('Error deleting member:', error))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentMember((prev) => ({ ...prev, [name]: value }))
  }

  const handleNavigateToEvents = (id) => {
    navigate(`/modules/members/events`) // Redirigir a la ruta con el ID del miembro
  }

  // Filtrar miembros según el tipo de filtro seleccionado
  const filteredMembers = members.filter((member) => {
    const searchValue = filter.toLowerCase()
    switch (filterType) {
      case 'name':
        return `${member.nombres} ${member.apellidos}`.toLowerCase().includes(searchValue)
      case 'dni':
        return member.dni.toLowerCase().includes(searchValue)
      case 'deuda':
        return member.deuda.toString().includes(searchValue)
      case 'fechaPago':
        return member.fechaPago.toLowerCase().includes(searchValue)
      default:
        return true
    }
  })

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Lista de Miembros</CCardHeader>
        <CCardBody>
          <div className="mb-3 d-flex gap-2">
            <CFormSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-auto"
            >
              <option value="name">Buscar por Nombre</option>
              <option value="dni">Buscar por Cédula</option>
              <option value="deuda">Buscar por Deuda</option>
              <option value="fechaPago">Buscar por Fecha de Pago</option>
            </CFormSelect>
            <CFormInput
              type="text"
              placeholder="Escribe para buscar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <CButton color="info" onClick={handleAddMember}>
              Add
            </CButton>
          </div>
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>DNI</th>
                <th>Contact</th>
                <th>Last payment</th>
                <th>Estado</th>
                <th>Deuda</th>
                <th>Acciones</th>
                <th>Eventos</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>{`${member.nombres} ${member.apellidos}`}</td>
                  <td>{member.dni}</td>
                  <td>
                    <div>{member.correo}</div>
                    <div className="small text-body-secondary">
                      <span>Teléfono:</span> {member.telefono}
                    </div>
                  </td>
                  <td>{member.fechaPago}</td>
                  <td>{member.estado}</td>
                  <td>{member.deuda}</td>
                  <td>
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => {
                        setCurrentMember(member)
                        setShowModal(true)
                      }}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="info" size="sm" onClick={() => handleMarkAsPaid(member.id)}>
                      <CIcon icon={cilCheckCircle} /> Pago
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDeleteMember(member.id)}>
                      <CIcon icon={cilUserUnfollow} />
                    </CButton>
                  </td>
                  <td>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => handleNavigateToEvents(member.id)}
                    >
                      Ver Eventos
                    </CButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <CButton color="info" onClick={handleSaveMember}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default MembersApp
