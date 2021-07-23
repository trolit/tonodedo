import React, { Component } from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faSmile } from '@fortawesome/free-solid-svg-icons'

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../services/auth.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};
  
const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const minLength = value => {
    if (value.length <= 3) {
        return (
            <div className="alert alert-danger" role="alert">
                Password must contain at least 4 characters.
            </div>
        );
    }
}
  
export default class RegisterModal extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            email: "",
            password: "",
            successful: false,
            message: "",
            loading: false,
            isOpen: false
        };
    }

    onChangeEmail(e) {
        this.setState({
          email: e.target.value
        });
    }
    
      onChangePassword(e) {
        this.setState({
          password: e.target.value
        });
      }
    
      handleRegister(e) {
        e.preventDefault();
    
        this.setState({
          message: "",
          successful: false,
          loading: true
        });
    
        this.form.validateAll();
    
        if (this.checkBtn.context._errors.length === 0) {
          AuthService.register(
            this.state.email,
            this.state.password
          ).then(
            response => {
              this.setState({
                message: response.data.message,
                successful: true,
                loading: false,
              });
            },
            error => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
    
              this.setState({
                successful: false,
                message: resMessage,
                loading: false
              });
            }
          );
        } else {
            this.setState({
                loading: false
            });
        }
      }

    openModal = () => this.setState({ isOpen: true });

    closeAndResetModal = () => {
        this.setState({ 
            isOpen: false,
            successful: false,
            loading: false,
            message: "",
            email: "",
            password: ""
        });
    }
    
    render() {
  
        return (
        
        <span>
            <Button 
                className="custom-btn shadow-none" 
                variant="info" 
                size="sm" 
                onClick={this.openModal}
            >
                here
            </Button>

            <Modal 
                show={this.state.isOpen} 
                onHide={this.closeAndResetModal} 
                backdrop="static"
                keyboard={false}
                centered
            >
    
            <Modal.Header className="modal-header">
                <div className="w-100">
                    <div className="text-center">
                        Registration form
                    </div> 
                </div>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Row className="mt-5">
                        <Col xs={12} md={12} className="text-center">
                            {!this.state.successful ? 
                                <div className="color-primary mb-5">
                                    <FontAwesomeIcon 
                                        className="color-primary rotate-45" 
                                        icon={faKey} 
                                        size="6x"
                                    /> 
                                    <FontAwesomeIcon 
                                        className="color-primary rotate-45 ml-10" 
                                        icon={faKey} 
                                        size="6x"
                                    /> 
                                    <br/>
                                    <span>|</span> 
                                    <br/>
                                    <span> \____________/</span>
                                </div> 
                                : null}               
                        </Col>      
                    </Row>
                    <Row>
                        <Col md={12}>             
                            <Form
                                onSubmit={this.handleRegister}
                                ref={c => { this.form = c; }}
                            >
                                {!this.state.successful && (
                                <div>

                                    <div className="form-group">
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="email"
                                            placeholder="Email"
                                            maxLength="60"
                                            value={this.state.email}
                                            onChange={this.onChangeEmail}
                                            validations={[required, email]}
                                        />

                                        <Input
                                            type="password"
                                            className="form-control mt-4"
                                            name="password"
                                            placeholder="Password"
                                            maxLength="40"
                                            value={this.state.password}
                                            onChange={this.onChangePassword}
                                            validations={[required, minLength]}
                                        />
                                    </div>

                                    <div className="form-group mt-5">
                                        <Button 
                                            className="w-50 custom-btn" 
                                            variant="primary" 
                                            type="submit" 
                                            disabled={this.state.loading}
                                        >
                                            {this.state.loading ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : "Sign up"}
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            style={{float: 'right'}} 
                                            onClick={this.closeAndResetModal}
                                            disabled={this.state.loading}
                                        >
                                            Close window
                                        </Button>
                                    </div>
                                </div>
                                )}

                                {this.state.message && (
                                <div className="form-group">
                                    <div
                                        className={
                                            this.state.successful
                                            ? "alert alert-success text-center"
                                            : "alert alert-danger"
                                        }
                                        role="alert"
                                        >
                                            <FontAwesomeIcon icon={faSmile} size="6x"/> <br/>
                                            <h3>Yay!</h3> <br/>
                                            {this.state.message} <br/>
                                            You may now log in onto your account.
                                            <div className="mt-5">
                                                <Button 
                                                    className="w-100"
                                                    variant="success"
                                                    onClick={this.closeAndResetModal}
                                                >
                                                    Close window
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
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
