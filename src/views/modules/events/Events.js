import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CForm,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
} from '@coreui/react'

const Events = () => {
  const [options1, setOptions] = useState([])
  const [orders, setOrders] = useState([])
  const [order, setOrder] = useState({
    orderId: '',
    fecha: '',
  })

  const [disabled, setDisabled] = useState(false)
  const [patientData, setPatientData] = useState({
    tipoE: '',
    cedula: '',
    nombres: '',
    sexo: '',
    edad: '',
    telf: '',
    correo: '',
    direccion: '',
  })

  useEffect(() => {
    // Simulación de obtener opciones (puedes reemplazar con tu API)
    setOptions([
      { value: 'opcion1', label: 'Opción 1' },
      { value: 'opcion2', label: 'Opción 2' },
    ])
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setPatientData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleChange2 = (e) => {
    const { name, value } = e.target
    setOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Patient Data:', patientData)
    console.log('Order:', order)
    console.log('Orders:', orders)
  }

  return (
    <>
      <CForm onSubmit={handleSubmit}>
        <CCard className="mb-4">
          <CCardHeader>Agregar solicitud</CCardHeader>
          <CInputGroup className="d-flex pb-2">
            <CInputGroupText>Nro de solicitud</CInputGroupText>
            <CFormInput
              name="orderId"
              value={order.orderId}
              onChange={handleChange2}
              type="number"
              placeholder="Ej. 12345"
            />
            <CInputGroupText>Fecha</CInputGroupText>
            <CFormInput
              name="fecha"
              value={order.fecha}
              onChange={handleChange2}
              type="date"
            />
          </CInputGroup>
          <br />
          
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>Información del inquilino</CCardHeader>
          <CInputGroup>
            <CInputGroupText>N° Documento:</CInputGroupText>
            <CFormInput
              name="cedula"
              value={patientData.cedula}
              onChange={handleChange}
              type="number"
              placeholder="Ej. 12345678"
            />
          </CInputGroup>
          <br />
          <CInputGroup>
            <CInputGroupText>Nombre:</CInputGroupText>
            <CFormInput
              name="nombres"
              value={patientData.nombres}
              onChange={handleChange}
              type="text"
              placeholder="Ej. Juan Pérez"
              autoComplete="name"
              disabled={disabled}
            />
             <CInputGroupText>Apellidos</CInputGroupText>
            <CFormInput
              name="apellidos"
              value={patientData.nombres}
              onChange={handleChange}
              type="text"
              placeholder="Ej. Juan Pérez"
              autoComplete="name"
              disabled={disabled}
            />

          </CInputGroup>
          <br />
          <CInputGroup>
            <CInputGroupText>Edad:</CInputGroupText>
            <CFormInput
              name="edad"
              value={patientData.edad}
              onChange={handleChange}
              type="number"
              placeholder="Ej. 30"
            />
            <CInputGroupText>Género</CInputGroupText>
            <CFormSelect
              name="sexo"
              value={patientData.sexo}
              onChange={handleChange}
              disabled={disabled}
            >
              <option value="">Seleccione el género</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </CFormSelect>
          </CInputGroup>
          <br />
          <CInputGroup>
            <CInputGroupText>Correo</CInputGroupText>
            <CFormInput
              name="correo"
              value={patientData.correo}
              onChange={handleChange}
              type="email"
              placeholder="ejemplo@gmail.com"
              disabled={disabled}
            />
            <CInputGroupText>Teléfono</CInputGroupText>
            <CFormInput
              name="telf"
              value={patientData.telf}
              onChange={handleChange}
              type="tel"
              placeholder="Ej. 042612345678"
              disabled={disabled}
            />
          </CInputGroup>
          <br />
          <CInputGroup>
            <CInputGroupText>Dirección</CInputGroupText>
            <CFormInput
              name="direccion"
              value={patientData.direccion}
              onChange={handleChange}
              type="text"
              placeholder="Ej. Calle 123, Ciudad"
              disabled={disabled}
            />
          </CInputGroup>
        </CCard>

        <CButton type="submit" color="primary">
          Guardar
        </CButton>
      </CForm>
    </>
  )
}

export default Events