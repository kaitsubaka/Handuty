import { DATOS_SIDEBAR_CLIENTE, DATOS_SIDEBAR_TRABAJADOR } from '../constants/DatosSideBar';
import React, {useContext, useEffect} from 'react'
import logo from "../recursos/logoBar.png";
import logout from "../recursos/logoutBar.svg";
import {NavLink,Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl'
import {appContext} from "../context/AppContext";
import { ROLES } from '../constants/Roles';
import "./Sidebar.css";
import { useState } from 'react';

function Sidebar() {

    const context = useContext(appContext);
    const  handleLogout = () => context.logoutUser();
    const [SideBarData, setSideBarData] = useState([])

    useEffect(()=>{
    switch(context.user.rol){
        case ROLES.TRABAJADOR:
            setSideBarData(DATOS_SIDEBAR_TRABAJADOR);
            break;
        case ROLES.CLIENTE:
            setSideBarData(DATOS_SIDEBAR_CLIENTE);
            break;
        default:
            setSideBarData([])
    }
    },[context.user])
    

    return (
        <>
            <div className="Sidebar">
                <div className="logobar">
                    <Link to="/home">
                    <h1>
                        <img className="logoimg" src={logo} alt="Lago Handuty"/>
                    </h1>
                    </Link>
                </div>
                <div className="menubar">
                    <ul className="bar-items">
                        {SideBarData.map((item, index) => {
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

export default Sidebar
