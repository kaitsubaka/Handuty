import React, {useState, useContext, useEffect} from "react";
import Sidebar from "../components/Sidebar";
import {Link, Redirect} from "react-router-dom";
import flecha from "../recursos/arrowIcon.svg";
import "./CrearServicio.css";
import { appContext } from "../context/AppContext";
import triangle from "../recursos/triangle.svg";
import DatePicker, {registerLocale }from "react-datepicker";
import * as Joi from "joi";
import {Button, Modal} from "react-bootstrap";
import {FormattedMessage, useIntl, FormattedDate} from 'react-intl'
import es from "date-fns/locale/es";
import en from "date-fns/locale/es";


function CrearReserva(props){
    registerLocale("es", es);
    registerLocale("en", en);
    const intl = useIntl();
    const context = useContext(appContext)

    const schemaObjectCliente = {
        fechaInicio: Joi.string().min(0).custom(validDate).isoDate().required(),
        duracion: Joi.number().min(30).max(120).required()
    }

    const schema = Joi.object(schemaObjectCliente)

    const defaultDate = new Date();
    defaultDate.setMilliseconds(0);
    defaultDate.setSeconds(0);
    defaultDate.setMinutes(0);
    defaultDate.setHours(defaultDate.getHours()+3);

    const defaultDuracion = 30;

    const [form, setForm] = useState({fechaInicio: defaultDate.toISOString(), duracion:defaultDuracion})

    const [validation, setValidation] = useState({})

    const [reservas, setReservas] = useState([])

    const [excludeTimes, setExcludeTimes] = useState([]);

    const [showSuccess, setShowSuccess] = useState(false);

    const [showError, setShowError] = useState(false);

    function validDate(dateString){
        const baseDate = new Date()
        baseDate.setMinutes(0)
        defaultDate.setHours(defaultDate.getHours()+2);
        const valid = new Date(dateString) >= baseDate;
        if(!valid){
            throw new Error('"fechaInicio" is not valid date"');
        }
        return dateString;
    }

    function handleChange(event){
        setValidation(schema.validate({...form, [event.target.name]: event.target.value}, { abortEarly: false }))
        setForm({...form, [event.target.name]: event.target.value});
    }

    function handleDateChange(date){
        setForm({...form, fechaInicio: date.toISOString()});
        setValidation(schema.validate({...form, "fechaInicio": date.toISOString()}, { abortEarly: false }))
    }

    function handleClose(){
        props.history.push("/serviciosCliente")
    }

    function handleCloseSuccess(){
        setShowSuccess(false);
        props.history.push("/citasCliente");
    }

    function handleCloseError(){
        setShowError(false);
    }


    function handleSubmit(event){
        event.preventDefault();
        if(!validation.error){
            const content = {
                fechaInicio: form.fechaInicio,
                fechaFin: new Date(new Date(form.fechaInicio).getTime()+form.duracion*60*1000).toISOString(),
                precio: props.location.servicio.precio,
                servicio: props.location.servicio.id,
                cliente: context.user._id,
            };

            fetch(`/reservas`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(content),
            }).then((data) => {
                setShowSuccess(true);
            }).catch(()=>{
                setShowError(true)
            });
        }else{
            setShowError(true)
        }

    }

    useEffect(() => {
        if(props.location.servicio){
            fetch(`/servicios/${props.location.servicio.id}/reservas/next`).then(res=>res.json()).then(reservasNew=>{
                setReservas(reservasNew)
            })
        }
    }, []);

    useEffect(() => {
        const startDate = new Date(form.fechaInicio);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        startDate.setMinutes(0);
        startDate.setHours(0);
        const refDay = startDate.getDay()
        const newExcludeDates = []
        while(refDay === startDate.getDay()){
            const endDate = new Date(startDate.getTime() + form.duracion*60*1000)
            for(let i=0; i<reservas.length; i++){
                const res = reservas[i];
                const fechaI = new Date(res.fechaInicio)
                const fechaF = new Date(res.fechaFin)
                if((fechaI > startDate? fechaI: startDate) <= (fechaF < endDate? fechaF: endDate)){
                    newExcludeDates.push(new Date(startDate.getTime()));
                    break;
                }
            }
            startDate.setMinutes(startDate.getMinutes()+30)
        }
        setExcludeTimes(newExcludeDates)

    }, [form]);

    var userLang = navigator.language || navigator.userLanguage; 

    if (!context.user) return <Redirect to='/'/>;

    if (!props.location.servicio) return <Redirect to='/serviciosCliente'/>;

    return (
        <div className="App">
            <Sidebar/>
            <div className="formServicio">
                <div className="servicioDetailBarRe">
                        <Link to="/serviciosCliente">
                            <p><FormattedMessage id="Services"/></p>
                        </Link>
                        <img className="triangle" src={triangle} alt="Triangulo"/>
                        <Link to={{pathname: "/serviciosDetail", categoria: props.location.servicio.categoria}}>
                            <p><FormattedMessage id={props.location.servicio.categoria}/></p>
                        </Link>
                        <img className="triangle" src={triangle} alt="Triangulo"/>
                        <p><FormattedMessage id="Schedule"/></p>
                </div>
                <div className="formServicio-title">
                    <div className="formServicio-title-txt">
                        <h1><FormattedMessage id="Schedule"/></h1>
                        <p><FormattedMessage id="newCita"/></p>
                    </div>
                </div>
                <div className="formServicio-detail-cont">
                <div className="formServicio-detail">
                    <div className="formServicio-detail-bloc">
                        <div className="formServicio-detail-in1">
                            <span><FormattedMessage id="Worker"/></span>
                            <span><FormattedMessage id="Category"/></span>
                            <span><FormattedMessage id="Price"/></span>
                            <span><FormattedMessage id="Address"/></span>
                        </div>
                        <div className="formServicio-detail-in2">
                            <p>{props.location.servicio.nombreTrabajador}</p>
                            <p><FormattedMessage id={props.location.servicio.categoria}/></p>
                            <p>{"$ "+props.location.servicio.precio+ " /hora"}</p>
                            <p>{context.user.direccion}</p>
                        </div>
                    </div>
                </div>
                <div className="formServicio-main">
                    <form className="formDetailCita" onSubmit={handleSubmit}>
                        <label htmlFor="fechaInicio"><p><FormattedMessage id="Day"/></p></label>
                        <DatePicker
                            selected={new Date(form.fechaInicio)}
                            onChange={handleDateChange}
                            showTimeSelect
                            dateFormat={userLang.startsWith('en')?"MM/dd/yyyy hh:mm aa":"dd/MM/yyyy hh:mm aa"}
                            excludeTimes={excludeTimes}
                            id="fechaInicio"
                            locale={userLang.startsWith('en')?"en":"es"}
                        />
                        {validation.error &&
                        validation.error.message.includes('"fechaInicio"') && (
                            <div id="bad-date-feedback">
                                <p><FormattedMessage id="invalidDate"/></p>
                            </div>
                        )}
                        <label htmlFor="inputDuracion"><p><FormattedMessage id="duration"/></p></label>
                        <select  onChange={handleChange} defaultValue={"30"} name="duracion" className="form-control" id="inputDuracion">
                            <option value="30">30</option>
                            <option value="60">60</option>
                            <option value="90">90</option>
                            <option value="120">120</option>
                        </select>
                        <div className="bloqueBotonesCita">
                            <button type="button" className="cancelButton" onClick={handleClose}>
                                <FormattedMessage id="Cancel"/>
                            </button>
                            <input type="submit" value={intl.formatMessage({id: 'Book'})} onClick={handleSubmit} className="reservar"/>
                        </div>
                    </form>
                </div>
                </div>
            </div>
            <Modal id="modal_error" show={showError} onHide={handleCloseError} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body><FormattedMessage id="SendError"/></Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseError}>
                        <FormattedMessage id="Close"/>
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal id="modal_success" show={showSuccess} onHide={handleCloseSuccess} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title><FormattedMessage id="HasReservado"/></Modal.Title>
                </Modal.Header>
                <Modal.Body><FormattedMessage id="SuccReserve"/></Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseSuccess} id="register_success_btn">
                        <FormattedMessage id="Close"/>
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );


}

export default CrearReserva;