import React, { Component } from "react";
import AuthService from "../services/auth.service";
import TaskService from "../services/task.service";
import { Container, Row, Col, Button, Card, CardColumns } from 'react-bootstrap';
import { Route, Redirect } from "react-router-dom";

import AddTaskModal from "./addTaskModal.component";
import UpdateTaskModal from "./updateTaskModal.component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbtack, faTrash } from '@fortawesome/free-solid-svg-icons'

import ReactHtmlParser from 'react-html-parser';
import dompurify from 'dompurify';

export default class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      tasks: null,
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
      ).catch(err => {
          if (err.message.includes("401")) {
            AuthService.logout(); 
            window.location.reload();
          }
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
        updatedTask.description = dompurify.sanitize(newDescription);
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
                  onClick={() => { 
                    AuthService.logout(); 
                    window.location.reload(); 
                  }}
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
                <div className="jumbotron">
                  <h3>
                    Welcome back, <strong>{this.state.currentUser.email}</strong> /ᐠ｡ꞈ｡ᐟ\ <br/>
                  </h3>
                  <small>What tasks did you complete today? Got new ones? Click <AddTaskModal email={this.state.currentUser.email} onTaskAdd={this.addTask.bind(this)}/> to add more.</small>
                </div>
              </Row>
              
              <Row className="mt-3 mb-5 task-board">
                {this.state.tasks && this.state.tasks.length === 0 && <Row>
                  <div className="empty-task-board-text">
                    Currently there are no tasks to display 😭 <br/>
                    Add your first task to begin 🐶
                  </div>     
                </Row>}
                <CardColumns>
                  <Row>
                    {this.state.tasks && this.state.tasks.map( ( {id, description, createdAt} ) => {
                      return (
                        <Col key={id} md={4}>
                          <Card className="mt-4 task-card" bg="light" border="dark" style={{minHeight: "250px"}}>
                            <Card.Body className="task-card-body">
                              <Row>
                                <Col>
                                  <FontAwesomeIcon className="fa-thumbtack-task" icon={faThumbtack}/> &nbsp; 
                                  <em className="task-card-id text-center">Task #{id}</em>
                                </Col>
                                <Col className="text-right">
                                  <div>
                                    <span className="task-card-date"> { (new Date(createdAt)).toLocaleDateString() }</span>
                                  </div>
                                  <div>
                                    <span className="task-card-time"> { (new Date(createdAt)).toLocaleTimeString() }</span>
                                  </div>
                                </Col>
                              </Row>
                              <hr className="hr-1"/>
                              <em className="text-indieFlower" style={{whiteSpace: "pre-line"}}>{ReactHtmlParser(dompurify.sanitize(description))}</em>
                            </Card.Body>
                            <Card.Footer className="task-card-footer">
                              <UpdateTaskModal 
                                description={description}
                                id={id} 
                                onTaskUpdate={this.updateTask.bind(this)}
                              />
                              <Button
                                variant="danger delete-btn shadow-none"
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
