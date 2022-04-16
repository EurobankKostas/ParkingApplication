import {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import RegisterCss from "./registerPage.module.css";
import logo from "../images/logo.png";
import { encode as base64_encode} from 'base-64';

export default class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            dob: "",
            vehicleRegistrationNumber: "",
            show: false,
            result: "",
            isInvalidFname:"",
            invalidFeedBackFname:false,
            isInvalidLname:"",
            invalidFeedBackLname:false,
            isInvalidEmail:"",
            invalidFeedBackEmail:false
        }
        this.handleRequest = this.handleRequest.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.validationBeforeSubmit=this.validationBeforeSubmit.bind(this);
    }

    handleClose() {
        this.setState({show: false})
    }

     validationBeforeSubmit(){
        let result = true;
        if(!this.state.firstName || !this.state.lastName || !this.state.lastName || !this.state.password || !this.state.email || !this.state.dob){
            this.setState({show: true, result: "There are missing fields"});
            result= false;
        }
        const validation = /^[A-Za-z]+$/;
        if(!validation.test(this.state.firstName)){
            this.setState({isInvalidFname:"is-invalid" , invalidFeedBackFname:true})
            result= false;
        }

        if(!validation.test(this.state.lastName)){
            this.setState({isInvalidLname:"is-invalid" , invalidFeedBackLname:true})
            result= false;
        }

        if(!this.state.email.match("(^(.+)@(\\S+)$)")){
            this.setState({isInvalidEmail:"is-invalid" , invalidFeedBackEmail:true})
            result= false;
        }
        return result;
    }

    componentDidMount(){
        let resp = fetch("/parking/v1/validateSession").then(resp => {return resp.json()}).then(data => {
            if(data.messageValidate === "loggedIn"){
                window.location.replace('/mainPage');
            }
        }).catch(err=>console.log("Error occurred") + err);
    }

    handleRequest(e) {
        e.preventDefault();

        let validation = this.validationBeforeSubmit();
        if(!validation){
            return
        }
        const properties = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
            },
            body: JSON.stringify({
                lastName: this.state.lastName,
                dob: this.state.dob,
                vehicleRegistrationNumber: this.state.vehicleRegistrationNumber,
                firstName: this.state.firstName,
                email: this.state.email,
                password: base64_encode(this.state.password)
            })
        }
        let resp = fetch("/parking/v1/register/customer", properties).then(resp => {
            return resp.text();
        }).then(data => {
            window.location.replace('/mainPage');
            console.log(data)
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <>
                <div className="container pt-5 mt-5">
                    <div className="row align-items-center">
                        <div className="col-md-6 mx-auto">
                            <div className={`card ${RegisterCss.cardCustom}`}>
                                <div className={`card-header text-center ${RegisterCss.cardHeaderCustom}`}>
                                    <img src={logo} className="logo" alt="logo"/>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="row mt-2">
                                            <div className="col-md-6 col-sm-12 ">
                                                <input
                                                    type="text" className={`form-control ${this.state.isInvalidFname}`} placeholder="FirstName"
                                                    onChange={(event) => {
                                                        this.setState({isInvalidFname:"" , invalidFeedBackFname:true})
                                                        this.setState({firstName: event.target.value})}}
                                                    value={this.state.firstName}/>
                                                <div style={this.state.invalidFeedBackFname ? {} : {display:'none'}} className="invalid-feedback">
                                                    Please provide a valid first Name.
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-12 ">
                                                <input type="text" className={`form-control ${this.state.isInvalidLname}`} placeholder="LastName"
                                                       onChange={(event) =>{
                                                           this.setState({isInvalidLname:"" , invalidFeedBackLname:true})
                                                           this.setState({lastName: event.target.value})}}
                                                       value={this.state.lastName}/>
                                                <div style={this.state.invalidFeedBackLname ? {} : {display:'none'}} className="invalid-feedback">
                                                    Please provide a valid Last Name.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <input type="text" className={`form-control ${this.state.isInvalidEmail}`} placeholder="Email"
                                                   onChange={(event) => {
                                                       this.setState({isInvalidEmail:"" , invalidFeedBackEmail:true})
                                                       this.setState({email: event.target.value})}}
                                                   value={this.state.email}/>
                                            <div style={this.state.invalidFeedBackEmail ? {} : {display:'none'}} className="invalid-feedback">
                                                Please provide a valid Email.
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <input type="password" className="form-control"
                                                   onChange={(event) => this.setState({password: event.target.value})}
                                                   placeholder="Password" value={this.state.password}/>
                                        </div>
                                        <div className="mt-4">
                                            <input type="datetime-local" className="form-control"
                                                   onChange={(event) => this.setState({dob: event.target.value})}
                                                   placeholder="Date of Birth" value={this.state.dob}/>
                                        </div>
                                        <div className="mt-4">
                                            <input type="text" className="form-control"
                                                   onChange={(event) => this.setState({vehicleRegistrationNumber: event.target.value})}
                                                   placeholder="VehicleRegistrationNumber"
                                                   value={this.state.vehicleRegistrationNumber}/>
                                        </div>
                                        <div className="text-center mt-4 mb-">
                                            <button type="submit"
                                                    onClick={this.handleRequest} className={`btn btn-primary btn-lg uppercase ${RegisterCss.ctaPrimary}`}>REGISTER
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div
                                    className={`card-footer text-muted text-center mb-3 ${RegisterCss.cardFooterCustom}`}>
                                    <p>Already have an account? <a href="/">Log in here</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={this.state.show} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Result of Register</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.result}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

