import React from "react";
import Search from "../components/Search";
import {Link, Redirect} from "react-router-dom";
import bienvenido from "../recursos/bienvenido.svg";
import serHome1 from "../recursos/serHome1.svg";
import serHome2 from "../recursos/serHome2.svg";
import serHome3 from "../recursos/serHome3.svg";
import serHome4 from "../recursos/serHome4.svg";
import serHome5 from "../recursos/serHome5.svg";
//import fotoPrueba from "../recursos/FotoPrueba1.png";
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import emptyCitas from "../recursos/emptyCitas.svg";
import emptyMensajes from "../recursos/emptyMensajes.svg";

import "../pages/Home.css";
import Sidebar from "../components/Sidebar";
import {appContext} from "../context/AppContext";

class HomeCliente extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ultimaCita: {},
            errorCita: "",
            ultimoChat: "",
        };
    }

    componentDidMount() {
        if (!this.context.user._id) return;
        let proximaCita = {
            direccion: this.context.user.direccion,
            fotoTrabajador: avatarTrabajador,
        };
        fetch(`/clientes/${this.context.user._id}/reservas/detalle/next`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .then((reservas) => {
                if (reservas.length === 0) {
                    return this.setState({
                        errorCita: "No hay citas agendadas para el usuario",
                    });
                }
                let min = new Date(reservas[0].fechaInicio);
                let min_res = reservas[0];
                for (let i = 0; i < reservas.length; i++) {
                    const reserva = reservas[i];
                    const date = new Date(reserva.fechaInicio);
                    if (date < min) {
                        min = date;
                        min_res = reserva;
                    }
                }
                proximaCita.fechaInicio = new Date(min_res.fechaInicio);
                proximaCita.fechaFin = new Date(min_res.fechaFin);
                proximaCita.duracion =
                    (proximaCita.fechaFin.getTime() - proximaCita.fechaInicio.getTime()) /
                    (1000 * 60);
                proximaCita.horaInicio =
                    min.getHours() +
                    ":" +
                    (min.getMinutes() < 10 ? "0" : "") +
                    min.getMinutes();
                proximaCita.fecha =
                    min.getFullYear() + " " + min.getMonth() + " " + min.getDate();
                proximaCita.categoria = min_res.servicio.categoria;
                proximaCita.trabajador = min_res.servicio.trabajador.nombre;
                this.setState({ultimaCita: proximaCita});
            });
    }

    render() {
        if (!this.context.user._id) return <Redirect to='/'/>;
        return (
            <div className="App">
                <Sidebar/>
                <div className="home">
                    <Search/>
                    <div className="mainHome">
                        <div className="mainHome-izq">
                            <div className="bienvenida">
                                <div className="textBienvenida">
                                    <h2>¡BIENVENIDO!</h2>
                                    <p>Comienza a explorar</p>
                                </div>
                                <div className="bloqueIl">
                                    <img
                                        className="ilBienvenida"
                                        src={bienvenido}
                                        alt="Bienvenida"
                                    />
                                </div>
                            </div>
                            {!this.state.errorCita ? (
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3>Próxima Cita</h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <div className="bloqueBorder text-center">
                                            <h3>{this.state.ultimaCita.horaInicio}</h3>
                                            <p>{this.state.ultimaCita.duracion} min</p>
                                        </div>
                                        <div>
                                            <img
                                                className="imgTrabajador"
                                                src={this.state.ultimaCita.fotoTrabajador}
                                                alt="Foto Trabajdor"
                                            />
                                        </div>
                                        <div className="bloqueTexto">
                                            <h3>{this.state.ultimaCita.trabajador}</h3>
                                            <p>{this.state.ultimaCita.categoria}</p>
                                        </div>
                                        <div className="bloqueTexto">
                                            <h3>{this.state.ultimaCita.fecha}</h3>
                                            <p>{this.state.ultimaCita.direccion}</p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/citasCliente">
                                            <p>Ver Todas</p>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3>Próxima Cita</h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <img
                                            className="emptyCitaIcon"
                                            src={emptyCitas}
                                            alt="Busqueda"
                                        />
                                        <div className="emptyHome">
                                            <p><span>No tienes ninguna reserva</span></p>
                                            <p>¡Encuentra al trabajador que necesitas!</p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/citasCliente" className='disabled-link'>
                                            <p>Ver Todas</p>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {this.state.ultimoChat ? (
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3>Último Mensaje</h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <img
                                            className="imgTrabajador"
                                            src={this.state.ultimoChat.fotoCliente}
                                            alt="Foto Cliente"
                                        />
                                    </div>
                                    <div className="bloqueBorder">
                                        <h3>{this.state.ultimoChat.cliente}</h3>
                                    </div>
                                    <div className="bloqueMensaje">
                                        <p className="horaMensaje">
                                            {this.state.ultimoChat.fechaUltimoMensaje}
                                        </p>
                                        <p>{this.state.ultimoChat.ultimoMensaje}</p>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/mensajesCliente">
                                            <p>Ver Todos</p>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3>Último Mensaje</h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <img
                                            className="emptyCitaIcon"
                                            src={emptyMensajes}
                                            alt="Mensaje"
                                        />
                                        <div className="emptyHome">
                                            <p><span>No tienes ningún mensaje</span></p>
                                            <p>¡Entra a mensajes y comienza a chatear!</p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/mensajesCliente" className='disabled-link'>
                                            <p>Ver Todos</p>
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>
                        <div className="mainHome-der">
                            <p className="mainHome-der-frase">
                                Encuentra a los mejores proveedores de{" "}
                                <span className="mainHome-der-imp">servicios generales</span>
                            </p>
                            <div className="mainHome-der-oferta">
                                <div className="row serItem">
                                    <img className="imgSerHome" src={serHome1} alt="Servicio 1"/>
                                    <p>Carpintería</p>
                                </div>
                                <div className="row serItem">
                                    <img className="imgSerHome" src={serHome2} alt="Servicio 2"/>
                                    <p>Electricista</p>
                                </div>
                                <div className="row serItem">
                                    <img className="imgSerHome" src={serHome3} alt="Servicio 3"/>
                                    <p>Jardinería</p>
                                </div>
                                <div className="row serItem">
                                    <img className="imgSerHome" src={serHome4} alt="Servicio 4"/>
                                    <p>Mascotas</p>
                                </div>
                                <div className="row serItem">
                                    <img className="imgSerHome" src={serHome5} alt="Servicio 5"/>
                                    <p>Pintura</p>
                                </div>
                            </div>
                            <div className="buttonHome">
                                <Link to="/serviciosCliente">
                                    <span>Ver Todos</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HomeCliente.contextType = appContext;
export default HomeCliente;
