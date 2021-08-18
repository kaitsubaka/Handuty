import React, {useContext, useEffect, useState} from "react";
import {appContext} from "../context/AppContext";
import {Link, Redirect} from "react-router-dom";
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import editIcon from "../recursos/perfilEditIcon.svg";
import deleteIcon from "../recursos/deleteIcon.svg";
import califIcon from "../recursos/califIcon.svg";
import emptyIcon from "../recursos/emptyIcon.svg";
import addIcon from "../recursos/addNuevo.svg";
import "./PerfilTrabajador.css";
import {FormattedMessage, FormattedDate} from 'react-intl'
import Sidebar from "../components/Sidebar";

function PerfilTrabajador(props){

    const context = useContext(appContext);

    const [state, setState] = useState({servicios: []});

    useEffect(()=>{
        if (!context.user._id) return;
        fetch(`/trabajadores/${context.user._id}/servicios`).then(resp => {
            resp.json().then(servicios => {
                setState({...state, servicios: servicios});
            })
        })
    }, [])

    function deleteServicio(event) {
        fetch("/servicios/" + event.target.id, {method: 'DELETE'}).then(() => {
            setState({...state, servicios: state.servicios.filter(servicio => servicio._id !== event.target.id)})
        });
    }

    if (!context.user._id) return <Redirect to='/'/>;

    return (
        <div className="App">
            <Sidebar/>
            <div className="perfil">
                <div className="perfil-title">
                    <h2><FormattedMessage id="Profile"/></h2>
                </div>
                <div className="perfil-main">
                    <div className="mainHome-der">
                        <div className="perfil-main-persona">
                            <img className="imagen" src={avatarTrabajador} alt="Foto"/>
                            <h3>{context.user.nombre}</h3>
                        </div>
                        <div className="perfil-main-informacion">
                            <p><FormattedMessage id="Information"/></p>
                            <div className="perfil-main-informacionDetail">
                                <p><span><FormattedMessage id="Tel"/></span> {context.user.telefono}</p>
                                <p><span><FormattedMessage id="idNumber"/></span> {context.user.cedula}</p>
                                <p>
                                    <span><FormattedMessage id="FecNac"/></span> <FormattedDate
                                        value = {new Date(context.user.fechaNacimiento).toISOString().substring(0, 10)}
                                        year='numeric'
                                        month='short'
                                        day='numeric'
                                    />
                                </p>
                            </div>
                        </div>
                        <div className="buttonPerfil">
                            <Link to="/serviciosCliente">
                                <span><FormattedMessage id="Modify"/></span>
                            </Link>
                        </div>

                    </div>
                    <div className="perfilMain-servicios">
                        <div className="perfilMain-servicios-title">
                            <h3><FormattedMessage id="MyServs"/></h3>
                            <p><FormattedMessage id="HereYou"/></p>
                        </div>
                        <hr/>
                        {navigator.onLine ? (
                            <div>
                            {
                                state.servicios.length > 0 ?
                                    state.servicios.map(servicio => {
                                        return (
                                            <div key={servicio._id} className="servicioDetailPerfil">
                                                <div className="servicioDetailPerfil-primera">
                                                    <p>{servicio.categoria}</p>
                                                    <div className="servicioDetailIconos">
                                                        <Link to="/homeTrabajador">
                                                            <img className="iconPerfil" src={editIcon} alt="Editar"/>
                                                        </Link>
                                                        <img className="iconPerfil" id={servicio._id}
                                                             onClick={deleteServicio} src={deleteIcon}
                                                             alt="Eliminar"/>
                                                    </div>
                                                </div>
                                                <div className="servicioDetailPerfil-segunda">
                                                    <img className="iconPerfil" src={califIcon} alt="Estrella"/>
                                                    <p>{servicio.calificacion}</p>
                                                    {/*<img className="iconPerfil" src={usersIcon} alt="Usuarios" />/*}
                                                {/*<p>78 servicios</p>*/}
                                                    <p className="costo"><FormattedMessage id="Cost"/></p>
                                                    <p>${servicio.precio}/<FormattedMessage id="Hour"/></p>
                                                </div>
                                                <hr/>
                                            </div>
                                        )
                                    })
    
                                    :
                                    <div className="emptyPage">
                                        <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                        <p className="emptyPage-bold"><FormattedMessage id="NoServicesAdded"/></p>
                                        <p><FormattedMessage id="FirstStep"/></p>
                                    </div>
    
    
                            }
                            </div>
                        )
                        :
                                    <div className="emptyPage">
                                        <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                        <p className="emptyPage-bold">Hubo un problema contactando al servidor, revisa tu conexión e intentalo mas tarde</p>
                                        <p><FormattedMessage id="FirstStep"/></p>
                                    </div>
                        }
                        
                        <div className="perfilMain-servicios-boton">
                            <Link to="/crearServicio">

                                <img className="iconPerfil" src={addIcon} alt="Agregar"/>
                                <p><FormattedMessage id="AddServ"/></p>

                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilTrabajador;