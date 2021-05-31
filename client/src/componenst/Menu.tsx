import React from 'react'
import { observer } from 'mobx-react-lite'
import { NavLink } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'

import { auth } from '../features/auth'

export const Menu = observer(() => {
  const username = auth.username
  return (
    <>
      <Dropdown className="d-flex d-sm-none m-3 float-right">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          Ideas journal
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <NavLink className="dropdown-item" to="/addidea">
            Create idea
          </NavLink>
          <NavLink className="dropdown-item" to="/ideas">
            Ideas
          </NavLink>
          <NavLink
            className="dropdown-item"
            to={username === '' ? '/register' : '/about'}
          >
            {'Hello, ' + (username === '' ? 'Guest' : username)}
          </NavLink>
        </Dropdown.Menu>
      </Dropdown>
      <Navbar bg="dark" variant="dark" className="d-none d-sm-flex">
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
    </>
  )
})
