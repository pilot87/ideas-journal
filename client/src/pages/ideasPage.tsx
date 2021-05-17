import React, { useEffect } from 'react'import { observer } from 'mobx-react-lite'import { NavLink } from 'react-router-dom'import Badge from 'react-bootstrap/Badge'import Container from 'react-bootstrap/Container'import Row from 'react-bootstrap/Row'import Col from 'react-bootstrap/Col'import { ideas } from '../features/ideas'export const IdeasPage = observer(() => {  useEffect(() => {    ideas.update()    ideas.setAuto(true)    return () => {      ideas.setAuto(false)    }  }, [])  return (    <Container fluid>      {ideas.ideas.map((idea) => (        <Row>          <Col className="p-3">            <NavLink              className="card bg-light border-dark"              to={'/ideafull/' + idea.id.toString()}            >              <h1>{idea.ideaname}</h1>              <p>{idea.short_desc}</p>              <Row className="m-0 h-100">                {idea.tags.map((tag) => (                  <Col sm="auto">                    <Badge                      variant="secondary"                      className="w-auto h-75 mt-1 mb-1 align-middle pl-25 pr-25"                    >                      {tag}                    </Badge>                  </Col>                ))}              </Row>            </NavLink>          </Col>        </Row>      ))}    </Container>  )})