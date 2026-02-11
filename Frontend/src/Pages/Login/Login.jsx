import React from 'react'
import LoginBreadcrumb from '../../Components/LoginBreadcrumb/LoginBreadcrumb'
import Loginform from '../../Components/Loginform/Loginform'
import ContactForm from '../../Components/ContactForm/ContactForm'
const Login = () => {
  return (
    <div>
      <LoginBreadcrumb />
      <Loginform/>
      <ContactForm />
    </div>
  )
}

export default Login
