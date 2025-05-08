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
  CSpinner
} from '@coreui/react' 

import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons' 
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
//import centroArtesanal from '../../../assets/images/centroArtesanal.jpg' 
//import AlertMessage from './Alerta'

export const ModalStaticBackdropExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>      
    <CButton color="success" onClick={() => setVisible(!visible)}>
      Recuperar Contraseña
    </CButton>

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
        <CButton color="success">Enviar</CButton>
      </CModalFooter>
    </CModal>
  </>
  )
}

export const SpinnerGrowExample = () => {
  return <CSpinner as="span" className="me-2" size="sm" variant="grow" aria-hidden="true" />
}

const Login = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const Credentials = [
    { username: 'cesaradmin', password: 'cesaradmin41'},
    { username: 'orianaadmin', password: '1234'},
    { username: 'gabyveadmin', password: 'gabyveadmin41'}
  ]

  const handleLogin = (e) => {
    e.preventDefault(); 
    setLoading(true);   
    setError(''); 
    
  setTimeout(() => {

    const founduser = Credentials.find (
      user => user.username === username && user.password === password
    )

    if (founduser) {
      localStorage.setItem ('isAuthenticated', 'true')
      localStorage.setItem ('user', JSON.stringify({
        username: founduser.username
      }))
      navigate ('/dashboard')
    } else {
      setError ('Crontraseña Incorrecta')
    }
    setLoading (false)
    }, 1800 )
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center" 
      style={{
      //backgroundImage: url(${centroArtesanal}), 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}> 

      <CContainer>
        <CRow className="justify-content-end">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4" style={{ 
                border: '1px solid',
                borderRadius: '1rem', 
                boxShadow: '1rem 1rem 1rem rgba(0, 0, 0, 0.75)' 
              }}>
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    
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

                    { error && (<AlertMessage/>) }
                    
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="success" className="px-4" type="submit" disabled={loading}>
                          {loading ? <SpinnerGrowExample /> : null}
                          {loading ? 'Loading...' : 'Login'}
                        </CButton>
                      </CCol>

                      <CCol xs={6} className="text-right" >
                        <div>
                          <ModalStaticBackdropExample />
                        </div>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login