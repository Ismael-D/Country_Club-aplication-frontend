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
import { cilPencil, cilTrash } from '@coreui/icons'

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const [filter, setFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/inventory')
      .then((response) => response.json())
      .then((data) => setInventory(data))
      .catch((error) => console.error('Error fetching inventory:', error))
  }, [])

  const handleAddItem = () => {
    setCurrentItem({
      nombre: '',
      codigo: '',
      valor: '',
      descripcion: '',
      cantidad: '',
      tipoMovimiento: '',
      estado: '',
    })
    setShowModal(true)
  }

  const handleSaveItem = () => {
    if (currentItem.id) {
      fetch(`http://localhost:3001/inventory/${currentItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem),
      })
        .then(() => {
          setInventory((prev) =>
            prev.map((item) => (item.id === currentItem.id ? currentItem : item)),
          )
          setShowModal(false)
        })
        .catch((error) => console.error('Error updating item:', error))
    } else {
      // Add new item
      fetch('http://localhost:3001/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem),
      })
        .then((response) => response.json())
        .then((data) => {
          setInventory((prev) => [...prev, data])
          setShowModal(false)
        })
        .catch((error) => console.error('Error adding item:', error))
    }
  }

  const handleDeleteItem = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?')
    if (confirmDelete) {
      fetch(`http://localhost:3001/inventory/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setInventory((prev) => prev.filter((item) => item.id !== id))
        })
        .catch((error) => console.error('Error deleting item:', error))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentItem((prev) => ({ ...prev, [name]: value }))
  }

  const filteredInventory = inventory.filter((item) =>
    item.nombre.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Inventario</CCardHeader>
        <CCardBody>
          <div className="mb-3 d-flex gap-2">
            <CFormInput
              type="text"
              placeholder="Buscar por nombre..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <CButton color="info" onClick={handleAddItem}>
              Agregar
            </CButton>
          </div>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Código</CTableHeaderCell>
                <CTableHeaderCell>Valor</CTableHeaderCell>
                <CTableHeaderCell>Descripción</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Tipo de Movimiento</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredInventory.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.nombre}</CTableDataCell>
                  <CTableDataCell>{item.codigo}</CTableDataCell>
                  <CTableDataCell>{item.valor}</CTableDataCell>
                  <CTableDataCell>{item.descripcion}</CTableDataCell>
                  <CTableDataCell>{item.cantidad}</CTableDataCell>
                  <CTableDataCell>{item.tipoMovimiento}</CTableDataCell>
                  <CTableDataCell>{item.estado}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => {
                        setCurrentItem(item)
                        setShowModal(true)
                      }}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>{' '}
                    <CButton color="danger" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal para agregar/editar elemento */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>{currentItem?.id ? 'Editar Elemento' : 'Agregar Elemento'}</CModalHeader>
        <CModalBody>
          {currentItem && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>Nombre</CFormLabel>
                <CFormInput
                  type="text"
                  name="nombre"
                  value={currentItem.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Código</CFormLabel>
                <CFormInput
                  type="text"
                  name="codigo"
                  value={currentItem.codigo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Valor</CFormLabel>
                <CFormInput
                  type="number"
                  name="valor"
                  value={currentItem.valor}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Descripción</CFormLabel>
                <CFormInput
                  type="text"
                  name="descripcion"
                  value={currentItem.descripcion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Cantidad</CFormLabel>
                <CFormInput
                  type="number"
                  name="cantidad"
                  value={currentItem.cantidad}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Tipo de Movimiento</CFormLabel>
                <CFormSelect
                  name="tipoMovimiento"
                  value={currentItem.tipoMovimiento}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar</option>
                  <option value="Entrada">Entrada</option>
                  <option value="Salida">Salida</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Estado</CFormLabel>
                <CFormSelect name="estado" value={currentItem.estado} onChange={handleInputChange}>
                  <option value="">Seleccionar</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                  <option value="Dañado">Dañado</option>
                </CFormSelect>
              </div>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="info" onClick={handleSaveItem}>
            Guardar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Inventory
