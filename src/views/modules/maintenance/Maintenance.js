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
  CFormTextarea,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCheckCircle } from '@coreui/icons'
import { maintenanceService } from '../../services/api'

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([])
  const [filter, setFilter] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)

  useEffect(() => {
    loadMaintenance()
  }, [])

  const loadMaintenance = () => {
    maintenanceService.getAll()
      .then((data) => setMaintenance(data))
      .catch((error) => console.error('Error fetching maintenance:', error))
  }

  const handleAddTask = () => {
    setCurrentTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assigned_to: '',
      estimated_cost: '',
      location: '',
    })
    setShowModal(true)
  }

  const handleSaveTask = () => {
    if (currentTask.id) {
      maintenanceService.update(currentTask.id, currentTask)
        .then(() => {
          loadMaintenance()
          setShowModal(false)
        })
        .catch((error) => console.error('Error updating task:', error))
    } else {
      maintenanceService.create(currentTask)
        .then(() => {
          loadMaintenance()
          setShowModal(false)
        })
        .catch((error) => console.error('Error creating task:', error))
    }
  }

  const handleDeleteTask = (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')
    if (confirmDelete) {
      maintenanceService.delete(id)
        .then(() => {
          loadMaintenance()
        })
        .catch((error) => console.error('Error deleting task:', error))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    maintenanceService.updateStatus(id, newStatus)
      .then(() => {
        loadMaintenance()
      })
      .catch((error) => console.error('Error updating status:', error))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentTask((prev) => ({ ...prev, [name]: value }))
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
      cancelled: 'danger',
    }
    return <CBadge color={statusColors[status] || 'secondary'}>{status}</CBadge>
  }

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
    }
    return <CBadge color={priorityColors[priority] || 'secondary'}>{priority}</CBadge>
  }

  const filteredMaintenance = maintenance.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(filter.toLowerCase()) ||
                         task.description.toLowerCase().includes(filter.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Mantenimiento</CCardHeader>
        <CCardBody>
          <div className="mb-3 d-flex gap-2">
            <CFormSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-auto"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </CFormSelect>
            <CFormInput
              type="text"
              placeholder="Buscar tareas..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <CButton color="info" onClick={handleAddTask}>
              Agregar Tarea
            </CButton>
          </div>
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Asignado a</th>
                <th>Costo Estimado</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaintenance.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{getPriorityBadge(task.priority)}</td>
                  <td>{getStatusBadge(task.status)}</td>
                  <td>{task.assigned_to}</td>
                  <td>${task.estimated_cost}</td>
                  <td>{task.location}</td>
                  <td>
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => {
                        setCurrentTask(task)
                        setShowModal(true)
                      }}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    {task.status !== 'completed' && (
                      <CButton
                        color="success"
                        size="sm"
                        onClick={() => handleStatusChange(task.id, 'completed')}
                      >
                        <CIcon icon={cilCheckCircle} />
                      </CButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Modal para agregar/editar tarea */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          {currentTask?.id ? 'Editar Tarea' : 'Agregar Tarea'}
        </CModalHeader>
        <CModalBody>
          {currentTask && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>Título</CFormLabel>
                <CFormInput
                  type="text"
                  name="title"
                  value={currentTask.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Descripción</CFormLabel>
                <CFormTextarea
                  name="description"
                  value={currentTask.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Prioridad</CFormLabel>
                <CFormSelect
                  name="priority"
                  value={currentTask.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Estado</CFormLabel>
                <CFormSelect
                  name="status"
                  value={currentTask.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En progreso</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Asignado a</CFormLabel>
                <CFormInput
                  type="text"
                  name="assigned_to"
                  value={currentTask.assigned_to}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Costo Estimado</CFormLabel>
                <CFormInput
                  type="number"
                  name="estimated_cost"
                  value={currentTask.estimated_cost}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Ubicación</CFormLabel>
                <CFormInput
                  type="text"
                  name="location"
                  value={currentTask.location}
                  onChange={handleInputChange}
                />
              </div>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSaveTask}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Maintenance
