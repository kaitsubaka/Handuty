import React, {useContext, useEffect, useState} from "react";
import "./Citas.css";
import {Link, Redirect} from "react-router-dom";
//import fotoPrueba from "../recursos/FotoPrueba1.png"
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import qrIcon from "../recursos/qrIcon.svg"
import messageIcon from "../recursos/messageIcon.svg"
import {Modal, Button} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import { appContext } from "../context/AppContext";
import emptyIcon from "../recursos/emptyIcon.svg";
import deleteIcon from "../recursos/deleteGris.svg";
import calif from "../recursos/califGris.svg";
import {FormattedMessage, FormattedDate} from 'react-intl'

function Citas(props){

    const [state, setState] = useState({citas:[]});

    const [past, setPast] = useState(false)

    const [showCalification, setShowCalification] = useState(false);

    const context = useContext(appContext);

    function deleteReserva(event){
        fetch(`/reservas/${event.target.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).then(res => console.log(res))
        let copiaCitas = state.citas
        const index = copiaCitas.findIndex(cita => cita.id === event.target.id)

        copiaCitas.splice(index, 1)
        setState({...state, citas: copiaCitas })
    }

    useEffect(()=>{
        if(!context.user._id) return ;
        const fetchPath = !past? `/clientes/${context.user._id}/reservas/detalle/next`: `/clientes/${context.user._id}/reservas/detalle/past`;
        console.log(fetchPath)
        fetch(fetchPath, { method: 'GET', headers: { 'Content-Type': 'application/json' } }).then(
            res => res.json()
        ).then(reservas => {
            console.log(reservas)
            if (reservas.length === 0) { return setState({...state, CalificationCita: 'No hay citas agendadas para el' +
                    ' usuario' , citas: []}) }
            let citasTmp = []
            for (let i = 0; i < reservas.length; i++) {
                const tmp = reservas[i];
                const tmpDate = new Date(tmp.fechaInicio)
                const tmpDateEnd = new Date(tmp.fechaFin);
                let cita = {
                    direccion: context.user.direccion,
                    fotoTrabajador: avatarTrabajador,
                }
                cita.duracion = Math.floor((tmpDateEnd.getTime() - tmpDate.getTime()) / 1000 / 60)
                cita.calificacion = tmp.calificacion
                cita.id = tmp._id
                cita.horaInicio = tmpDate.getHours() + ':' + (tmpDate.getMinutes()<10?'0':'') + tmpDate.getMinutes()
                cita.fecha = `${tmpDate.getFullYear()} ${tmpDate.getMonth()+1} ${tmpDate.getDate()} `
                cita.categoria = tmp.servicio.categoria
                cita.trabajador = tmp.servicio.trabajador.nombre
                cita.precio = tmp.servicio.precio
                citasTmp.push(cita)
            }
            setState({...state, citas: citasTmp })
        })

    }, [past]);


    const changeCitas=()=>{
        setPast(!past)
    }

    function handleCloseCalification(){
        setShowCalification(false);
    }

    function calificar(event){
        const info = event.target.id.split('-')
        const calificacion={
            calificacion: parseInt(info[2])
        }
        let copiaCitas = state.citas
        const index = copiaCitas.findIndex(cita => cita.id === info[1])
        copiaCitas[index].calificacion=parseInt(info[2])
        setState({...state, citas: copiaCitas })

        fetch("/reservas/"+info[1], {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(calificacion)
        })
        setShowCalification(false);
    }

    if(!context.user._id) return <Redirect to='/'  />;
    return (
        <div className="App">
            <Sidebar />
            <div className="citas">
                <div className="title">
                    <h2><FormattedMessage id="Works"/></h2>
                    <p><FormattedMessage id="HereFind"/></p>
                </div>
                <span className="selectCitas">
                    <strong className="lab" id="switchText"><FormattedMessage id="FutureWorks"/></strong>
                    <label className="switch">
                        <input type="checkbox" onClick={changeCitas} title="switchCitas" aria-labelledby="switchText"/>
                        <span className="slider round"></span>
                    </label>
                    <strong className="lab"><FormattedMessage id="PastWorks"/></strong>
                </span>
                {navigator.onLine ? (
                    <div>
                    { state.citas.length===0?
                        <div className="emptyPage">
                            <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                            <p className="emptyPage-bold"><FormattedMessage id="NoWorkError"/></p>
                            <p><FormattedMessage id="GoAndFind"/> <Link to="/serviciosCliente"> <span><FormattedMessage id="Services"/></span></Link> <FormattedMessage id="Available"/></p>
                        </div>
                        :state.citas.map((item, key) => {
                            return (
                                <div key={key} className="citasDetail">
                                    <div className="card cardCita">
                                        <div className="cardIntCitas">
                                            <div className="cardPrincipal">
                                                <div className="bloqueBorderCitas text-center">
                                                    <h3>{item.horaInicio}</h3>
                                                    <p>{item.duracion} <FormattedMessage id="Minutes"/></p>
                                                </div>
                                                <div>
                                                    <img className="imgTrabajadorCitas" src={avatarTrabajador} alt="Foto Trabajador" />
                                                </div>
                                                <div className="bloqueTrabajadorCitas">
                                                    <h3>{item.trabajador}</h3>
                                                    <p><FormattedMessage id={item.categoria}/></p>
                                                </div>
                                                <div className="bloqueTextoCitas">
                                                    <h3><FormattedDate 
                                                    value ={item.fechaInicio}
                                                    year='numeric'
                                                    month='short'
                                                    day='numeric'
                                                    weekday='short'
                                                /></h3>
                                                    <p>{item.direccion}</p>
                                                    <p>$ {item.precio}k</p>
                                                </div>
                                            </div>
                                            <div className="bloqueIconosCitas">
                                                <Link to="/citasCliente">
                                                    <img className="iconCitas" src={qrIcon} alt="Icono QR" />
                                                </Link>
                                                <Link to="/citasCliente">
                                                    <img className="iconCitas" src={messageIcon} alt="Icono Mensaje" />
                                                </Link>
                                                {
                                                    past?(
                                                        <span className="califBloc">
                                                    <img id={item.id} className="iconCitas2" src={calif} alt="Icono Eliminar" />
                                                            {item.calificacion?item.calificacion:(
                                                                <div className="div-button-calificar">
                                                                    <button className="btn btn-calificacion" onClick={()=>setShowCalification(true)}><FormattedMessage id="Calificar"/></button>
                                                                    <Modal id="modal_Calification" show={showCalification} onHide={handleCloseCalification} animation={false}>
                                                                        <Modal.Header closeButton>
                                                                            <Modal.Title><FormattedMessage id="Calificar"/></Modal.Title>
                                                                        </Modal.Header>
                                                                        <Modal.Body><FormattedMessage id="CalServ"/> {item.trabajador}
                                                                            <br/>
                                                                            <div className="ec-stars-wrapper">
                                                                                <a onClick={calificar} id={"st-"+item.id+"-1"} data-value="1" title="Votar con 1 estrellas">&#9733;</a>
                                                                                <a onClick={calificar} id={"st-"+item.id+"-2"} data-value="2" title="Votar con 2 estrellas">&#9733;</a>
                                                                                <a onClick={calificar} id={"st-"+item.id+"-3"} data-value="3" title="Votar con 3 estrellas">&#9733;</a>
                                                                                <a onClick={calificar} id={"st-"+item.id+"-4"} data-value="4" title="Votar con 4 estrellas">&#9733;</a>
                                                                                <a onClick={calificar} id={"st-"+item.id+"-5"} data-value="5" title="Votar con 5 estrellas">&#9733;</a>
                                                                            </div>
                                                                        </Modal.Body>
                                                                        <Modal.Footer>
                                                                            <Button variant="danger" onClick={handleCloseCalification}>
                                                                                Cerrar
                                                                            </Button>
                                                                        </Modal.Footer>
                                                                    </Modal>
                                                                </div>
                                                            )}
                                                </span>
                                                    ):<Link to="/citasCliente" onClick = {deleteReserva}>
                                                        <img id={item.id} className="iconCitas" src={deleteIcon} alt="Icono Eliminar" />
                                                    </Link>
                                                }
                                            </div>
                                        </div>

                                    </div>
    
                                </div>
                            )
                        })}
                    </div>
                ):
                <div className="emptyPage">
                            <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                            <p className="emptyPage-bold"><FormattedMessage id="serverProblem"/></p>
                        </div>
                }
                
            </div>
        </div>
    );
}

export default Citas;