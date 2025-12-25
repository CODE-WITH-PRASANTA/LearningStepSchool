import React from 'react'
import ContactBreadcrum from '../../Components/ContactBreadcrum/ContactBreadcrum'
import ContactForm from '../../Components/ContactForm/ContactForm'
import ContactMaping from '../../Components/ContactMaping/ContactMaping'

const ContactPage = () => {
  return (
    <div>
        <ContactBreadcrum />
        <ContactForm />
        <ContactMaping />
    </div>
  )
}

export default ContactPage