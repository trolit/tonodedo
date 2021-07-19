import React, { Component } from "react";

import Textarea from "react-validation/build/textarea";
import Form from "react-validation/build/form";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPen } from '@fortawesome/free-solid-svg-icons'

import AuthService from "../services/auth.service";
import { Container, Row, Button, Modal } from 'react-bootstrap';


export default class UpdateTaskModal extends Component {
    constructor(props) {
      super(props);
      this.onChangeDescription = this.onChangeDescription.bind(this);
  
      this.state = {
        currentUser: AuthService.getCurrentUser(),
        isOpen: false,
      };
    }

    openModal = () => {
        this.setState({ 
            isOpen: true,
            currentTaskDescription: this.props.description,
            newDescription: this.props.description,
            taskId: this.props.id
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

            <span>
                <Button
                    variant="secondary"
                    onClick={() => this.openModal()}
                >
                    <FontAwesomeIcon icon={faEdit}/>
                </Button>

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
                                onClick={() => { 
                                    this.props.onTaskUpdate(this.state.taskId, this.state.newDescription, this.state.currentUser.email); 
                                    this.closeModal();
                                }}
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
            </span>
        )
    }
}