import React, {useContext} from 'react'
import "./Sidebar.css";
import logo from "../recursos/logoBar.png";
import logout from "../recursos/logoutBar.svg";
import {SidebarDataCliente} from "./SidebarDataCliente";
import {NavLink} from 'react-router-dom';
import {FormattedMessage} from 'react-intl'
import {appContext} from "../context/AppContext";
import {Link} from "react-router-dom";

function Sidebar() {

    const context = useContext(appContext);

    function handleLogout(){
        context.logoutUser();
    }

    return (
        <>
            <div className="Sidebar">
                <div className="logobar">
                    <Link to="/homeCliente">
                    <h1>
                        <img className="logoimg" src={logo} alt="Lago Handuty"/>
                    </h1>
                    </Link>
                </div>
                <div className="menubar">
                    <ul className="bar-items">
                        {SidebarDataCliente.map((item, index) => {
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
