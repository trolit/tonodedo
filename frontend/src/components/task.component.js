import React, { Component } from "react";
import AuthService from "../services/auth.service";
import TaskService from "../services/task.service";
import { Container, Row, Col, Button, Card, CardColumns } from 'react-bootstrap';
import { Route, Redirect } from "react-router-dom";

import AddTaskModal from "./addTaskModal.component";
import UpdateTaskModal from "./updateTaskModal.component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faTrash } from '@fortawesome/free-solid-svg-icons'

import ReactHtmlParser from 'react-html-parser';

export default class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      tasks: null,
      isOpen: false,
    };

    if (this.state.currentUser !== null) {
      TaskService.getAllByEmail(
        this.state.currentUser.email
      ).then(
        response => {
          this.setState({
            tasks: response.data,
          });
        }
      );
    }
  }

  removeTask(id) {
    TaskService.delete(this.state.currentUser.email, id)
    .then(
      () => {
        let filteredArray = this.state.tasks.filter(item => item.id !== id)
        this.setState({tasks: filteredArray});
      }
    ).catch(err => {
      console.log(err);
    });
  }

  updateTask(taskId, newDescription, email) {
    TaskService.update(taskId, newDescription, email)
    .then(
      () => {
        let updatedTask = this.state.tasks.find(item => item.id === taskId);
        updatedTask.description = newDescription;
        this.setState({tasks: this.state.tasks});
      }
    ).catch(err => {
      console.log(err);
    })
  }
  
  addTask(email, description) {
    TaskService.create(email, description)
    .then(response => {
        this.setState({ tasks: [response.data.task].concat(this.state.tasks)})
      }
    )
  }

  render() {
    return (
      <div>
          <Route
            exact
            path={["/task"]}
            render={() => {
                return (
                    this.state.currentUser ?
                    <Redirect to="/task" /> :
                    <Redirect to="/login" /> 
                )
            }}
          />

          {this.state.currentUser && 
            <Container>
              <Row style={{float: 'right'}}>
                <Button
                  className="logout-btn"
                  variant="secondary"
                  onClick={() => { AuthService.logout(); window.location.reload(); }}
                >
                  Log me out
                </Button>
              </Row>
              <Row>
                <img
                    src="https://cdn.pixabay.com/photo/2020/01/21/18/39/todo-4783676_1280.png"
                    className="img-fluid logo-image"
                    alt="Application logo"
                />
                <header className="jumbotron">
                  <h3>
                    Welcome back, <strong>{this.state.currentUser.email}</strong> /ᐠ｡ꞈ｡ᐟ\ <br/>
                  </h3>
                  <small>What tasks did you complete today? Got new ones? Click <AddTaskModal email={this.state.currentUser.email} onTaskAdd={this.addTask.bind(this)}/> to add more.</small>
                </header>
              </Row>
              <Row className="mt-3 mb-5">
                <CardColumns>
                  <Row>
                    {this.state.tasks && this.state.tasks.map( ( {id, description, createdAt} ) => {
                      return (
                        <Col key={id} md={4}>
                          <Card className="mt-4" bg="light" border="dark" style={{minHeight: "250px"}}>
                            <Card.Body>
                              <FontAwesomeIcon icon={faClock}/> &nbsp; 
                              <span> created at { (new Date(createdAt)).toLocaleDateString() }</span>
                              <hr/>
                              <strong className="text-Cabin">Description</strong> <br/>
                              <em className="text-indieFlower" style={{whiteSpace: "pre-line"}}>{ReactHtmlParser(description)}</em>
                            </Card.Body>
                            <Card.Footer>
                              <UpdateTaskModal 
                                description={description}
                                id={id} 
                                onTaskUpdate={this.updateTask.bind(this)}
                              />
                              <Button
                                variant="danger"
                                style={{float: "right"}}
                                onClick={() => this.removeTask(id)}
                              >
                                <FontAwesomeIcon icon={faTrash}/>
                              </Button>
                            </Card.Footer>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                </CardColumns>
              </Row>
            </Container>
          }
        
      </div>
    );
  }
}
