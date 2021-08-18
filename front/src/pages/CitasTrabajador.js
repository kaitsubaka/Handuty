import React, {useContext, useEffect, useState} from "react";
import {appContext} from "../context/AppContext";
import {Link, Redirect} from "react-router-dom";
import avatarCliente from "../recursos/avatarCliente.png";
import qrIcon from "../recursos/qrIcon.svg";
import messageIcon from "../recursos/messageIcon.svg";
import cancelIcon from "../recursos/cancelIcon.svg";
import emptyIcon from "../recursos/emptyIcon.svg";
import deleteIcon from "../recursos/deleteGris.svg";
import calif from "../recursos/califIcon.svg";
import "./Citas.css";
import {FormattedMessage, FormattedDate} from 'react-intl'
import Sidebar from "../components/Sidebar";


function CitasTrabajador(props){

    const context = useContext(appContext)

    const [state, setState] = useState({reservas:[]});

    useEffect(()=>{
        if (!context.user._id) return;
        fetch(`/trabajadores/${context.user._id}/servicios/reservas/detalle/next`).then(resp => {
            resp.json().then(reservas => {
                if (reservas.length > 0) {
                    const newReservas = reservas.map(reserva => {
                        reserva.fechaInicio = new Date(reserva.fechaInicio);
                        reserva.fechaFin = new Date(reserva.fechaFin);
                        reserva.duracion = (reserva.fechaFin.getTime() - reserva.fechaInicio.getTime()) / (1000 * 60);
                        return reserva;
                    });
                    setState({...state, "reservas": newReservas});
                }
            });
        });
    }, [context.user, state])

    if (!context.user._id) return <Redirect to='/'/>;

    return (
        <div className="App">
            <Sidebar/>
            <div className="citas">
                <div className="title">
                    <h2><FormattedMessage id="Works"/></h2>
                    <p><FormattedMessage id="HereFind"/></p>
                </div>
                {navigator.onLine ? (
                    <div className="citasDetail">
                    {state.reservas.length > 0 ?
                        state.reservas.map(reserva => {
                            return (
                                <div key={reserva._id} className="card cardCita">
                                    <div className="cardIntCitas">
                                        <div className="cardPrincipal">
                                            <div className="bloqueBorderCitas text-center">
                                                <h3>{("0" + reserva.fechaInicio.getHours()).slice(-2) + ":" +
                                                ("0" + reserva.fechaInicio.getMinutes()).slice(-2)}</h3>
                                                <p>{reserva.duracion} <FormattedMessage id="Minutes"/></p>
                                            </div>
                                            <div>
                                                <img className="imgTrabajadorCitas" src={avatarCliente}
                                                     alt="Foto Cliente"/>
                                            </div>
                                            <div className="bloqueTrabajadorCitas">
                                                <h3>{reserva.cliente.nombre}</h3>
                                            </div>
                                            <div className="bloqueTextoCitas">
                                                <h3><FormattedDate 
                                                    value ={reserva.fechaInicio.toISOString().substring(0, 10)}
                                                    year='numeric'
                                                    month='short'
                                                    day='numeric'
                                                    weekday='short'
                                                /></h3>
                                                <p>{reserva.cliente.direccion}</p>
                                                <p>$ {reserva.precio}</p>
                                            </div>
                                        </div>
                                        <div className="bloqueIconosCitas">
                                            <Link to="/citasTrabajador">
                                                <img className="iconCitas" src={qrIcon} alt="Icono QR"/>
                                            </Link>
                                            <Link to="/citasTrabajador">
                                                <img className="iconCitas" src={messageIcon} alt="Icono Mensaje"/>
                                            </Link>
                                            <Link to="/citasTrabajador">
                                                <img className="iconCitas" src={deleteIcon} alt="Icono Eliminar"/>
                                            </Link>
                                        </div>
                                    </div>
                                </div>)
                        })
                        :
                        <div className="emptyPage">
                            <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                            <p className="emptyPage-bold"><FormattedMessage id="NoWorkError"/></p>
                        </div>
                    }
                </div>
                ):
                    <div className="emptyPage">
                        <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                        <p className="emptyPage-bold">Hubo un problema contactando al servidor, revisa tu conexión e intentalo mas tarde</p>
                    </div>
                }
            </div>
        </div>
    )

}

export default CitasTrabajador;