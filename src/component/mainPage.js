import MainCss from '../component/mainPage.module.css';
import logo from '../images/logo.png';
import {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import BookingSection from "./BookingSection";

function MainPage() {
    const [info, setInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        registrationNumber: "",
        customerId: "",
    });
    const [show, setShow] = useState(false);
    const [result, setResult] = useState("");
    const [attr, setAttr] = useState({
        disabledMotorBike: "",
        disabledDis: "",
        disabledParent: "",
        motorBike: false,
        disabled: false,
        parent: false
    });
    const [booking, setBooking] = useState({
        bookingDisplay : false,
        bookingDate:"",
        slotId :""
    });

    useEffect(() => {
        let submitEmail = "";
        let validate = fetch("/parking/v1/validateSession").then(resp => {
            return resp.json()
        }).then(data => {
            if (data.messageValidate == null) {
                window.location.replace('/');
                return;
            }
            const properties = {
                headers: new Headers({'content-type': 'application/json'}),
                method: "POST",
                body: JSON.stringify({
                    email: data.email
                })
            }
            let info = fetch("/parking/v1/information", properties).then(resp => {
                return resp.json()
            }).then(data => {
                console.log(data);
                submitEmail = data.email;
                setInfo({
                    firstName: data.fname,
                    lastName: data.lname,
                    email: data.email,
                    registrationNumber: data.registrationNumber,
                    customerId: data.customerId
                });
                const propertiesBooking = {
                    headers: new Headers({'content-type': 'application/json'}),
                    method: "GET",
                }
                let booking = fetch("/parking/v1/checkBooking/"+data.email, propertiesBooking).then(resp => {
                    return resp.json()
                }).then(data => {
                    console.log(data);
                    if(data.message === "emptyBooking"){
                        return;
                    }

                    setBooking({
                        bookingDisplay: true,
                        bookingDate: data.bookingDate,
                        slotId: data.slotId
                    });
                }).catch(err => console.log("Error occurred") + err);
            }).catch(err => console.log("Error occurred") + err);
        }).catch(err => console.log("Error occurred") + err);

    }, []);
    function changeDisabled() {
        if (attr.disabled === true) {
            setAttr({
                disabledMotorBike: "",
                disabledDis: "",
                disabledParent: "",
                motorBike: false,
                disabled: false,
                parent: false
            })
        } else {
            setAttr({
                disabledMotorBike: "disabled",
                disabledDis: "",
                disabledParent: "disabled",
                motorBike: false,
                disabled: true,
                parent: false
            })
        }
    }
    function logOut(){
        const logOutProperties = {
            headers: new Headers({'content-type': 'application/json'}),
            method: "POST",
        }
        let booking = fetch("/parking/v1/invalidateSession/", logOutProperties).then(resp => {
        }).then(() => {
            window.location.replace('/');
        }).catch(err => console.log("Error occurred") + err);
    }
    function changeParent() {
        if (attr.parent === true) {
            setAttr({
                disabledMotorBike: "",
                disabledDis: "",
                disabledParent: "",
                motorBike: false,
                disabled: false,
                parent: false
            })
        } else {
            setAttr({
                disabledMotorBike: "disabled",
                disabledDis: "disabled",
                disabledParent: "",
                motorBike: false,
                disabled: false,
                parent: true
            })
        }
    }

    function changeMotorBike() {
        if (attr.motorBike === true) {
            setAttr({
                disabledMotorBike: "",
                disabledDis: "",
                disabledParent: "",
                motorBike: false,
                disabled: false,
                parent: false
            })
        } else {
            setAttr({
                disabledMotorBike: "",
                disabledDis: "disabled",
                disabledParent: "disabled",
                motorBike: true,
                disabled: false,
                parent: false
            })
        }
    }

    function submitBooking() {
        const properties = {
            headers: new Headers({'content-type': 'application/json'}),
            method: "POST",
            body: JSON.stringify({
                customerId: info.customerId,
                motorbike: attr.motorBike,
                parent: attr.parent,
                disable: attr.disabled
            })
        };
        let booking = fetch("/parking/v1/booking", properties).then(resp => {
            return resp.text()
        }).then(data => {
            setShow(true);
            setResult(data);
            console.log(data)
        }).catch(err => console.log(err));
    }
    function handleClose(){
        setShow(false);
    }
        return (
            <>
                <div className="container pt-5 mt-5">
                    <div className="row align-items-center">
                        <div className="col-md-6 mx-auto">
                            <div className={`card ${MainCss.cardCustom}`}>
                                <div className={`card-header text-center ${MainCss.cardHeaderCustom}`}>
                                    <img src={logo} className="logo" alt="logo"/>
                                </div>
                                <div className="card-body text-center">
                                    <div className="row">
                                        <div className="col-md-12 mb-5">
                                            <h4>{info.firstName} {info.lastName}</h4>
                                            <h4>{info.email}</h4>
                                        </div>
                                        <div className="col-md-12 mb-5">
                                            <h6>VEHICLE REGISTRATION NUMBER</h6>
                                            <h1>{info.registrationNumber}</h1>
                                        </div>
                                        <div style={booking.bookingDisplay ? {display:'none'} : {}}  className="col-md-12 mb-5">
                                            <h6 className="mb-3">BOOKING OPTIONS</h6>
                                            <form>
                                                <div className="row">
                                                    <div className="col-md-4 col-lg-4 col-sm-12">
                                                        <div className="form-check form-check-inline">
                                                            <input disabled={attr.disabledMotorBike}
                                                                   onChange={changeMotorBike}
                                                                   className="form-check-input"
                                                                   type="checkbox" value=""
                                                                   id="motorBike"/>
                                                            <label className="form-check-label">
                                                                Motorbike
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-lg-4 col-sm-12">
                                                        <div className="form-check form-check-inline">
                                                            <input disabled={attr.disabledDis} onChange={changeDisabled}
                                                                   className="form-check-input" type="checkbox" value=""
                                                                   id="disabled"/>
                                                            <label className="form-check-label">
                                                                Disabled
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-lg-4 col-sm-12">
                                                        <div className="form-check form-check-inline">
                                                            <input disabled={attr.disabledParent}
                                                                   onChange={changeParent}
                                                                   className="form-check-input" type="checkbox" value=""
                                                                   id="parent"/>
                                                            <label className="form-check-label">
                                                                Parent
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div style={booking.bookingDisplay ? {} : {display:'none'}}  className="align-content-center col-md-12 col-lg-12 col-sm-12">
                                            <h6 className="mb-3">You have already booked a slot on {booking.bookingDate} , slotId : {booking.slotId}</h6>
                                            <div className="text-center mt-4 mb-">
                                                <button type="submit" onClick={logOut}
                                                        className={`btn btn-primary btn-lg uppercase ${MainCss.ctaPrimary}`}> LOG OUT
                                                </button>
                                            </div>
                                        </div>

                                        <div style={booking.bookingDisplay ? {display:'none'} : {}} className="col-md-6">
                                            <div className="text-center mt-4 mb-">
                                                <button type="submit" onClick={submitBooking}
                                                        className={`btn btn-primary btn-lg uppercase ${MainCss.ctaPrimary}`}> Book
                                                    Now
                                                </button>
                                            </div>
                                        </div>
                                        <div style={booking.bookingDisplay ? {display:'none'} : {}} className="col-md-6">
                                            <div className="text-center mt-4 mb-">
                                                <button type="submit" onClick={logOut}
                                                        className={`btn btn-primary btn-lg uppercase ${MainCss.ctaPrimary}`}> Log Out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Result of Booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{result}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );

}

export default MainPage;