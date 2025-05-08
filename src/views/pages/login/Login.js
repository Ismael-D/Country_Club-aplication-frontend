import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CImage
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import unnamed from '../../../assets/images/unnamed.webp';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false); // Estado para el modal de recuperar contraseña
  const navigate = useNavigate();

  const Credentials = [
    { username: 'admin', password: '1234' },
  ]

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const founduser = Credentials.find(
        user => user.username === username && user.password === password
      )

      if (founduser) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify({
          username: founduser.username
        }))
        navigate('/dashboard')
      } else {
        setError('Contraseña Incorrecta')
      }
      setLoading(false)
    }, 1800)
  };

  const handleSaveMember = () => {
    // Validar que el estado y la deuda sean consistentes
    if (currentMember.estado === 'al_dia' && currentMember.deuda > 0) {
      alert('Un miembro al día no puede tener deuda.');
      return;
    }
    if (currentMember.estado === 'con_deuda' && currentMember.deuda === 0) {
      alert('Un miembro con deuda no puede tener deuda 0.');
      return;
    }

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
          );
          setShowModal(false);
        })
        .catch((error) => console.error('Error updating member:', error));
    } else {
      // Add new member
      fetch('http://localhost:3001/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMember),
      })
        .then((response) => response.json())
        .then((data) => {
          setMembers((prev) => [...prev, data]);
          setShowModal(false);
        })
        .catch((error) => console.error('Error adding member:', error));
    }
  };

  return (
    <div
      className="bg-body-tertiary min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${unnamed})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4" style={{
                backgroundColor: '#071923',
                border: '1px solid',
                borderRadius: '1rem',
                boxShadow: '1rem 1rem 1rem rgb(11, 41, 53)'
              }}>
                <CCardBody>
                  {/* Imagen centralizada */}
                  <div className="text-center mb-4">
                    <CImage
                      align="center"
                      src="src/assets/images/imagen_2025-04-09_222352977-modified.png"
                      height={100}
                    />
                  </div>

                  <CForm onSubmit={handleLogin} style={{ color: 'white' }}>
                    <h1>Login</h1>
                    <p className="text-body-secondary" >Sign In to your account</p>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {error && (<CAlert color="danger">{error}</CAlert>)}

                    <CRow>
                      <CCol xs={12} className="text-start"> {/* Cambiado a text-start para alinear a la izquierda */}
                        <CButton color="warning" className="px-4 me-2" type="submit" disabled={loading}>
                          {loading ? <CSpinner size="sm" className="me-2" /> : null}
                          {loading ? 'Loading...' : 'Login'}
                        </CButton>
                        <CButton color="warning" onClick={() => setVisible(true)}>
                          Recuperar Contraseña
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      {/* Modal para recuperar contraseña */}
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Recuperar Contraseña</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type='email'
            placeholder='Ingrese su correo electrónico'
            autoComplete='email'
            required
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="warning">Enviar</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Login