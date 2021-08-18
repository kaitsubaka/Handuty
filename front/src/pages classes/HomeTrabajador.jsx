import React from "react";
import Search from "../components/Search";
import {Link, Redirect, withRouter} from "react-router-dom";
import bienvenido from "../recursos/bienvenido.svg";
//import serHome1 from "../recursos/serHome1.svg";
//import serHome2 from "../recursos/serHome2.svg";
//import fotoPrueba from "../recursos/FotoPrueba1.png";
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import avatarCliente from "../recursos/avatarCliente.png";
import "../pages/Home.css";
import SidebarTrabajador from "../components/SidebarTrabajador";
import {appContext} from "../context/AppContext";
import emptyIcon from "../recursos/emptyIcon.svg";
import emptyCitas from "../recursos/emptyCitas.svg";
import emptyMensajes from "../recursos/emptyMensajes.svg";


class HomeTrabajador extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            proximaCita: "",
            ultimoChat: "",
            servicios: []
        };
    }

    componentDidMount() {
        if (!this.context.user._id) return;
        fetch("/trabajadores/" + this.context.user._id + "/servicios").then(resp => {
            resp.json().then(servicios => {
                if (servicios.length > 4) {
                    servicios = servicios.slice(0, 5)
                    servicios.push({_id: "extra", categoria: "..."});
                }
                this.setState({servicios: servicios})
            });
        }).catch(err => {
            console.log(err)
        });

        fetch(`/trabajadores/${this.context.user._id}/servicios/reservas/detalle/next`).then(resp => {
            resp.json().then(reservas => {
                if (reservas.length > 0) {
                    const reserva = reservas[0];
                    reserva.fechaInicio = new Date(reserva.fechaInicio);
                    reserva.fechaFin = new Date(reserva.fechaFin);
                    reserva.duracion = (reserva.fechaFin.getTime() - reserva.fechaInicio.getTime()) / (1000 * 60);
                    this.setState({proximaCita: reserva})
                }
            });
        });
    }


    render() {
        if (!this.context.user._id) return <Redirect to='/'/>;
        return (
            <div className="App">
                <SidebarTrabajador/>
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
                                    <img className="ilBienvenida" src={bienvenido} alt="Bienvenida"/>
                                </div>
                            </div>

                            {this.state.proximaCita ?
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3>Próxima Cita</h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <div className="bloqueBorder text-center">
                                            <h3>{this.state.proximaCita.fechaInicio.getHours() + ":00"}</h3>
                                            <p>{this.state.proximaCita.duracion + " minutos"}</p>
                                        </div>
                                        <div>
                                            <img className="imgTrabajador" src={avatarCliente}
                                                 alt="Foto Cliente"/>
                                        </div>
                                        <div className="bloqueTexto">
                                            <h3>{this.state.proximaCita.cliente.nombre}</h3>
                                        </div>
                                        <div className="bloqueTexto">
                                            <h3>{this.state.proximaCita.fechaInicio.toISOString().substring(0, 10)}</h3>
                                            <p>{this.state.proximaCita.cliente.direccion}</p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/citasTrabajador">
                                            <p>Ver Todas</p>
                                        </Link>
                                    </div>
                                </div>
                                :
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
                                            <p>¡Pronto recibirás una solicitud!</p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/citasTrabajador" className='disabled-link'>
                                            <p>Ver Todas</p>
                                        </Link>
                                    </div>
                                </div>
                            }

                            {this.state.ultimoChat ?
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3>Último Mensaje</h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <div>
                                            <img className="imgTrabajador" src={this.state.ultimoChat.fotoCliente}
                                                 alt="Foto Cliente"/>
                                        </div>
                                        <div className="bloqueBorder">
                                            <h3>{this.state.ultimoChat.cliente}</h3>
                                        </div>
                                        <div className="bloqueMensaje">
                                            <p className="horaMensaje">{this.state.ultimoChat.fechaUltimoMensaje}</p>
                                            <p>{this.state.ultimoChat.ultimoMensaje}</p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/mensajesTrabajador">
                                            <p>Ver Todos</p>
                                        </Link>
                                    </div>
                                </div>
                                :
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
                                            <p>¡Entra a mensajes!</p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/mensajesTrabajador" className='disabled-link'>
                                            <p>Ver Todos</p>
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="mainHome-der">
                            <div className="perfil-main-persona">
                                <img className="imagen" src={avatarTrabajador} alt="Foto"/>
                                <h3>{this.context.user.nombre}</h3>
                            </div>
                            <div className="perfil-home-informacion">
                                <p>Mis Servicios</p>
                                <div className="perfil-home-informacionDetail">
                                    {this.state.servicios.length > 0 ?
                                        this.state.servicios.map((item) => {
                                            return (
                                                <p key={item._id}>{item.categoria}</p>
                                            )
                                        })
                                        :
                                        <div className="emptyPage">
                                            <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                            <p>No has agregado ningún servicio</p>
                                        </div>
                                    }
                                </div>
                            </div>
                            {this.state.servicios.length > 0 ?
                                <div className="buttonPerfilHome">
                                    <Link to="/perfilTrabajador">
                                        <span>Ver Todos</span>
                                    </Link>
                                </div>
                                :
                                <div></div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HomeTrabajador.contextType = appContext;
export default withRouter(HomeTrabajador);
