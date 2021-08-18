import React, {useContext} from 'react'
import "./Sidebar.css";
import logo from "../recursos/logoBar.png";
import logout from "../recursos/logoutBar.svg";
import {SidebarDataTrabajador} from "./SidebarDataTrabajador";
import {NavLink} from 'react-router-dom';
import {appContext} from "../context/AppContext";
import {FormattedMessage} from 'react-intl'
import {Link} from "react-router-dom";


function SidebarTrabajador(props) {

    const context = useContext(appContext)


    function handleLogout(){
        context.logoutUser();
    }


    return (
        <>
            <div className="Sidebar">
                <div className="logobar">
                <Link to="/homeTrabajador">
                    <h1>
                        <img className="logoimg" src={logo} alt="Lago Handuty"/>
                    </h1>
                </Link>
                </div>
                <div className="menubar">
                    <ul className="bar-items">
                        {SidebarDataTrabajador.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <NavLink to={item.path} activeStyle={{color: "#cccccc"}}>
                                        <img className="iconItems" src={item.icon} alt={item.title + "icon"}/>
                                        <span><FormattedMessage id={item.title}/></span>
                                    </NavLink>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="outbar">
                    <ul className="bar-items">
                        <li className="bar-text" onClick={handleLogout}>
                            <NavLink to="/">
                                <img className="iconItems" src={logout} alt="Icono Logout"/>
                                <span><FormattedMessage id="exit"/></span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default SidebarTrabajador
