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
import { cilPencil, cilUserUnfollow } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [filter, setFilter] = useState('')
  const [filterType, setFilterType] = useState('name')
  const [showModal, setShowModal] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3004/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error))
  }, [])

  const handleAddEmployee = () => {
    setCurrentEmployee({
      nombres: '',
      apellidos: '',
      dni: '',
      correo: '',
      telefono: '',
      posicion: '',
      salario: '',
    })
    setShowModal(true)
  }

  const handleSaveEmployee = () => {
    if (currentEmployee.id) {
      // Update existing employee
      fetch(`http://localhost:3004/employees/${currentEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEmployee),
      })
        .then(() => {
          setEmployees((prev) =>
            prev.map((employee) =>
              employee.id === currentEmployee.id ? currentEmployee : employee,
            ),
          )
          setShowModal(false)
        })
        .catch((error) => console.error('Error updating employee:', error))
    } else {
      // Add new employee
      fetch('http://localhost:3004/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEmployee),
      })
        .then((response) => response.json())
        .then((data) => {
          setEmployees((prev) => [...prev, data])
          setShowModal(false)
        })
        .catch((error) => console.error('Error adding employee:', error))
    }
  }

  const handleDeleteEmployee = (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este empleado?')
    if (confirmDelete) {
      fetch(`http://localhost:3004/employees/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setEmployees((prev) => prev.filter((employee) => employee.id !== id))
        })
        .catch((error) => console.error('Error deleting employee:', error))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleNavigateToAssignWork = (id) => {
    navigate(`/modules/members/events`) // Redirigir a la ruta con el ID del empleado
  }

  // Filtrar empleados según el tipo de filtro seleccionado
  const filteredEmployees = employees.filter((employee) => {
    const searchValue = filter.toLowerCase()
    switch (filterType) {
      case 'name':
        return `${employee.nombres} ${employee.apellidos}`.toLowerCase().includes(searchValue)
      case 'dni':
        return employee.dni.toLowerCase().includes(searchValue)
      case 'posicion':
        return employee.posicion.toLowerCase().includes(searchValue)
      default:
        return true
    }
  })

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Lista de Empleados</CCardHeader>
        <CCardBody>
          <div className="mb-3 d-flex gap-2">
            <CFormSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-auto"
            >
              <option value="name">Buscar por Nombre</option>
              <option value="dni">Buscar por Cédula</option>
              <option value="posicion">Buscar por Posición</option>
            </CFormSelect>
            <CFormInput
              type="text"
              placeholder="Escribe para buscar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <CButton color="info" onClick={handleAddEmployee}>
              Add
            </CButton>
          </div>
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>DNI</th>
                <th>Contact</th>
                <th>Posición</th>
                <th>Salario</th>
                <th>Acciones</th>
                <th>Assign Work</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{`${employee.nombres} ${employee.apellidos}`}</td>
                  <td>{employee.dni}</td>
                  <td>
                    <div>{employee.correo}</div>
                    <div className="small text-body-secondary">
                      <span>Teléfono:</span> {employee.telefono}
                    </div>
                  </td>
                  <td>{employee.posicion}</td>
                  <td>{employee.salario}</td>
                  <td>
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => {
                        setCurrentEmployee(employee)
                        setShowModal(true)
                      }}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <CIcon icon={cilUserUnfollow} />
                    </CButton>
                  </td>
                  <td>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => handleNavigateToAssignWork(employee.id)}
                    >
                      Assign Work
                    </CButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Modal para agregar/editar empleado */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>{currentEmployee?.id ? 'Editar Empleado' : 'Agregar Empleado'}</CModalHeader>
        <CModalBody>
          {currentEmployee && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>Nombres</CFormLabel>
                <CFormInput
                  type="text"
                  name="nombres"
                  value={currentEmployee.nombres}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Apellidos</CFormLabel>
                <CFormInput
                  type="text"
                  name="apellidos"
                  value={currentEmployee.apellidos}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>DNI</CFormLabel>
                <CFormInput
                  type="text"
                  name="dni"
                  value={currentEmployee.dni}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Correo</CFormLabel>
                <CFormInput
                  type="email"
                  name="correo"
                  value={currentEmployee.correo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Teléfono</CFormLabel>
                <CFormInput
                  type="tel"
                  name="telefono"
                  value={currentEmployee.telefono}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Posición</CFormLabel>
                <CFormInput
                  type="text"
                  name="posicion"
                  value={currentEmployee.posicion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Salario </CFormLabel>
                <CFormInput
                  type="number"
                  name="salario"
                  value={currentEmployee.salario}
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
          <CButton color="info" onClick={handleSaveEmployee}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Employees
