import React, {useContext, useEffect, useState} from "react";
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import {appContext} from "../context/AppContext";
import {Link, Redirect} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Search from "../components/Search";
import bienvenido from "../recursos/bienvenido.svg";
import emptyCitas from "../recursos/emptyCitas.svg";
import emptyMensajes from "../recursos/emptyMensajes.svg";
import serHome1 from "../recursos/serHome1.svg";
import serHome2 from "../recursos/serHome2.svg";
import serHome3 from "../recursos/serHome3.svg";
import serHome4 from "../recursos/serHome4.svg";
import serHome5 from "../recursos/serHome5.svg";
import "./Home.css";
import {FormattedMessage, FormattedDate} from 'react-intl'


function HomeCliente(props){

    const context = useContext(appContext);

    const [reservas, setReservas] = useState([]);

    const [state, setState] = useState({
        ultimaCita: {},
        errorCita: "",
        ultimoChat: ""
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

    useEffect(()=>{
        if (!context.user._id) return;
        let proximaCita = {
            direccion: context.user.direccion,
            fotoTrabajador: avatarTrabajador,
        };
        fetch(`/clientes/${context.user._id}/reservas/detalle/next`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .then((reservas) => {
                if (reservas.length === 0) {
                    return setState({...state,
                        errorCita: "No hay citas agendadas para el usuario",
                    });
                }

                setReservas(reservas);
                console.log(reservas);

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
                console.log(min_res.fechaInicio);
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
                setState({...state, ultimaCita: proximaCita});
            });
    }, [])

    if (!context.user._id) return <Redirect to='/'/>;

    return (
        <div className="App">
            <Sidebar/>
            <div className="home">
                <Search/>
                <div className="mainHome">
                    <div className="mainHome-izq">
                        <div className="bienvenida">
                            <div className="textBienvenida">
                                <h2><FormattedMessage id="Welcome"/></h2>
                                <p><FormattedMessage id="beginExplore"/></p>
                            </div>
                            <div className="bloqueIl">
                                <img
                                    className="ilBienvenida"
                                    src={bienvenido}
                                    alt="Bienvenida"
                                />
                            </div>
                        </div>
                        {navigator.onLine ? (<div>
                        {!state.errorCita ? (
                            <div className="card homeDetails">
                                <div className="cardTitle">
                                    <h3><FormattedMessage id="NextWork"/></h3>
                                </div>
                                <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                                    <div className="carousel-inner">
                                    {
                                        reservas.map(
                                            (item, key) => {
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
                                                                    src={avatarTrabajador}
                                                                    alt="Foto Trabajdor"
                                                                />
                                                            </div>
                                                            <div className="bloqueTexto1">
                                                                <h3>{item.servicio.trabajador.nombre}</h3>
                                                                <p><FormattedMessage id={item.servicio.categoria}/></p>
                                                            </div>
                                                            <div className="bloqueTexto2">
                                                                <h3><FormattedDate
                                                                value ={darFecha(item.fechaInicio)}
                                                                year='numeric'
                                                                month='short'
                                                                day='numeric'
                                                                weekday='short'
                                                                /></h3>
                                                                <p>{context.user.direccion}</p>
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
                                <div className="cardButton todas">
                                    <Link to="/citasCliente">
                                        <p><FormattedMessage id="VerCitas"/></p>
                                    </Link>
                                </div>
                            </div>
                            
                        ) : (
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
                                        <p><FormattedMessage id="FindWorker"/></p>
                                    </div>
                                </div>
                                <div className="cardButton">
                                    <Link to="/citasCliente" className='disabled-link'>
                                        <p><FormattedMessage id="VerCitas"/></p>
                                    </Link>
                                </div>
                            </div>
                        )}
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
                                        <p><span><FormattedMessage id="serverProblem"/></span></p>
                                    </div>
                                </div>
                                <div className="cardButton">
                                    <Link to="/citasCliente" className='disabled-link'>
                                        <p><FormattedMessage id="VerCitas"/></p>
                                    </Link>
                                </div>
                            </div>
                        }
                        {navigator.onLine ? (
                            <div>
                            {state.ultimoChat ? (
                                <div className="card homeDetails">
                                    <div className="cardTitle">
                                        <h3><FormattedMessage id="LastMessage"/></h3>
                                    </div>
                                    <div className="cardIntHome">
                                        <img
                                            className="imgTrabajador"
                                            src={state.ultimoChat.fotoCliente}
                                            alt="Foto Cliente"
                                        />
                                    </div>
                                    <div className="bloqueBorder">
                                        <h3>{state.ultimoChat.cliente}</h3>
                                    </div>
                                    <div className="bloqueMensaje">
                                        <p className="horaMensaje">
                                            {state.ultimoChat.fechaUltimoMensaje}
                                        </p>
                                        <p>{state.ultimoChat.ultimoMensaje}</p>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/mensajesCliente">
                                            <p><FormattedMessage id="VerMensajes"/></p>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
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
                                        <Link to="/mensajesCliente" className='disabled-link'>
                                            <p><FormattedMessage id="VerMensajes"/></p>
                                        </Link>
                                    </div>
                                </div>
                            )}
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
                                            <p><span><FormattedMessage id="serverProblem"/></span></p>
                                        </div>
                                    </div>
                                    <div className="cardButton">
                                        <Link to="/mensajesCliente" className='disabled-link'>
                                            <p><FormattedMessage id="VerMensajes"/></p>
                                        </Link>
                                    </div>
                                </div>        
                        }
                    </div>
                    <div className="mainHome-der">
                        <p className="mainHome-der-frase">
                            <FormattedMessage id="FindBetter"/>
                        </p>
                        <div className="mainHome-der-oferta">
                            <div className="row serItem">
                                <img className="imgSerHome" src={serHome1} alt="Servicio 1"/>
                                <p><FormattedMessage id="Carpintería"/></p>
                            </div>
                            <div className="row serItem">
                                <img className="imgSerHome" src={serHome2} alt="Servicio 2"/>
                                <p><FormattedMessage id="Electricista"/></p>
                            </div>
                            <div className="row serItem">
                                <img className="imgSerHome" src={serHome3} alt="Servicio 3"/>
                                <p><FormattedMessage id="Jardinería"/></p>
                            </div>
                            <div className="row serItem">
                                <img className="imgSerHome" src={serHome4} alt="Servicio 4"/>
                                <p><FormattedMessage id="Mascotas"/></p>
                            </div>
                            <div className="row serItem">
                                <img className="imgSerHome" src={serHome5} alt="Servicio 5"/>
                                <p><FormattedMessage id="Pintura"/></p>
                            </div>
                        </div>
                        <div className="buttonHome">
                            <Link to="/serviciosCliente">
                                <span><FormattedMessage id="VerTodos"/></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeCliente;