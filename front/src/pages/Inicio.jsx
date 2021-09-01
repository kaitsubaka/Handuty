import { FormattedMessage, FormattedDate } from "react-intl";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../context/User";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import bienvenido from "../recursos/bienvenido.svg";
import emptyCitas from "../recursos/emptyCitas.svg";
import emptyMensajes from "../recursos/emptyMensajes.svg";
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import avatarCliente from "../recursos/avatarCliente.png";
import serHome1 from "../recursos/serHome1.svg";
import serHome2 from "../recursos/serHome2.svg";
import serHome3 from "../recursos/serHome3.svg";
import serHome4 from "../recursos/serHome4.svg";
import serHome5 from "../recursos/serHome5.svg";
import emptyIcon from "../recursos/emptyIcon.svg";
import { ROLES } from "../constants/Roles";
import "./Inicio.css";

function Inicio() {
  function darFecha(fecha) {
    const fechaNueva = new Date(fecha);
    return (
      fechaNueva.getFullYear() +
      " " +
      fechaNueva.getMonth() +
      " " +
      fechaNueva.getDate()
    );
  }

  function darHora(fecha) {
    const fechaNueva = new Date(fecha);
    return (
      fechaNueva.getHours() +
      ":" +
      (fechaNueva.getMinutes() < 10 ? "0" : "") +
      fechaNueva.getMinutes()
    );
  }

  function darDuracion(fechaI, fechaF) {
    const fechaINueva = new Date(fechaI);
    const fechaFNueva = new Date(fechaF);
    return (fechaFNueva.getTime() - fechaINueva.getTime()) / (1000 * 60);
  }

  const { user } = useContext(userContext);

  const [reservas, setReservas] = useState([]);

  const [lastCommunication, setLastCommunication] = useState({});
  useEffect(() => {
    switch (user.rol) {
      case ROLES.CLIENTE:
        clientManager();
        break;
      case ROLES.TRABAJADOR:
        workerManager();
        break;
      default:
        lastCommunication.error || setLastCommunication({ error: "Something is wrong" });
    }

    function clientManager() {
      if (!user._id) return;
      let cita = {
        direccion: user.direccion,
        fotoTrabajador: avatarTrabajador,
      };
      fetch(`/personas/${user._id}/reservas/detalle/next`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((reservas) => {
          if (reservas.length === 0) {
            return setLastCommunication({
              ...lastCommunication,
              error: "No hay citas agendadas para el usuario",
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
          cita.fechaInicio = new Date(min_res.fechaInicio);
          console.log(min_res.fechaInicio);
          cita.fechaFin = new Date(min_res.fechaFin);
          cita.duracion =
            (cita.fechaFin.getTime() - cita.fechaInicio.getTime()) /
            (1000 * 60);
          cita.horaInicio =
            min.getHours() +
            ":" +
            (min.getMinutes() < 10 ? "0" : "") +
            min.getMinutes();
          cita.fecha =
            min.getFullYear() + " " + min.getMonth() + " " + min.getDate();
          cita.categoria = min_res.servicio.categoria;
          cita.persona = min_res.servicio.persona.nombre;
          setLastCommunication({
            ...lastCommunication,
            cita: cita,
          });
        });
    }

    function workerManager() {
      fetch("/personas/" + user._id + "/servicios")
        .then((resp) => {
          resp.json().then((servicios) => {
            if (servicios.length > 4) {
              servicios = servicios.slice(0, 5);
              servicios.push({ _id: "extra", categoria: "..." });
            }
            fetch(`/personas/${user._id}/servicios/reservas/detalle/next`).then(
              (resp) => {
                resp.json().then((reservas) => {
                  let reserva = null;

                  setReservas(reservas);
                  console.log(reservas);

                  if (reservas.length > 0) {
                    reserva = reservas[0];
                    reserva.fechaInicio = new Date(reserva.fechaInicio);
                    reserva.fechaFin = new Date(reserva.fechaFin);
                    reserva.duracion =
                      (reserva.fechaFin.getTime() -
                        reserva.fechaInicio.getTime()) /
                      (1000 * 60);
                  }
                  setLastCommunication({
                    ...lastCommunication,
                    cita: reserva,
                    servicios: servicios,
                  });
                });
              }
            );
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user, lastCommunication]);

  return (
    <div className="App">
      <Sidebar />
      <div className="home">
        <div className="mainHomeTrabajador">
          <div className="mainHome-izq">
            <div className="bienvenida">
              <div className="textBienvenida">
                <h2>
                  <FormattedMessage id="Welcome" />
                </h2>
                <p>
                  <FormattedMessage id="beginExplore" />
                </p>
              </div>
              <div className="bloqueIl">
                <img
                  className="ilBienvenida"
                  src={bienvenido}
                  alt="Bienvenida"
                />
              </div>
            </div>
            {navigator.onLine ? (
              <div>
                {!lastCommunication.error ? (
                  <div className="card homeDetails">
                    <div className="cardTitle">
                      <h3>
                        <FormattedMessage id="NextWork" />
                      </h3>
                    </div>
                    <div
                      id="carouselExampleControls"
                      className="carousel slide"
                      data-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {reservas.map((item, key) => {
                          let classA = "";
                          if (key === 0) {
                            classA = "carousel-item active";
                          } else {
                            classA = "carousel-item";
                          }
                          return (
                            <div className={classA} key={key}>
                              <div className="cardIntHome">
                                <div className="bloqueBorder text-center">
                                  <h3>{darHora(item.fechaInicio)}</h3>
                                  <p>
                                    {darDuracion(
                                      item.fechaInicio,
                                      item.fechaFin
                                    ) + " min"}
                                  </p>
                                </div>
                                <div>
                                  <img
                                    className="imgTrabajador"
                                    src={avatarCliente}
                                    alt="Foto Cliente"
                                  />
                                </div>
                                <div className="bloqueTexto1">
                                  <h3>{item.persona.nombre}</h3>
                                </div>
                                <div className="bloqueTexto2">
                                  <h3>
                                    <FormattedDate
                                      value={darFecha(item.fechaInicio)}
                                      year="numeric"
                                      month="short"
                                      day="numeric"
                                      weekday="short"
                                    />
                                  </h3>
                                  <p>{item.persona.direccion}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <a
                        className="carousel-control-prev"
                        href="#carouselExampleControls"
                        role="button"
                        data-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">Previous</span>
                      </a>
                      <a
                        className="carousel-control-next"
                        href="#carouselExampleControls"
                        role="button"
                        data-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="sr-only">Next</span>
                      </a>
                    </div>
                    {/*<div className="cardIntHome">
                                        <div className="bloqueBorder text-center">
                                            <h3>{lastCommunication.cita.fechaInicio.getHours() + ":00"}</h3>
                                            <p>{lastCommunication.cita.duracion + " minutos"}</p>
                                        </div>
                                        <div>
                                            <img className="imgTrabajador" src={avatarCliente}
                                                 alt="Foto Cliente"/>
                                        </div>
                                        <div className="bloqueTexto">
                                            <h3>{lastCommunication.cita.persona.nombre}</h3>
                                        </div>
                                        <div className="bloqueTexto">
                                            <h3>{lastCommunication.cita.fechaInicio.toISOString().substring(0, 10)}</h3>
                                            <p>{lastCommunication.cita.persona.direccion}</p>
                                        </div>
                                    </div>*/}
                    <div className="cardButton">
                      <Link to="/citas">
                        <p>
                          <FormattedMessage id="VerCitas" />
                        </p>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="card homeDetails">
                    <div className="cardTitle">
                      <h3>
                        <FormattedMessage id="NextWork" />
                      </h3>
                    </div>
                    <div className="cardIntHome">
                      <img
                        className="emptyCitaIcon"
                        src={emptyCitas}
                        alt="Busqueda"
                      />
                      <div className="emptyHome">
                        <p>
                          <span>
                            <FormattedMessage id="NoWork" />
                          </span>
                        </p>
                        <p>
                          <FormattedMessage id="NoReserv" />
                        </p>
                      </div>
                    </div>
                    <div className="cardButton">
                      <Link to="/citas" className="disabled-link">
                        <p>
                          <FormattedMessage id="VerCitas" />
                        </p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card homeDetails">
                <div className="cardTitle">
                  <h3>
                    <FormattedMessage id="NextWork" />
                  </h3>
                </div>
                <div className="cardIntHome">
                  <img
                    className="emptyCitaIcon"
                    src={emptyCitas}
                    alt="Busqueda"
                  />
                  <div className="emptyHome">
                    <p>
                      <span>
                        Hubo un problema contactando al servidor, revisa tu
                        conexión e intentalo mas tarde
                      </span>
                    </p>
                  </div>
                </div>
                <div className="cardButton">
                  <Link to="/citas" className="disabled-link">
                    <p>
                      <FormattedMessage id="VerCitas" />
                    </p>
                  </Link>
                </div>
              </div>
            )}

            {navigator.onLine ? (
              <div>
                {lastCommunication.cita ? (
                  <div className="card homeDetails">
                    <div className="cardTitle">
                      <h3>
                        <FormattedMessage id="LastMessage" />
                      </h3>
                    </div>
                    <div className="cardIntHome">
                      <div>
                        <img
                          className="imgTrabajador"
                          src={lastCommunication.cita.fotoCliente}
                          alt="Foto Cliente"
                        />
                      </div>
                      <div className="bloqueBorder">
                        <h3>{lastCommunication.cita.persona}</h3>
                      </div>
                      <div className="bloqueMensaje">
                        <p className="horaMensaje">
                          {lastCommunication.cita.fechaUltimoMensaje}
                        </p>
                        <p>{lastCommunication.cita.ultimoMensaje}</p>
                      </div>
                    </div>
                    <div className="cardButton">
                      <Link to="/mensajes">
                        <p>
                          <FormattedMessage id="VerMensajes" />
                        </p>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="card homeDetails">
                    <div className="cardTitle">
                      <h3>
                        <FormattedMessage id="LastMessage" />
                      </h3>
                    </div>
                    <div className="cardIntHome">
                      <img
                        className="emptyCitaIcon"
                        src={emptyMensajes}
                        alt="Mensaje"
                      />
                      <div className="emptyHome">
                        <p>
                          <span>
                            <FormattedMessage id="NoMess" />
                          </span>
                        </p>
                        <p>
                          <FormattedMessage id="Chat" />
                        </p>
                      </div>
                    </div>
                    <div className="cardButton">
                      <Link to="/mensajes" className="disabled-link">
                        <p>
                          <FormattedMessage id="VerMensajes" />
                        </p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card homeDetails">
                <div className="cardTitle">
                  <h3>
                    <FormattedMessage id="LastMessage" />
                  </h3>
                </div>
                <div className="cardIntHome">
                  <img
                    className="emptyCitaIcon"
                    src={emptyMensajes}
                    alt="Mensaje"
                  />
                  <div className="emptyHome">
                    <p>
                      <span>
                        Hubo un problema contactando al servidor, revisa tu
                        conexión e intentalo mas tarde
                      </span>
                    </p>
                  </div>
                </div>
                <div className="cardButton">
                  <Link to="/mensajes" className="disabled-link">
                    <p>
                      <FormattedMessage id="VerMensajes" />
                    </p>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {user.rol === ROLES.TRABAJADOR ? (
            <div className="mainHome-der">
              <div className="perfil-main-persona">
                <img className="imagen" src={avatarTrabajador} alt="Foto" />
                <h3>{user.nombre}</h3>
              </div>
              <div className="perfil-home-informacion">
                <p>
                  <FormattedMessage id="MyServs" />
                </p>
                {navigator.onLine ? (
                  <div className="perfil-home-informacionDetail">
                    {lastCommunication.servicios.length > 0 ? (
                      lastCommunication.servicios.map((item) => {
                        return (
                          <p key={item._id}>
                            <FormattedMessage id={item.categoria} />
                          </p>
                        );
                      })
                    ) : (
                      <div className="emptyPage">
                        <img
                          className="emptyIcon"
                          src={emptyIcon}
                          alt="No Found"
                        />
                        <p>
                          <FormattedMessage id="NoServicesAdded" />
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="emptyPage">
                    <img className="emptyIcon" src={emptyIcon} alt="No Found" />
                    <p>
                      Hubo un problema contactando al servidor, revisa tu
                      conexión e intentalo mas tarde
                    </p>
                  </div>
                )}
              </div>
              {lastCommunication.servicios.length > 0 ? (
                <div className="buttonPerfilHome">
                  <Link to="/perfil">
                    <span>
                      <FormattedMessage id="VerTodos" />
                    </span>
                  </Link>
                </div>
              ) : (
                <div />
              )}
            </div>
          ) : (
            <div className="mainHome-der">
              <p className="mainHome-der-frase">
                <FormattedMessage id="FindBetter" />
              </p>
              <div className="mainHome-der-oferta">
                <div className="row serItem">
                  <img className="imgSerHome" src={serHome1} alt="Servicio 1" />
                  <p>
                    <FormattedMessage id="Carpintería" />
                  </p>
                </div>
                <div className="row serItem">
                  <img className="imgSerHome" src={serHome2} alt="Servicio 2" />
                  <p>
                    <FormattedMessage id="Electricista" />
                  </p>
                </div>
                <div className="row serItem">
                  <img className="imgSerHome" src={serHome3} alt="Servicio 3" />
                  <p>
                    <FormattedMessage id="Jardinería" />
                  </p>
                </div>
                <div className="row serItem">
                  <img className="imgSerHome" src={serHome4} alt="Servicio 4" />
                  <p>
                    <FormattedMessage id="Mascotas" />
                  </p>
                </div>
                <div className="row serItem">
                  <img className="imgSerHome" src={serHome5} alt="Servicio 5" />
                  <p>
                    <FormattedMessage id="Pintura" />
                  </p>
                </div>
              </div>
              <div className="buttonHome">
                <Link to="/services">
                  <span>
                    <FormattedMessage id="VerTodos" />
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    );
}

export default Inicio;
