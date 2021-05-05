import React, { useState } from 'react'
import { Auth } from '../features/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'

export const AboutPage = (props: {
  send: Auth['send']
  email: Auth['email']
  setUsername: Auth['setUsername']
  setEmail: Auth['setEmail']
  setSession: Auth['setSession']
}) => {
  const send = props.send
  const email = props.email
  const setUsername = props.setUsername
  const setEmail = props.setEmail
  const setSession = props.setSession

  const [form, setForm] = useState({
    email: { msg: '', state: '' },
    password: { msg: '', state: '' },
  })

  const [msg, setMsg] = useState({
    errors: { password: [], email: [] },
  })
  const changeHandler = (event: any) => {
    setForm({
      ...form,
      [event.target.name]: { msg: event.target.value, state: ' active' },
    })
  }

  const handleChangeEmail = () => {
    send
      .post('/profile/chemail', { email: form.email.msg })
      .then(() => {
        setEmail(form.email.msg)
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
    send
      .post('/profile/chpasswd', { password: form.password.msg })
      .then((res: any) => {
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

  const handleLogout = () => {
    setSession('')
    setEmail('')
    setUsername('')
    // window.location.assign('/')
  }

  return (
    <Container>
      <Row>
        <Col>
          <Form.Group controlId="email">
            <Form.Label>{'Your current email: ' + email}</Form.Label>
            <Form.Control
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
          <Button id="chemail" variant="primary" onClick={handleChangeEmail}>
            Change email
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
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
          <Button
            id="chpasswd"
            variant="primary"
            onClick={handleChangePassword}
          >
            Change password
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            id="logout"
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
