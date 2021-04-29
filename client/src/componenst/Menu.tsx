import React from 'react'
import { NavLink } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

export const Menu = (props: { username: string }) => {
  const username = props.username
  return (
    <Navbar bg="dark" variant="dark">
      <NavLink className="navbar-brand" to="/">
        Ideas journal
      </NavLink>
      <Nav className="mr-auto">
        <NavLink to="/register" className="nav-link">
          Register
        </NavLink>
      </Nav>
      <NavLink
        id="Hello"
        className="btn btn-secondary"
        to={username === '' ? '/register' : '/about'}
      >
        {'Hello, ' + (username === '' ? 'Guest' : username)}
      </NavLink>
    </Navbar>
  )
}
