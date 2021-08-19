import {userContext} from "../context/User";
import {useContext} from "react";
import {Link} from "react-router-dom";
import logo from "../recursos/logoBar.png";
import principal from "../recursos/principal.svg";
import work from "../recursos/trabajador.svg";
import Graph from "../components/Graph";
import {useIntl} from "react-intl";
import "./Principal.css";


function Principal() {

    const intl = useIntl();

    const user = useContext(userContext);

    const handleLogout = user.logout;

    return (
        <div className="Principal">
            <div className="principal-banner">
                <div className="principal-bar">
                    <h1>
                        <img className="logoPrincipal" src={logo} alt="Logo Handuty"/>
                    </h1>
                    {user._id && (
                        <div className="principal-bar-izq">
                            <Link to="/home">
                                <p>Home</p>
                            </Link>
                            <Link to="/services">
                                <p>Servicios</p>
                            </Link>
                            <Link to="/apointments">
                                <p>{intl.formatMessage({id:"citas"})}</p>
                            </Link>
                        </div>) }
                    {user._id ? (
                        <div className="principal-bar-der" onClick={handleLogout}>
                                <p>{intl.formatMessage({id:"exit"})}</p>
                        </div>
                        
                    ):(
                        <div className="principal-bar-der">
                            <Link to="/login">
                                <p>{intl.formatMessage({id:"Login"})}</p>
                            </Link>
                            <Link to="/register">
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
