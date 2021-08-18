import React, {useContext, useEffect, useState} from "react";
import ilLogin from "../recursos/ilLogin.svg";
import logoLogin from "../recursos/logoLogin.png";
import {Link} from "react-router-dom";
import "./Registro.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Joi from "joi";
import {Modal, Button} from "react-bootstrap";
import {appContext} from "../context/AppContext";
import Parte1 from "../components/Registro/Parte1";
const passwordComplexity = require("joi-password-complexity").default;



function Registro(props){

    const schemaObjectTrabajador = {
        nombre: Joi.string().min(1).required(),
        correo: Joi.string().pattern(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)).required(),
        contrasena: passwordComplexity(),
        contrasenaRepeat: Joi.ref("contrasena"),
        telefono: Joi.string().required(),
        cedula:Joi.string().min(7).required(),
        fechaNacimiento: Joi.string().min(0).custom(older18).isoDate().required(),
        tipo: Joi.string().required()
    }

    const schemaObjectCliente = {
        nombre: Joi.string().min(1).required(),
        correo: Joi.string().pattern(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)).required(),
        contrasena: passwordComplexity(),
        contrasenaRepeat: Joi.ref("contrasena"),
        ciudad: Joi.string().min(1).required(),
        direccion: Joi.string().min(1).required(),
        telefono: Joi.string().required(),
        cedula:Joi.string().min(7).required(),
        fechaNacimiento: Joi.string().min(0).custom(older18).isoDate().required(),
        tipo: Joi.string().required(),
    }

    const defaultDate = new Date('1990-12-01T10:00:00Z')

    const defaultTipo = "cliente";

    const [showSuccess, setShowSuccess] = useState(false);

    const [showError, setShowError] = useState(false);

    const [validation, setValidation] = useState({});

    const [schemaForm, setSchemaForm] = useState(Joi.object(schemaObjectCliente));

    const context = useContext(appContext);

    function handleCloseError(){
        setShowError(false);
    }

    function handleCloseSuccess(){
        setShowSuccess(false);
        if(context.user.isTrabajador){
            props.history.push("/homeTrabajador");
        }else{
            props.history.push("/homeCliente");
        }
    }

    function older18(fechaNacimiento, helper){
        const dateValid = (new Date().getFullYear() - new Date(fechaNacimiento).getFullYear()) >= 18
        if(!dateValid){
            throw new Error('"fechaNacimiento" must have 18 years"');
        }
        return fechaNacimiento
    }

    const [form, setForm] = useState({nombre:"", correo:"", contrasena:"", contrasenaRepeat:"", telefono:"",
        cedula:"", tipo:defaultTipo, fechaNacimiento: defaultDate.toISOString()})

    function handleChange(event){
        const formCopy = {...form}
        let newSchema = schemaForm;
        if(event.target.name==="tipo" && event.target.value==="trabajador"){
            delete formCopy.direccion;
            delete formCopy.ciudad;
            newSchema = Joi.object(schemaObjectTrabajador)
            setSchemaForm(newSchema)
        }else if(event.target.name==="tipo" && event.target.value==="cliente"){
            newSchema = Joi.object(schemaObjectCliente)
            setSchemaForm(newSchema)
        }
        console.log("ttarget name", event.target.name);
        console.log("ttarget value", event.target.value);
        setValidation(newSchema.validate({...formCopy, [event.target.name]: event.target.value}, { abortEarly: false }))
        setForm({...formCopy, [event.target.name]: event.target.value});
    }

    function handleDateChange(date){
        setValidation(schemaForm.validate({...form, "fechaNacimiento": date.toISOString()}, { abortEarly: false }))
        setForm({...form, "fechaNacimiento": date.toISOString()});
    }

    function handleSubmit(event){
        event.preventDefault();
        if(!validation.error){
            const formCopy = {...form}
            delete formCopy.tipo
            if(form.tipo==="cliente"){
                fetch("/clientes", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formCopy)
                }).then(res => {
                    if (res.status !== 201) {
                        setShowError(true);
                    }else{
                        res.json().then(cliente => {
                            cliente.isTrabajador = false;
                            context.loginUser(cliente);
                        });
                        setShowSuccess(true);
                    }

                }).catch(err => {
                    setShowError(true);
                    console.log(err);
                });
            }else{
                fetch("/trabajadores", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formCopy)
                }).then(res => {
                    if (res.status !== 201) {
                        setShowError(true);
                    }else{
                        res.json().then(trabajador => {
                            trabajador.isTrabajador = true;
                            context.loginUser(trabajador);
                        });
                        setShowSuccess(true);
                    }
                }).catch(err => {
                    setShowError(true);
                    console.log(err);
                });
            }
        }else{
            setShowError(true)
        }
    }

    useEffect(() => {
    }, [form]);


    return (
        <div className="registro">
            <div className="register-der">
                <div className="slogan">
                    <h3>Encuentra <span>personal</span> capacitado en <span>servicios generales</span> de forma
                        rápida, fácil y segura</h3>
                </div>
                <img className="ilLogin" src={ilLogin} alt="Ilustration"/>
            </div>
            <div className="register-izq">
                <div className="register-izq-content">
                    <img className="logoRegistro" src={logoLogin} alt="Logo Handuty"/>
                    <form className="register-izq-inputs">
                        <p>Nombre completo</p>
                        <input type="text" onChange={handleChange} id="inputText1" name="nombre" className={`${validation.error && validation.error.message.includes('"nombre"')? "is-invalid" : "is-valid"}`}/>
                                    {validation.error && validation.error.message.includes('"nombre"') &&
                        <div className="invalid-feedback">
                            Nombre debe contener al menos un carácter
                        </div>}
                        <p>Correo electrónico</p>
                        <input type="text"  onChange={handleChange} id="inputText1" name="correo" className={`${validation.error && validation.error.message.includes('"correo"')? "is-invalid" : "is-valid"}`}/>
                                    {validation.error && validation.error.message.includes('"correo"') &&
                        <div className="invalid-feedback">
                            Debe ser un correo electrónico
                        </div>}
                        <div className="contrasena">
                            <div className="bloque">
                                <p>Contraseña</p>
                                <input type="password"  onChange={handleChange} id="inputText2" name="contrasena" className={`${validation.error && validation.error.message.includes('"contrasena"')? "is-invalid" : "is-valid"}`}/>
                                            {validation.error && validation.error.message.includes('"contrasena"') &&
                                <div className="invalid-feedback">
                                    Contraseña debe tener una mayúscula, una minúscula, un número y un carácter especial
                                </div>}
                            </div>
                            <div className="bloque">
                                <p>Repetir</p>
                                <input type="password"  onChange={handleChange} id="inputText3" name="contrasenaRepeat" className={`${validation.error && validation.error.message.includes('"contrasenaRepeat"')? "is-invalid" : "is-valid"}`}/>
                                            {validation.error && validation.error.message.includes('"contrasenaRepeat"') &&
                                <div className="invalid-feedback">
                                    Contraseña debe ser igual
                                </div>}
                            </div>
                        </div>
                        <p>Seleccione un tipo de usuario</p>
                        <select  onChange={handleChange} defaultValue={defaultTipo} id="inputState" className="form-control" name="tipo">
                            <option value="trabajador">Trabajador</option>
                            <option value="cliente">Cliente</option>
                        </select>
                        {form.tipo === "cliente" &&
                        <div className="contrasena">
                            <div className="bloque">
                                <p>Ciudad</p>
                                <input type="text"  onChange={handleChange} id="inputText2" name="ciudad" className={`${validation.error && validation.error.message.includes('"ciudad"')? "is-invalid" : "is-valid"}`}/>
                                {validation.error && validation.error.message.includes('"ciudad"') &&
                                <div className="invalid-feedback">
                                    Ciudad no puede estar vacía
                                </div>}
                            </div>
                            <div className="bloque">
                                <p>Dirección</p>
                                <input type="text"  onChange={handleChange} id="inputText3" name="direccion" className={`${validation.error && validation.error.message.includes('"direccion"')? "is-invalid" : "is-valid"}`}/>
                                {validation.error && validation.error.message.includes('"direccion"') &&
                                <div className="invalid-feedback">
                                    Dirección no puede estar vacía
                                </div>}
                            </div>
                        </div>
                        }
                        <div className="contrasena">
                            <div className="bloque">
                                <p>Teléfono</p>
                                <input type="number"  onChange={handleChange} id="inputText2" name="telefono" className={`${validation.error && validation.error.message.includes('"telefono"')? "is-invalid" : "is-valid"}`}/>
                                {validation.error && validation.error.message.includes('"telefono"') &&
                                <div className="invalid-feedback">
                                    Debe escribir un teléfono
                                </div>}
                            </div>
                            <div className="bloque">
                                <p>Cédula</p>
                                <input type="number"  onChange={handleChange} id="inputText2" name="cedula" className={`${validation.error && validation.error.message.includes('"cedula"')? "is-invalid" : "is-valid"}`}/>
                                {validation.error && validation.error.message.includes('"cedula"') &&
                                <div className="invalid-feedback">
                                    La cédula debe tener al menos 7 caracteres
                                </div>}
                            </div>
                        </div>
                        <p>Fecha de nacimiento</p>
                        <DatePicker selected={new Date(form.fechaNacimiento)} name="fechaNacimiento" onChange={date=>handleDateChange(date)} peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"/>
                        {validation.error && validation.error.message.includes('"fechaNacimiento"') &&
                        <div id="bad-date-feedback">
                            <p>Debes ser mayor de 18 años</p>
                        </div>}

                    </form>
                    <button className="botonRegister" onClick={handleSubmit}>
                        <span>Crear Cuenta</span>
                    </button>
                    <div className="preguntaRegistro">
                        <p>¿Ya estás registrado? <Link to="/"> <span>Iniciar Sesión</span></Link></p>
                    </div>
                </div>
            </div>
            <Modal id="modal_error" show={showError} onHide={handleCloseError} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>Ocurrió un error durante el envío</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseError}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal id="modal_success" show={showSuccess} onHide={handleCloseSuccess} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>¡Registro exitoso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>La cuenta fue creada de forma exitosa.</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseSuccess} id="register_success_btn">
                        Ingresar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default Registro;