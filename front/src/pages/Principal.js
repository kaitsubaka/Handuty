import React,  {useContext} from "react";
import {appContext} from "../context/AppContext";
import {Link} from "react-router-dom";
import logo from "../recursos/logoBar.png";
import principal from "../recursos/principal.svg";
import user from "../recursos/perfilBar.svg";
import work from "../recursos/trabajador.svg";
import "./Principal.css";
import Graph from "../components/Graph";
import {FormattedMessage, useIntl} from "react-intl";


function Principal() {

    const intl = useIntl();

    const context = useContext(appContext);


    function handleLogout(){
        context.logoutUser();
    }

    return (
        <div className="Principal">
            <div className="principal-banner">
                <div className="principal-bar">
                    <h1>
                        <img className="logoPrincipal" src={logo} alt="Logo Handuty"/>
                    </h1>
                    {context.user._id ? (
                        context.user.isTrabajador === false ? (
                        <div className="principal-bar-izq">
                            <Link to="/homeCliente">
                                <p>Home</p>
                            </Link>
                            <Link to="/serviciosCliente">
                                <p>Servicios</p>
                            </Link>
                            <Link to="/citasCliente">
                                <p>{intl.formatMessage({id:"citas"})}</p>
                            </Link>
                        </div>): (
                        <div className="principal-bar-izq">
                            <Link to="/homeTrabajador">
                                <p>Home</p>
                            </Link>
                            <Link to="/perfilTrabajador">
                                <p>{intl.formatMessage({id:"Profile"})}</p>
                            </Link>
                            <Link to="/citasTrabajador">
                                <p>{intl.formatMessage({id:"citas"})}</p>
                            </Link>
                        </div>
                        )

                    ) : (
                        <div></div>
                    )}
                    {context.user._id ? (
                        <div className="principal-bar-der" onClick={handleLogout}>
                            <a >
                                <p>{intl.formatMessage({id:"exit"})}</p>
                            </a>
                        </div>
                        
                    ):(
                        <div className="principal-bar-der">
                            <Link to="/login">
                                <p>{intl.formatMessage({id:"Login"})}</p>
                            </Link>
                            <Link to="/registro">
                                <p>{intl.formatMessage({id:"Register"})}</p>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="principal-cont">
                    <div className="principal-cont-izq">
                        <h2>{intl.formatMessage({id:"TrabajemosJuntos"})}</h2>
                        <p>{intl.formatMessage({id:"TextoPresentacion"})}</p>
                    </div>
                    <div className="principal-cont-der">
                        <img className="principal-cont-il" src={principal} alt="Ilustracion Handuty"/>
                    </div>
                </div>
            </div>
            <div className="principal-segundo">
                <div className="principal-segundo-izq">
                    <img className="iconPrincipal" src={user} alt="Logo Handuty"/>
                    <p className="principal-segundo-der-prin">{intl.formatMessage({id:"ClientePrincipal"})}</p>
                    <p>{intl.formatMessage({id:"ClientePrincipalTexto"})}</p>
                </div>
                <div className="principal-segundo-der">
                    <img className="iconPrincipal" src={work} alt="Logo Handuty"/>
                    <p className="principal-segundo-der-prin">{intl.formatMessage({id:"TrabajadorPrincipal"})}</p>
                    <p>{intl.formatMessage({id:"TrabajadorPrincipalTexto"})}</p>
                </div>
            </div>
            <div className="principal-tercero">
                <div className="principal-tercero-txt">
                    <p className="principal-tercero-txt-prin">{intl.formatMessage({id:"Descubre"})}</p>
                    <p>{intl.formatMessage({id:"DescubreText"})}</p>
                </div>
                <Graph/>
            </div>
        </div>
    )
}

export default Principal
