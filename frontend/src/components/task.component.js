import React, { Component } from "react";
import AuthService from "../services/auth.service";
import TaskService from "../services/task.service";
import { Container, Row, Col, Button, Card, CardColumns, Modal } from 'react-bootstrap';
import { Route, Redirect } from "react-router-dom";

import Textarea from "react-validation/build/textarea";
import Form from "react-validation/build/form";

import AddTaskModal from "./addTaskModal.component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faEdit, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);

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

  updateTask() {
    TaskService.update(this.state.taskId, this.state.newDescription, this.state.currentUser.email)
    .then(
      () => {
        let updatedTask = this.state.tasks.find(item => item.id === this.state.taskId);
        updatedTask.description = this.state.newDescription;
        this.closeModal();
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

  openModal = (text, id) => {
    this.setState({ 
      isOpen: true,
      currentTaskDescription: text,
      newDescription: text,
      taskId: id
    });
  }

  closeModal = () => {
    this.setState({ 
        isOpen: false
    });
  }

  onChangeDescription(e) {
    this.setState({
      newDescription: e.target.value
    });
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

          <Modal
            show={this.state.isOpen} 
            onHide={this.closeModal} 
            size="lg"
            centered
          >
            <Modal.Body>
              <Form>    
                <Container>
                  <Row>
                      <div className="form-group">
                        <FontAwesomeIcon icon={faPen}/> &nbsp;
                        <strong>Update task description</strong>
                        <Textarea
                            type="text"
                            className="mt-3 form-control shadow-none"
                            name="email"
                            value={this.state.currentTaskDescription}
                            onChange={this.onChangeDescription}
                            rows="5"
                        />
                      </div>
                  </Row>
                  <Row md={4} className="justify-content-center mt-4">
                    <Button 
                      className="w-50 custom-btn" 
                      variant="secondary" 
                      onClick={() => this.updateTask(this.state.newDescription)}
                    >
                      Update
                    </Button>
                    &nbsp;
                    <Button 
                      className="w-150px"
                      variant="warning" 
                      onClick={this.closeModal}
                    >
                      Cancel update
                    </Button>
                  </Row>
                </Container>      
              </Form>
            </Modal.Body>
          </Modal>

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
                  Welcome back, <strong>{this.state.currentUser.email}</strong>! <br/>
                </h3>
                <small>What tasks did you complete today? Got new ones? Click <AddTaskModal email={this.state.currentUser.email} onTaskAdd={this.addTask.bind(this)}/> to add more.</small>
              </header>
            </Row>
            <Row className="mt-3 mb-5">
              <CardColumns>
                <Row>
                  {this.state.tasks && this.state.tasks.map( ( {id, description, createdAt, updatedAt} ) => {
                    return (
                      <Col key={id} md={4}>
                        <Card className="mt-4" bg="light" border="dark" style={{minHeight: "250px"}}>
                          <Card.Body>
                            <FontAwesomeIcon icon={faClock}/> &nbsp; 
                            <span> utworzono { (new Date(createdAt)).toLocaleDateString() }</span>
                            <hr/>
                            <strong>Opis:</strong> <br/>
                            &nbsp; <em>{description}</em>
                          </Card.Body>
                          <Card.Footer>
                            <Button
                              variant="secondary"
                              onClick={() => this.openModal(description, id)}
                            >
                              <FontAwesomeIcon icon={faEdit}/>
                            </Button>
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
        </Container>}
        
      </div>
    );
  }
}
