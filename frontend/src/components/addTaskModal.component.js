import React, { Component } from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import TaskService from "../services/task.service";

import Form from "react-validation/build/form";
import Textarea from "react-validation/build/textarea";

export default class AddTaskModal extends Component {
    constructor(props) {
        super(props);
        this.onChangeDescription = this.onChangeDescription.bind(this);

        this.state = {
            description: "",
            email: this.props.email,
            isOpen: false,
            loading: false
        };
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    openModal = () => this.setState({ isOpen: true });

    closeAndResetModal = () => {
        this.setState({ 
            isOpen: false,
            description: "",
            loading: false
        });
    }
  
    render() {
  
        return (
        
        <span>
            <Button variant="success" size="sm" onClick={this.openModal}>here</Button>

            <Modal 
                show={this.state.isOpen} 
                onHide={this.closeAndResetModal} 
                backdrop="static"
                keyboard={false}
                centered
            >
    
            <Modal.Body>
                <Container>
                    <Row className="mt-5">
                        <Col xs={12} md={12} className="text-center">
                            {!this.state.successful ? <FontAwesomeIcon icon={faPlus} size="6x"/> : null}               
                        </Col>      
                    </Row>
                    <Row className="mt-5 mb-5">
                        <Col md={12}>            
                            <Form>
                                <div>
                                    <div className="form-group">
                                        <Textarea
                                            type="text"
                                            className="form-control mt-4"
                                            name="description"
                                            placeholder="task description goes here..."
                                            rows="5"
                                            value={this.state.description}
                                            onChange={this.onChangeDescription}
                                        />
                                    </div>

                                    <div className="form-group mt-5">
                                        <Button 
                                            className="w-50" 
                                            variant="success" 
                                            disabled={this.state.loading}
                                            onClick={() => {
                                                this.setState({ loading: true });
                                                this.props.onTaskAdd(this.state.email, this.state.description); 
                                                this.closeAndResetModal(); 
                                            }}
                                        >
                                            {this.state.loading ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : "Add"}
                                        </Button>

                                        <Button 
                                            variant="secondary" 
                                            style={{float: 'right'}} 
                                            disabled={this.state.loading}
                                            onClick={this.closeAndResetModal}
                                        >
                                            Close window
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
    
          </Modal>

        </span>
    
        );
    
    }

}