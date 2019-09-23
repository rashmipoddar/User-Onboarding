import React, { useState, useEffect } from 'react';
import { withFormik , Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const UserForm = ({ values, touched, errors, status }) => {
  const [ users, setUsers ] = useState([]);
  // console.log(status);

  useEffect(() => {
    if (status) {
      setUsers([...users, status])
    }
  }, [status])

  return (
    <div>
    <Form>
      <Field type='name' name='name' placeholder='Name' />
      {touched.name && errors.name && (<p>{errors.name}</p>)}
      <Field type='email' name='email' placeholder='Email' />
      {touched.email && errors.email && (<p>{errors.email}</p>)}
      <Field type='password' name='password' placeholder='Password' />
      {touched.password && errors.password && (<p>{errors.password}</p>)}
      <label>
        <Field type="checkbox" name="tos" checked={values.tos} />
        Terms of Service
      </label>
      {/* The reason for wrapping checkbox inside label is that it makes the text clickable along with the box */}
      <button type='submit'>Submit</button>
    </Form>
    {users.map(user => (
      <ul key={user.id}>
        <li>{user.name}</li>
        <li>{user.email}</li>
      </ul>  
    ))}
    </div>
  )
}

const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, password, tos }) {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      tos: tos || false
    }
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required(),
    email: Yup.string()
      .required(),
    password: Yup.string()
      .min(8, 'Minimum 8 characters required')
      .required('Password is a required field')
      
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    // console.log(values);
    axios
      .post('https://reqres.in/api/users', values) 
        .then(response => {
          // console.log(response);
          // console.log(response.data);
          setStatus(response.data);
          resetForm();
        })
        .catch(error => {
          console.log(error);
        })
  }
})(UserForm);

export default FormikUserForm;
