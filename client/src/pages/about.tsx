import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Auth } from '../features/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'

const axios = require('axios').default

export const About = (props: { auth: Auth; chemail: any; setSession: any }) => {
  const auth = props.auth
  const chemail = props.chemail
  const setSession = props.setSession

  const [form, setForm] = useState({
    email: { msg: '', state: '' },
    password: { msg: '', state: '' },
  })

  const [msg, setMsg] = useState({
    errors: { password: [], email: [] },
  })

  const [msg2, setMsg2] = useState({
    message: '',
    color: 'gray',
  })

  const changeHandler = (event: any) => {
    setForm({
      ...form,
      [event.target.name]: { msg: event.target.value, state: ' active' },
    })
  }

  const a = axios.create(auth.request_params)

  const handleChangeEmail = () => {
    a.post('/profile/chemail', { email: form.email.msg })
      .then((res: any) => {
        chemail(res.data.username)
        setMsg({
          errors: { email: [], password: [] },
        })
      })
      .catch((err: any) =>
        setMsg({
          errors: Object.keys(msg.errors).reduce(
            (acc: any, key: string) => {
              acc[key] = err.response.data.message.filter((s: string) =>
                s.includes(key),
              )
              return acc
            },
            { email: '', password: '', username: '' },
          ),
        }),
      )
  }

  const handleChangePassword = () => {
    a.post('/profile/chpasswd', { password: form.password.msg })
      .then((res: any) => {
        setMsg2({ message: 'Password has changed', color: 'green' })
      })
      .catch((err: any) =>
        setMsg2({ message: err.response.data.message, color: 'red' }),
      )
  }

  const handleLogout = () => {
    setSession('', '', '')
    window.location.assign('/')
  }

  return (
    <Container>
      <Row>
        <Col>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email.msg}
              onChange={changeHandler}
            />
          </Form.Group>
        </Col>
        <Col>
          {msg.errors.email.map((err) => (
            <Toast>
              <Toast.Header closeButton={false}>
                <strong className="mr-auto">Error in email</strong>
              </Toast.Header>
              <Toast.Body>{err}</Toast.Body>
            </Toast>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={handleChangeEmail}>
            Change email
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="exampleForm.ControlInput3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password.msg}
              onChange={changeHandler}
            />
          </Form.Group>
        </Col>
        <Col>
          {msg.errors.password.map((err) => (
            <Toast>
              <Toast.Header closeButton={false}>
                <strong className="mr-auto">Error in password</strong>
              </Toast.Header>
              <Toast.Body>{err}</Toast.Body>
            </Toast>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={handleChangePassword}>
            Change password
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            onClick={handleLogout}
            className="float-right"
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  )
}
