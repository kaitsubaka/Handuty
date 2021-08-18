import React from "react";
import "../pages/Citas.css";
import {Link, Redirect} from "react-router-dom";
//import fotoPrueba from "../recursos/FotoPrueba1.png";
import avatarCliente from "../recursos/avatarCliente.png";
import qrIcon from "../recursos/qrIcon.svg";
import messageIcon from "../recursos/messageIcon.svg";
import cancelIcon from "../recursos/cancelIcon.svg";
import emptyIcon from "../recursos/emptyIcon.svg";
import SidebarTrabajador from "../components/SidebarTrabajador";
import {appContext} from "../context/AppContext";


class CitasTrabajadorClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {reservas: []};
    }

    componentDidMount() {
        if (!this.context.user._id) return;
        fetch(`/trabajadores/${this.context.user._id}/servicios/reservas/detalle/next`).then(resp => {
            resp.json().then(reservas => {
                if (reservas.length > 0) {
                    const newReservas = reservas.map(reserva => {
                        reserva.fechaInicio = new Date(reserva.fechaInicio);
                        reserva.fechaFin = new Date(reserva.fechaFin);
                        reserva.duracion = (reserva.fechaFin.getTime() - reserva.fechaInicio.getTime()) / (1000 * 60);
                        return reserva;
                    });
                    this.setState({"reservas": newReservas});
                }
            });
        });
    }

    render() {
        if (!this.context.user._id) return <Redirect to='/'/>;
        return (
            <div className="App">
                <SidebarTrabajador/>
                <div className="citas">
                    <div className="title">
                        <h2>Citas</h2>
                        <p>Aquí encontrarás todas las citas que has programado.</p>
                    </div>
                    <div className="citasDetail">
                        {this.state.reservas.length > 0 ?
                            this.state.reservas.map(reserva => {
                                return (
                                    <div key={reserva._id} className="card cardCita">
                                        <div className="cardIntCitas">
                                            <div className="cardPrincipal">
                                                <div className="bloqueBorderCitas text-center">
                                                    <h3>{("0" + reserva.fechaInicio.getHours()).slice(-2) + ":" +
                                                    ("0" + reserva.fechaInicio.getMinutes()).slice(-2)}</h3>
                                                    <p>{reserva.duracion} minutos</p>
                                                </div>
                                                <div>
                                                    <img className="imgTrabajadorCitas" src={avatarCliente}
                                                         alt="Foto Cliente"/>
                                                </div>
                                                <div className="bloqueTrabajadorCitas">
                                                    <h3>{reserva.cliente.nombre}</h3>
                                                </div>
                                                <div className="bloqueTextoCitas">
                                                    <h3>{reserva.fechaInicio.toISOString().substring(0, 10)}</h3>
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
                                                    <img className="iconCitas" src={cancelIcon} alt="Icono Eliminar"/>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>)
                            })
                            :
                            <div className="emptyPage">
                                <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                <p className="emptyPage-bold">¡Todavía no tienes ninguna cita!</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

CitasTrabajadorClass.contextType = appContext;
export default CitasTrabajadorClass;
