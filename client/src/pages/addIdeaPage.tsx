import React, { useState } from 'react'import { observer } from 'mobx-react-lite'import Container from 'react-bootstrap/Container'import Row from 'react-bootstrap/Row'import Col from 'react-bootstrap/Col'import Form from 'react-bootstrap/Form'import Toast from 'react-bootstrap/Toast'import Button from 'react-bootstrap/Button'import Badge from 'react-bootstrap/Badge'import Alert from 'react-bootstrap/Alert'import { auth } from '../features/auth'import { makeAutoObservable, observable, action } from 'mobx'class Result {  @observable msg = ''  @observable variant = 'success'  @observable visible = false  @action setMsg(value: string) {    this.msg = value  }  @action setVariant(value: string) {    this.variant = value  }  @action show() {    this.visible = true  }  @action hide() {    this.visible = false  }  constructor() {    makeAutoObservable(this)  }}const result = new Result()export const AddIdeaPage = observer(() => {  const [form, setForm] = useState({    ideaname: '',    short_desc: '',    describtion: '',    link: '',  })  const [msg, setMsg] = useState({    ideaname: [],    short_desc: [],    describtion: [],    tags: [],    link: [],  })  const [taglist, setTaglist] = useState({    tags: new Array<string>(0),    candidate: '',  })  const focusHandler = () => {    result.hide()  }  const changeHandler = (event: any) => {    setForm({      ...form,      [event.target.name]: event.target.value,    })    result.hide()  }  const changeTagsHandler = (event: any) => {    const chars = event.target.value    if (/^[A-Za-z0-9]/.test(chars)) {      setTaglist({ tags: taglist.tags, candidate: chars })    }    if (/ $/.test(chars)) {      setTaglist({        tags: taglist.tags.concat(taglist.candidate),        candidate: '',      })    }    result.hide()  }  const blurTagsHandler = () => {    setTaglist({      tags:        taglist.candidate === ''          ? taglist.tags          : taglist.tags.concat(taglist.candidate),      candidate: '',    })  }  const handleAdd = async () => {    auth.send      .post('/idea/create', { ...form, tags: taglist.tags })      .then((res: any) => {        setMsg({          ideaname: [],          short_desc: [],          describtion: [],          tags: [],          link: [],        })        setForm({ ideaname: '', link: '', describtion: '', short_desc: '' })        setTaglist({ tags: [], candidate: '' })        result.setMsg(res.data.message)        result.setVariant('success')        result.show()      })      .catch((err: any) => {        // console.log(err.response.data)        setMsg(          Object.keys(msg).reduce(            (acc: any, key: string) => {              acc[key] = err.response.data.message.filter((s: string) =>                s.includes(key),              )              return acc            },            {              ideaname: '',              short_desc: '',              describtion: '',              tags: '',              link: '',            },          ),        )        result.setMsg('Some errors')        result.setVariant('danger')        result.show()      })  }  const keyUpHandler = (event: any) => {    if (event.charCode === 13) {      setTaglist({        tags: taglist.tags.concat(taglist.candidate),        candidate: '',      })    }    if (event.charCode === 27) {      setTaglist({        tags: taglist.tags,        candidate: '',      })    }  }  return (    <Container>      <Row>        <Col>          <Form.Group controlId="ideaname">            <Form.Label>Idea name</Form.Label>            <Form.Control              name="ideaname"              type="text"              placeholder="Idea name"              value={form.ideaname}              onChange={changeHandler}              onFocus={focusHandler}            />          </Form.Group>        </Col>        {msg.ideaname.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in idea name</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row>        <Col>          <Form.Group controlId="short_desc">            <Form.Label>Short describtion</Form.Label>            <Form.Control              name="short_desc"              type="text"              placeholder="short description"              value={form.short_desc}              onChange={changeHandler}              onFocus={focusHandler}            />          </Form.Group>        </Col>        {msg.short_desc.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in short description</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row>        <Col>          <Form.Group controlId="describtion">            <Form.Label>Describtion</Form.Label>            <Form.Control              name="describtion"              type="text"              placeholder="Describtion"              value={form.describtion}              onChange={changeHandler}              onFocus={focusHandler}            />          </Form.Group>        </Col>        {msg.describtion.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in describtion</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row>        <Col>          <Form.Group controlId="tags_cont">            <Form.Label>Tags</Form.Label>            <Form.Control              type="text"              placeholder="Tags"              as="div"              className="p-0"            >              <Row className="m-0 h-100">                {taglist.tags.map((tag) => (                  <Col sm="auto">                    <Badge                      variant="secondary"                      className="w-auto h-75 mt-1 mb-1 align-middle pl-25 pr-25"                    >                      {tag}                    </Badge>                  </Col>                ))}                <Col className="p-0">                  <input                    id="tags"                    type="text"                    name="tags"                    value={taglist.candidate}                    onChange={changeTagsHandler}                    onFocus={focusHandler}                    onBlur={blurTagsHandler}                    onKeyPress={keyUpHandler}                    className="w-100 h-100 border-0"                  />                </Col>              </Row>            </Form.Control>          </Form.Group>        </Col>        {msg.tags.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in tags</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row>        <Col>          <Form.Group controlId="link">            <Form.Label>Link</Form.Label>            <Form.Control              name="link"              type="text"              placeholder="Link"              value={form.link}              onChange={changeHandler}              onFocus={focusHandler}            />          </Form.Group>        </Col>        {msg.link.map((err) => (          <Toast>            <Col>              <Toast.Header closeButton={false}>                <strong className="mr-auto">Error in link</strong>              </Toast.Header>              <Toast.Body>{err}</Toast.Body>            </Col>          </Toast>        ))}      </Row>      <Row className="justify-content-evenly">        <Col>          <Button id="register" variant="secondary" onClick={handleAdd}>            Create          </Button>        </Col>      </Row>      <Row>        <Col>          <Alert variant={result.variant} show={result.visible}>            {result.msg}          </Alert>        </Col>      </Row>    </Container>  )})