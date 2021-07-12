import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

import { isEmail } from "validator";

import { Container, Row, Col, Alert, Button } from 'react-bootstrap';

function instantiateEmptyFieldAlert(inputName) {
    return (
        <Alert variant="danger">
            {inputName} field is empty!
        </Alert>
    );
}

const isRequired = inputName =>
  value => value ? undefined : instantiateEmptyFieldAlert(inputName);

const email = value => {
    if (!isEmail(value)) {
      return (
        <div className="alert alert-danger" role="alert">
          This is not a valid email.
        </div>
      );
    }
};

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            email: "",
            password: "",
            loading: false,
            message: ""
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

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.email, this.state.password).then(() => {
                this.props.history.push("/task");
                window.location.reload();
            },
            error => {
                const resMessage =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <Container>
                <Row className="d-flex justify-content-center">
                    <Col md="6">
                        <img
                            src="https://cdn.pixabay.com/photo/2020/01/21/18/39/todo-4783676_1280.png"
                            className="img-fluid"
                        />
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Col md="4">
                        <div> 
                            <Form
                                onSubmit={this.handleLogin}
                                ref={c => { this.form = c; }}
                            >

                                <div className="form-group">
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        placeholder="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validations={[isRequired("Email"), email]}
                                    />

                                    <Input
                                        type="password"
                                        className="form-control mt-4"
                                        name="password"
                                        placeholder="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[isRequired("Password")]}
                                    />
                                </div>

                                <div className="form-group text-center mt-4">
                                    <Button
                                        className="w-100"
                                        variant="secondary"
                                        type="submit"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Sign me in</span>                                  
                                    </Button>
                                </div>

                                {this.state.message && (
                                    <div className="form-group mt-3">
                                        <Alert variant="danger">
                                            {this.state.message}
                                        </Alert>
                                    </div>
                                )}

                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
                            </Form>
                        </div>
                    </Col>
                </Row> 
            </Container>
        );
    }
}