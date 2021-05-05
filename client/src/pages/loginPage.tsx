import React, { useState } from 'react'
import axios from 'axios'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import { Auth } from '../features/auth'

export const LoginPage = (props: {
  setSession: Auth['setSession']
  setUsername: Auth['setUsername']
  setEmail: Auth['setEmail']
}) => {
  const [form, setForm] = useState({
    username: { msg: '', state: '' },
    password: { msg: '', state: '' },
  })

  const [msg, setMsg] = useState({
    errors: { password: [], username: [] },
  })

  const changeHandler = (event: any) => {
    setForm({
      ...form,
      [event.target.name]: { msg: event.target.value, state: ' active' },
    })
  }

  const a = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json', Authorization: '' },
  })

  const handleLogin = () => {
    a.post('/auth/login', {
      username: form.username.msg,
      password: form.password.msg,
    })
      .then((res: any) => {
        props.setSession('Bearer ' + res.data.token)
        props.setUsername(res.data.username)
        props.setEmail(res.data.email)
        // window.location.assign('about')
      })
      .catch((err: any) => {
        setMsg({
          errors: Object.keys(msg.errors).reduce(
            (acc: any, key: string) => {
              acc[key] = err.response.data.message.filter((s: string) =>
                s.includes(key),
              )
              return acc
            },
            { password: '', username: '' },
          ),
        })
      })
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form.Group controlId="username">
            <Form.Label>User name</Form.Label>
            <Form.Control
              name="username"
              type="text"
              placeholder="User name"
              value={form.username.msg}
              onChange={changeHandler}
            />
          </Form.Group>
        </Col>
        <Col>
          {msg.errors.username.map((err) => (
            <Toast>
              <Toast.Header closeButton={false}>
                <strong className="mr-auto">Error in user name</strong>
              </Toast.Header>
              <Toast.Body>{err}</Toast.Body>
            </Toast>
          ))}
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
            variant="secondary"
            className="float-right"
            id="login"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  )
}
