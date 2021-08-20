import React, {useContext, useEffect, useState} from "react";
import {userContext} from "../context/User";
import {Link, Redirect} from "react-router-dom";
import flecha from "../recursos/arrowIcon.svg";
import "./CrearServicio.css";
import {FormattedMessage} from 'react-intl';
import Joi from "joi";
import {Button, Modal} from "react-bootstrap";
import Sidebar from "../components/Sidebar";


function CrearServicio(props){

    const validator = Joi.object({
        categoria: Joi.string().required(),
        precio: Joi.number().min(1000),
        trabajador: Joi.string().required(),
        descripcion: Joi.string().min(10).max(160).required()
    })

    function handleCloseError(){
        setShowError(false);
    }

    function handleCloseSuccess(){
        setShowSuccess(false);
        props.history.push("/perfilTrabajador");
    }

    const [showSuccess, setShowSuccess] = useState(false);

    const [showError, setShowError] = useState(false);

    const [validation, setValidation] = useState({})

    const context = useContext(userContext);

    const [state, setState] = useState({categorias: [], servicio: {categoria: "Carpintería",
            precio: "", descripcion: "", trabajador: JSON.parse(localStorage.getItem("usuario"))._id}})

    useEffect(()=>{
        const categoriesEsp = ["Carpintería",
        "Cerrajería",
        "Electricista",
        "Fumigación",
        "Jardinería",
        "Limpieza",
        "Mascotas",
        "Mantenimiento",
        "Pintura",
        "Plomería",
        "Seguridad",];

        const categoriesEng = ["Carpintry",
        "Locksmith",
        "Electrician",
        "Fumigation",
        "Gardening",
        "Cleaning",
        "Mascotas",
        "Pets",
        "Manteinance",
        "Plumbing",
        "Security",];

        var userLang = navigator.language || navigator.userLanguage; 
        const categorias = userLang.startsWith('en')?categoriesEng:categoriesEsp
        setState({...state, categorias: categorias, categoriasEsp: categoriesEsp});
    }, [state])

    function handleInputChange(event) {
        setState({...state, servicio: {...state.servicio, [event.target.name]: event.target.value}});
        setValidation(validator.validate({...state.servicio, [event.target.name]: event.target.value}, { abortEarly: false }))
    }

    function aceptar(event) {
        console.log(state.servicio)
        if(!validation.error){
            fetch('/servicios', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(state.servicio)
            }).then(res => {
                if(res.status===201){
                    setShowSuccess(true)
                }else{
                    setShowError(true)
                }
            }).catch(err => {
                console.log(err);
                setShowError(true)
            });
        }else{
            setShowError(true)
        }

    }

    useEffect(() => {
        console.log(validation)
    }, [validation]);


    if (!context.user._id) return <Redirect to='/'/>;

    return (
        <div className="App">
            <Sidebar/>
            <div className="formServicio">
                <div className="formServicio-title">
                    <Link to="/perfilTrabajador">
                        <img className="arrowImgForm" src={flecha} alt="Flecha"/>
                    </Link>
                    <div className="formServicio-title-txt">
                        <h1><FormattedMessage id="AddServ"/></h1>
                        <p><FormattedMessage id="AddNew"/></p>
                    </div>
                </div>
                <div className="formServicio-main">
                    <form className="formDetail">
                        <label htmlFor="categoria"><FormattedMessage id="selCateg"/></label>
                        <select name="categoria" id="categoria" onChange={handleInputChange} >
                            {state.categorias.map(categoria => {
                                const index = state.categorias.findIndex(item=>item===categoria)
                                return <option key={state.categoriasEsp[index]} value={state.categoriasEsp[index]}>{categoria}</option>
                            })}
                        </select>
                        <label htmlFor="precio"><FormattedMessage id="priceHour"/></label>
                        <input type="number" id="precio" name="precio" onChange={handleInputChange}
                               className={`${validation.error && validation.error.message.includes('"precio"')? "is-invalid" : "is-valid"}`}/>
                        {validation.error && validation.error.message.includes('"precio"') &&
                        <div className="invalid-feedback">
                            Debe ingresar precio y el minimo es de 1000 pesos
                        </div>}
                        <label htmlFor="descripcion"><FormattedMessage id="Description"/></label>
                        <textarea id="descripcion" onChange={handleInputChange} name="descripcion"
                                  className={`${validation.error && validation.error.message.includes('"descripcion"')? "is-invalid" : "is-valid"}`}/>
                        {validation.error && validation.error.message.includes('"descripcion"') &&
                        <div className="invalid-feedback">
                            Debe ingresar una descripción de minimo 10 caracteres y maximo 160 caracteres
                        </div>}
                        <div className="bloqueBotones">
                            <Link to="/perfilTrabajador">
                                <button type="button" className="cancelButton"><FormattedMessage id="Cancel"/></button>
                            </Link>
                            <button type="button" onClick={aceptar}><FormattedMessage id="Accept"/></button>
                        </div>

                    </form>
                </div>
            </div>

            <Modal id="modal_success" show={showSuccess} onHide={handleCloseSuccess} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>¡Servicio creado!</Modal.Title>
                </Modal.Header>
                <Modal.Body>El servicio fue creado de forma exitosa.</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseSuccess} id="register_success_btn">
                        Volver al perfil
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal id="modal_con_error" show={showError} onHide={handleCloseError} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>No fue posible registrar el servicio</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseError}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )



}

export default CrearServicio;