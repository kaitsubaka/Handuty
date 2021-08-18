import React, {useContext, useEffect, useState} from "react";
import {appContext} from "../context/AppContext";
import {Link, Redirect} from "react-router-dom";
import SidebarTrabajador from "../components/SidebarTrabajador";
import Search from "../components/Search";
import bienvenido from "../recursos/bienvenido.svg";
import avatarCliente from "../recursos/avatarCliente.png";
import emptyCitas from "../recursos/emptyCitas.svg";
import emptyMensajes from "../recursos/emptyMensajes.svg";
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import emptyIcon from "../recursos/emptyIcon.svg";
import "./Home.css";
import {FormattedMessage, FormattedDate} from 'react-intl'

function HomeTrabajador(props){

    const context = useContext(appContext);

    const [reservas, setReservas] = useState([]);

    const [state, setState] = useState({
        proximaCita: "",
        ultimoChat: "",
        servicios: []
    });

    function darFecha(fecha){
        const fechaNueva = new Date(fecha);
        return fechaNueva.getFullYear() + " " + fechaNueva.getMonth() + " " + fechaNueva.getDate();
    }

    function darHora(fecha){
        const fechaNueva = new Date(fecha);
        return  fechaNueva.getHours() +  ":" + (fechaNueva.getMinutes() < 10 ? "0" : "") + fechaNueva.getMinutes();
    }

    function darDuracion(fechaI, fechaF){
        const fechaINueva = new Date(fechaI);
        const fechaFNueva = new Date(fechaF);
        return  (fechaFNueva.getTime() - fechaINueva.getTime())/(1000 * 60);
    }

    useEffect(() => {
        fetch("/trabajadores/" + context.user._id + "/servicios").then(resp => {
            resp.json().then(servicios => {
                if (servicios.length > 4) {
                    servicios = servicios.slice(0, 5)
                    servicios.push({_id: "extra", categoria: "..."});
                }
                fetch(`/trabajadores/${context.user._id}/servicios/reservas/detalle/next`).then(resp => {
                    resp.json().then(reservas => {
                        let reserva = null;

                        setReservas(reservas);
                        console.log(reservas);

                        if (reservas.length > 0) {
                            reserva = reservas[0];
                            reserva.fechaInicio = new Date(reserva.fechaInicio);
                            reserva.fechaFin = new Date(reserva.fechaFin);
                            reserva.duracion = (reserva.fechaFin.getTime() - reserva.fechaInicio.getTime()) / (1000 * 60);
                        }
                        setState({...state, proximaCita: reserva, servicios: servicios})
                    });
                });
            });
        }).catch(err => {
            console.log(err)
        });


    }, []);


    if (!context.user._id) return <Redirect to='/'/>;

    return (
        <div className="App">
            <SidebarTrabajador/>
            <div className="home">
                <div className="mainHomeTrabajador">
                    <div className="mainHome-izq">
                        <div className="bienvenida">
                            <div className="textBienvenida">
                                <h2><FormattedMessage id="Welcome"/></h2>
                                <p><FormattedMessage id="beginExplore"/></p>
                            </div>
                            <div className="bloqueIl">
                                <img className="ilBienvenida" src={bienvenido} alt="Bienvenida"/>
                            </div>
                        </div>
                        {navigator.onLine ? (
                            <div>
                            {state.proximaCita ?
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3><FormattedMessage id="NextWork"/></h3>
                                    </div>
                                    <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                                        <div className="carousel-inner">
                                        { reservas.map( (item, key) => {
                                            let classA = "";
                                            if(key===0){
                                                classA ="carousel-item active";
                                            } else{
                                                classA="carousel-item";
                                            }
                                            return (
    
                                                <div className={classA} key={key}>
                                                            <div className="cardIntHome">
                                                                <div className="bloqueBorder text-center">
                                                                    <h3>{darHora(item.fechaInicio)}</h3>
                                                                    <p>{darDuracion(item.fechaInicio, item.fechaFin) + " min"}</p>
                                                                </div>
                                                                <div>
                                                                    <img
                                                                        className="imgTrabajador"
                                                                        src={avatarCliente}
                                                                        alt="Foto Cliente"
                                                                    />
                                                                </div>
                                                                <div className="bloqueTexto1">
                                                                    <h3>{item.cliente.nombre}</h3>
                                                                    
                                                                </div>
                                                                <div className="bloqueTexto2">
                                                                    <h3><FormattedDate 
                                                                        value={darFecha(item.fechaInicio)}
                                                                        year='numeric'
                                                                        month='short'
                                                                        day='numeric'
                                                                        weekday='short'
                                                                    /></h3>
                                                                    <p>{item.cliente.direccion}</p>
                                                                </div>
                                                            </div>
                                                </div>
    
                                            )
    
                                            })
    
                                        }
                                    </div>
                                            <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="sr-only">Previous</span>
                                            </a>
                                            <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="sr-only">Next</span>
                                            </a>
                                    </div>
                                    {/*<div className="cardIntHome">
                                        <div className="bloqueBorder text-center">
                                            <h3>{state.proximaCita.fechaInicio.getHours() + ":00"}</h3>
                                            <p>{state.proximaCita.duracion + " minutos"}</p>
                                        </div>
                                        <div>
                                            <img className="imgTrabajador" src={avatarCliente}
                                                 alt="Foto Cliente"/>
                                        </div>
                                        <div className="bloqueTexto">
                                            <h3>{state.proximaCita.cliente.nombre}</h3>
                                        </div>
                                        <div className="bloqueTexto">
                                            <h3>{state.proximaCita.fechaInicio.toISOString().substring(0, 10)}</h3>
                                            <p>{state.proximaCita.cliente.direccion}</p>
                                        </div>
                                    </div>*/}
                                    <div className="cardButton">
                                        <Link to="/citasTrabajador">
                                            <p><FormattedMessage id="VerCitas"/></p>
                                        </Link>
                                    </div>
                                </div>
                                :
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3><FormattedMessage id="NextWork"/></h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <img
                                            className="emptyCitaIcon"
                                            src={emptyCitas}
                                            alt="Busqueda"
                                        />
                                        <div className="emptyHome">
                                            <p><span><FormattedMessage id="NoWork"/></span></p>
                                            <p><FormattedMessage id="NoReserv"/></p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/citasTrabajador" className='disabled-link'>
                                            <p><FormattedMessage id="VerCitas"/></p>
                                        </Link>
                                    </div>
                                </div>
                            }
                            </div>
                        ):
                        <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3><FormattedMessage id="NextWork"/></h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <img
                                            className="emptyCitaIcon"
                                            src={emptyCitas}
                                            alt="Busqueda"
                                        />
                                        <div className="emptyHome">
                                            <p><span>Hubo un problema contactando al servidor, revisa tu conexión e intentalo mas tarde</span></p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/citasTrabajador" className='disabled-link'>
                                            <p><FormattedMessage id="VerCitas"/></p>
                                        </Link>
                                    </div>
                                </div>
                        }
                        
                        {navigator.onLine?(
                            <div>
                            {state.ultimoChat ?
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3><FormattedMessage id="LastMessage"/></h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <div>
                                            <img className="imgTrabajador" src={state.ultimoChat.fotoCliente}
                                                 alt="Foto Cliente"/>
                                        </div>
                                        <div className="bloqueBorder">
                                            <h3>{state.ultimoChat.cliente}</h3>
                                        </div>
                                        <div className="bloqueMensaje">
                                            <p className="horaMensaje">{state.ultimoChat.fechaUltimoMensaje}</p>
                                            <p>{state.ultimoChat.ultimoMensaje}</p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/mensajesTrabajador">
                                            <p><FormattedMessage id="VerMensajes"/></p>
                                        </Link>
                                    </div>
                                </div>
                                :
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3><FormattedMessage id="LastMessage"/></h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <img
                                            className="emptyCitaIcon"
                                            src={emptyMensajes}
                                            alt="Mensaje"
                                        />
                                        <div className="emptyHome">
                                            <p><span><FormattedMessage id="NoMess"/></span></p>
                                            <p><FormattedMessage id="Chat"/></p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/mensajesTrabajador" className='disabled-link'>
                                            <p><FormattedMessage id="VerMensajes"/></p>
                                        </Link>
                                    </div>
                                </div>
                            }
                            </div>
                        ):
                        <div className="card homeDetails">
                        <div className="cardTitle">
                            <h3><FormattedMessage id="LastMessage"/></h3>
                        </div>
                        <div className="cardIntHome">
                            <img
                                className="emptyCitaIcon"
                                src={emptyMensajes}
                                alt="Mensaje"
                            />
                            <div className="emptyHome">
                                <p><span>Hubo un problema contactando al servidor, revisa tu conexión e intentalo mas tarde</span></p>
                            </div>
                        </div>
                        <div className="cardButton">
                            <Link to="/mensajesTrabajador" className='disabled-link'>
                                <p><FormattedMessage id="VerMensajes"/></p>
                            </Link>
                        </div>
                    </div>
                        }
                        
                        
                    </div>
                    <div className="mainHome-der">
                        <div className="perfil-main-persona">
                            <img className="imagen" src={avatarTrabajador} alt="Foto"/>
                            <h3>{context.user.nombre}</h3>
                        </div>
                        <div className="perfil-home-informacion">
                            <p><FormattedMessage id="MyServs"/></p>
                            {navigator.onLine ? (
                                <div className="perfil-home-informacionDetail">
                                {state.servicios.length > 0 ?
                                    state.servicios.map((item) => {
                                        return (
                                            <p key={item._id}><FormattedMessage id={item.categoria}/></p>
                                        )
                                    })
                                    :
                                    <div className="emptyPage">
                                        <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                        <p><FormattedMessage id="NoServicesAdded"/></p>
                                    </div>
                                }
                            </div>
                            ):
                                <div className="emptyPage">
                                    <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                    <p>Hubo un problema contactando al servidor, revisa tu conexión e intentalo mas tarde</p>
                                </div>
                            }
                            
                        </div>
                        {state.servicios.length > 0 ?
                            <div className="buttonPerfilHome">
                                <Link to="/perfilTrabajador">
                                    <span><FormattedMessage id="VerTodos"/></span>
                                </Link>
                            </div>
                            :
                            <div/>
                        }

                    </div>
                </div>
            </div>
        </div>
    );

}

export default HomeTrabajador;