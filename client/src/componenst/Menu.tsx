import React from 'react'
import { NavLink } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { auth } from '../features/auth'
import { observer } from 'mobx-react-lite'

export const Menu = observer(() => {
  const username = auth.username
  return (
    <Navbar bg="dark" variant="dark">
      <NavLink className="navbar-brand" to="/">
        Ideas journal
      </NavLink>
      <Nav className="mr-auto">
        <NavLink to="/addidea" className="nav-link">
          Create idea
        </NavLink>
        <NavLink to="/ideas" className="nav-link">
          Ideas
        </NavLink>
      </Nav>
      <NavLink
        id="hello"
        className="btn btn-secondary"
        to={username === '' ? '/register' : '/about'}
      >
        {'Hello, ' + (username === '' ? 'Guest' : username)}
      </NavLink>
    </Navbar>
  )
})
