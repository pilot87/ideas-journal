import React, { useState } from 'react'
import axios from 'axios'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'

export const AddUser = () => {
  const [form, setForm] = useState({
    email: { msg: '', state: 'adduser_label' },
    password: { msg: '', state: 'adduser_label' },
    username: { msg: '', state: 'adduser_label' },
  })

  const [msg, setMsg] = useState({
    errors: { email: [], password: [], username: [] },
  })

  const changeHandler = (event: any) => {
    setForm({
      ...form,
      [event.target.name]: {
        msg: event.target.value,
        state: 'adduser_label active',
      },
    })
  }

  const a = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json', Authorization: '' },
  })

  const handleRegister = async () => {
    a.post('/auth/register', {
      email: form.email.msg,
      username: form.username.msg,
      password: form.password.msg,
    })
      .then((res: any) => {
        setMsg({
          errors: { email: [], password: [], username: [] },
        })
        window.location.assign('login')
      })
      .catch((err: any) => {
        console.log(err.response.data)
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
        })
      })
  }

  return (
    <Container fluid>
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
      </Row>
      <Row>
        {msg.errors.email.map((err) => (
          <Toast>
            <Col>
              <Toast.Header closeButton={false}>
                <strong className="mr-auto">Error in email</strong>
              </Toast.Header>
              <Toast.Body>{err}</Toast.Body>
            </Col>
          </Toast>
        ))}
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>User name</Form.Label>
            <Form.Control
              id="username"
              name="username"
              type="text"
              placeholder="User name"
              value={form.username.msg}
              onChange={changeHandler}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        {msg.errors.username.map((err) => (
          <Toast>
            <Col>
              <Toast.Header closeButton={false}>
                <strong className="mr-auto">Error in user name</strong>
              </Toast.Header>
              <Toast.Body>{err}</Toast.Body>
            </Col>
          </Toast>
        ))}
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
      </Row>
      <Row>
        {msg.errors.password.map((err) => (
          <Toast>
            <Col>
              <Toast.Header closeButton={false}>
                <strong className="mr-auto">Error in password</strong>
              </Toast.Header>
              <Toast.Body>{err}</Toast.Body>
            </Col>
          </Toast>
        ))}
      </Row>
      <Row>
        <Col>
          <Button
            id="register"
            variant="secondary"
            className="float-right"
            onClick={handleRegister}
          >
            Register
          </Button>
        </Col>
      </Row>
    </Container>
  )
}
