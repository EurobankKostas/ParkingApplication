import {useState , useEffect} from "react";
import {Modal, Button} from 'react-bootstrap';
import LoginCss from './loginPage.module.css';
import logo from '../images/logo.png';
import { encode as base64_encode} from 'base-64';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [result, setResult] = useState("");
    const [validEmail , setValidEmail] = useState({
        isInvalidEmail:"",
        invalidFeedBackEmail:false
    });

    useEffect(() => {
        let resp = fetch("/parking/v1/validateSession").then(resp => {return resp.json()}).then(data => {
            if(data.messageValidate === "loggedIn"){
                window.location.replace('/mainPage');
            }
        }).catch(err=>console.log("Error occurred") + err);
    });

    function handleRequest(e) {
        e.preventDefault();
        const properties = {
            method: "POST",
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({email: email, password: base64_encode(password)}),
        }

        if(!email.match("(^(.+)@(\\S+)$)")){
            setValidEmail({isInvalidEmail:"is-invalid" , invalidFeedBackEmail:true});
            return;
        }

        let response = fetch("/parking/v1/login/customer", properties).then(resp => {
            return resp.text();
        }).then(data => {
                console.log(data)
                setResult(data);
                handleShow();
            }
        ).catch(err => console.log("Error occurred " + err));

    }

    function handleChangeEmail(event) {
        setValidEmail({
            isInvalidEmail:"",
            invalidFeedBackEmail:false
        })
        setEmail(event.target.value);
    }

    function handleChangePassword(event) {
        setPassword(event.target.value);
    }
    return (
        <>
            <div className="container pt-5 mt-5">
                <div className="row align-items-center">
                    <div className="col-md-6 mx-auto">
                        <div className={`card ${LoginCss.cardCustom}`}>

                            <div  className={`card-header text-center ${LoginCss.cardHeaderCustom}`}>
                                <img src={logo} className="logo" alt="logo" />
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="mt-2">
                                        <input type="email" className={`form-control ${validEmail.isInvalidEmail}`} placeholder="Enter email" onChange={handleChangeEmail} value={email}/>
                                        <div style={validEmail.invalidFeedBackEmail ? {} : {display:'none'}} className="invalid-feedback">
                                            Please provide a valid Email.
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <input type="password" className="form-control" onChange={handleChangePassword} placeholder="Enter password" value={password}/>
                                    </div>
                                    <div className="text-center mt-4 mb-">
                                        <button type="submit" onClick={handleRequest} className={`btn btn-primary btn-lg uppercase ${LoginCss.ctaPrimary}`}>SUBMIT</button>
                                    </div>
                                </form>
                            </div>
                            <div className={`card-footer text-muted text-center mb-3 ${LoginCss.cardFooterCustom}`}>
                                <p>Don't have an account? <a href="/register">Register here</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Result of Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>{result}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}