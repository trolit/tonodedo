import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import AuthService from "./services/auth.service";

import Toast from 'react-bootstrap/Toast'

import Login from "./components/login.component";
import Task from "./components/task.component";
import RegisterModal from "./components/registerModal.component";

class App extends Component {

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    return (

      <div>
        {!this.state.currentUser && <Toast style={{width: '100%'}}>
            <Toast.Body>
              <FontAwesomeIcon icon={faQuestionCircle} /> Not an member yet? Sign up by clicking <RegisterModal/>
            </Toast.Body>
        </Toast>}

        <Container>
          <Row className="mt-5">
            <Col>
                <Switch>
                  <Route
                    exact
                    path={["/"]}
                    render={() => {
                        return (
                          <Redirect to="/login" />
                        )
                    }}
                  />
                  <Route
                    exact
                    path={["/login"]}
                    render={() => {
                        return (
                            this.state.currentUser ?
                            <Redirect to="/task" /> :
                            <Route exact path="/login" component={Login} /> 
                        )
                    }}
                  />
                  <Route exact path="/task" component={Task} />
                </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
