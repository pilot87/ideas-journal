import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { AddUserPage } from './pages/addUserPage'
import { Menu } from './componenst/Menu'
import { LoginPage } from './pages/loginPage'
import { AboutPage } from './pages/aboutPage'
import { AddIdeaPage } from './pages/addIdeaPage'
import { IdeasPage } from './pages/ideasPage'
import { ideas } from './features/ideas'
import { ModalLogin } from './componenst/ModalLogin'
import { viewIdea } from './features/viewIdea'
import { ViewIdeaPage } from './pages/viewIdeaPage'
import { AddAnnouncementPage } from './pages/addAnnouncementPage'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const updCycle = async () => {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  while (true) {
    if (ideas.auto) {
      ideas.update()
    }
    if (viewIdea.auto) {
      viewIdea.update()
    }
    await sleep(10000)
  }
}

const App = () => {
  useEffect(() => {
    updCycle()
  }, [])

  return (
    <Router>
      <ModalLogin />
      <Container fluid className="min-vh-100">
        <Row>
          <Col className="p-0">
            <Menu />
          </Col>
        </Row>
        <Row>
          <Col className="p-0">
            <Switch>
              {/*change to something else*/}
              <Route exact path="/" component={LoginPage} />
              <Route exact path="/addidea" component={AddIdeaPage} />
              <Route
                path="/addannaoncement/:id"
                component={AddAnnouncementPage}
              />
              <Route exact path="/ideas" component={IdeasPage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/about" component={AboutPage} />
              <Route exact path="/register" component={AddUserPage} />
              <Route path="/ideafull/:id" component={ViewIdeaPage} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  )
}

export default App
