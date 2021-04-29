import React, { useState } from 'react'import Container from 'react-bootstrap/Container'import Row from 'react-bootstrap/Row'import Col from 'react-bootstrap/Col'import Form from 'react-bootstrap/Form'import Toast from 'react-bootstrap/Toast'import Button from 'react-bootstrap/Button'import axios from 'axios'import { Auth } from '../features/auth'export const AddIdea = (props: { request_params: Auth['request_params'] }) => {  const [form, setForm] = useState({    ideaname: '',    short_desc: '',    describtion: '',    tags: '',    link: '',  })  const [msg, setMsg] = useState({    ideaname: [],    short_desc: [],    describtion: [],    tags: [],    link: [],  })  const changeHandler = (event: any) => {    setForm({      ...form,      [event.target.name]: event.target.value,    })  }  const a = axios.create(props.request_params)  const handleAdd = async () => {    a.post('/idea/create', {      ideaname: form.ideaname,      short_desc: form.short_desc,      describtion: form.describtion,      tags: form.tags,      link: form.link,    })      .then(() => {        setMsg({          ideaname: [],          short_desc: [],          describtion: [],          tags: [],          link: [],        })      })      .catch((err: any) => {        console.log(err.response.data)        setMsg(          Object.keys(msg).reduce(            (acc: any, key: string) => {              acc[key] = err.response.data.message.filter((s: string) =>                s.includes(key),              )              return acc            },            {              ideaname: '',              short_desc: '',              describtion: '',              tags: '',              link: '',            },          ),        )      })  }  return (    <Container>      <Row>        <Col>          <Form.Group controlId="ideaname">            <Form.Label>Idea name</Form.Label>            <Form.Control              name="ideaname"              type="text"              placeholder="Idea name"              value={form.ideaname}              onChange={changeHandler}            />          </Form.Group>        </Col>        {msg.ideaname.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in idea name</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row>        <Col>          <Form.Group controlId="short_desc">            <Form.Label>Short describtion</Form.Label>            <Form.Control              name="short_desc"              type="text"              placeholder="short description"              value={form.short_desc}              onChange={changeHandler}            />          </Form.Group>        </Col>        {msg.short_desc.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in short description</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row>        <Col>          <Form.Group controlId="describtion">            <Form.Label>Describtion</Form.Label>            <Form.Control              name="describtion"              type="text"              placeholder="Describtion"              value={form.describtion}              onChange={changeHandler}            />          </Form.Group>        </Col>        {msg.describtion.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in describtion</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row>        <Col>          <Form.Group controlId="tags">            <Form.Label>Tags</Form.Label>            <Form.Control              name="tags"              type="text"              placeholder="Tags"              value={form.tags}              onChange={changeHandler}            />          </Form.Group>        </Col>        {msg.tags.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in tags</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row>        <Col>          <Form.Group controlId="link">            <Form.Label>Link</Form.Label>            <Form.Control              name="link"              type="text"              placeholder="Link"              value={form.link}              onChange={changeHandler}            />          </Form.Group>        </Col>        {msg.link.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in link</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row className="justify-content-evenly">        <Col>          <Button id="register" variant="secondary" onClick={handleAdd}>            Create          </Button>        </Col>      </Row>    </Container>  )}