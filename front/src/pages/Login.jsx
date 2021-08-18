import React, {useContext, useState, useEffect} from "react";
import {appContext} from "../context/AppContext";
import logoLogin from "../recursos/logoLogin.png";
import {Link} from "react-router-dom";
import ilLogin from "../recursos/ilLogin.svg";
import "./Login.css";
import Joi from "joi";
import {Button, Modal} from "react-bootstrap";
import {FormattedMessage, useIntl} from "react-intl"


function Login(props){

    const intl = useIntl();

    const context = useContext(appContext);

    const [form, setForm] = useState({correo: "", contrasena: "", tipo: "cliente"});

    const [validation, setValidation] = useState({});

    const [showError, setShowError] = useState(false);

    const [conError, setConError] = useState(false);

    const validator = Joi.object({
        correo: Joi.string().min(1).pattern(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)).required(),
        contrasena: Joi.string().min(1).required(),
        tipo: Joi.string().required(),
    })

    function handleCloseError(){
        setShowError(false);
    }

    function handleCloseConError(){
        setConError(false);
    }

    function handleInputChange(event) {
        setForm({...form, [event.target.name]: event.target.value});
        setValidation(validator.validate({...form, [event.target.name]: event.target.value}, { abortEarly: false }))
    }

    function handleSubmit(event) {
        event.preventDefault();
        if(!navigator.onLine) {
            setConError(true);
            return
        }
        if(!validation.error){
            const formCopy = {...form}
            delete formCopy.tipo
            if(form.tipo==="cliente"){
                fetch("/clientes/login", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formCopy)
                }).then(res => {
                    if (res.status !== 202) {
                        setShowError(true)
                    }else{
                        res.json().then(cliente => {
                            cliente.isTrabajador = false;
                            context.loginUser(cliente);
                            props.history.push("/homeCliente");
                        }).catch(err=>{
                            console.log(err);
                            setShowError(true)
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    setShowError(true)
                });
            }else{
                fetch("/trabajadores/login", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formCopy)
                }).then(res => {
                    if (res.status !== 202) {
                        setShowError(true)
                    }else{
                        res.json().then(trabajador => {
                            trabajador.isTrabajador = true;
                            context.loginUser(trabajador);
                            props.history.push("/homeTrabajador");
                        }).catch(err=>{
                            console.log(err);
                            setShowError(true)
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    setShowError(true)
                });
            }
        }else{
            setShowError(true)
        }

    }

    useEffect(() => {
    }, [form]);



    return (
        <div className="login">
            <div className="login-izq">
                <div className="login-izq-content">
                    <h1>
                        <img className="logoLogin" src={logoLogin} alt="Logo Handuty"/>
                    </h1>
                    <form className="login-izq-inputs">
                        <label htmlFor="inputText1"><p><FormattedMessage id="Mail"/></p></label>
                        <input type="text" id="inputText1" name="correo" onChange={handleInputChange}
                               className={`${validation.error && validation.error.message.includes('"correo"')? "is-invalid" : "is-valid"}`}/>
                        {validation.error && validation.error.message.includes('"correo"') &&
                        <div className="invalid-feedback">
                            <FormattedMessage id="EnterMail"/>
                        </div>}
                        <label htmlFor="inputText2"><p><FormattedMessage id="Password"/></p></label>
                        <input type="password" id="inputText2" name="contrasena" onChange={handleInputChange}
                               className={`${validation.error && validation.error.message.includes('"contrasena"')? "is-invalid" : "is-valid"}`}/>
                        {validation.error && validation.error.message.includes('"contrasena"') &&
                        <div className="invalid-feedback">
                            <FormattedMessage id="EnterPass"/>
                        </div>}
                        <label htmlFor="inputState"><p><FormattedMessage id="SelectType"/></p></label>
                        <select defaultValue="cliente" id="inputState" className="form-control" name="tipo"
                                onChange={handleInputChange}>
                            <option value="trabajador">{intl.formatMessage({id:"Worker"})}</option>
                            <option value="cliente">{intl.formatMessage({id:"Client"})}</option>
                        </select>
                    </form>
                    <button className="botonLogin" onClick={handleSubmit}>
                        <span><FormattedMessage id="Login"/></span>
                    </button>
                    <div className="preguntaRegistro">
                        <p><FormattedMessage id="NotAccount"/> <Link to="/registro"> <span><FormattedMessage id="Register"/></span></Link></p>
                    </div>
                </div>
            </div>
            <div className="login-der">
                <div className="slogan">
                    <h2><FormattedMessage id="Find"/></h2>
                </div>
                <img className="ilLogin" src={ilLogin} alt="Ilustration"/>

            </div>

            <Modal id="modal_error" show={showError} onHide={handleCloseError} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body><FormattedMessage id="ErrorMailPass"/></Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseError}>
                        <FormattedMessage id="Close"/>
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal id="modal_con_error" show={conError} onHide={handleCloseConError} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body><FormattedMessage id="serverProblem"/></Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseConError}>
                        <FormattedMessage id="Close"/>
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )

}

export default Login;