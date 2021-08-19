import React, {useContext} from "react";
import {userContext} from "../context/User";
import ilCarpinteria from "../recursos/ilCarpinteria.svg";
import ilCerrajeria from "../recursos/ilCerrajeria.svg";
import ilElectricista from "../recursos/ilElectricista.svg";
import ilFumigacion from "../recursos/ilFumigacion.svg";
import ilJardineria from "../recursos/ilJardineria.svg";
import ilLimpieza from "../recursos/ilLimpieza.svg";
import ilMascotas from "../recursos/ilMascotas.svg";
import ilMantenimiento from "../recursos/ilMantenimiento.svg";
import ilPintura from "../recursos/ilPintura.svg";
import ilPlomeria from "../recursos/ilPlomeria.svg";
import ilSeguridad from "../recursos/ilSeguridad.svg";
import ilTodos from "../recursos/ilTodos.svg";
import {Link, Redirect} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Search from "../components/Search";
import "./Servicios.css";
import {FormattedMessage} from 'react-intl'

const categories = [{categoria: "Carpintería", img: ilCarpinteria},
    {categoria: "Cerrajería", img: ilCerrajeria},
    {categoria: "Electricista", img: ilElectricista},
    {categoria: "Fumigación", img: ilFumigacion},
    {categoria: "Jardinería", img: ilJardineria},
    {categoria: "Limpieza", img: ilLimpieza},
    {categoria: "Mascotas", img: ilMascotas},
    {categoria: "Mantenimiento", img: ilMantenimiento},
    {categoria: "Pintura", img: ilPintura},
    {categoria: "Plomería", img: ilPlomeria},
    {categoria: "Seguridad", img: ilSeguridad},
    {categoria: "VerTodos", img: ilTodos}];

function Servicios(props){

    const context = useContext(userContext);

    if (!context.user._id) return <Redirect to='/'/>;

    return (
        <div className="App">
            <Sidebar/>
            <div className="servicios">
                <Search/>
                <div className="row mainServicios">
                    {categories.map(
                        (item, key) => {
                            return (<div key={key} className="col colServicio">
                                <div className="card">
                                    <Link to={{pathname: "/serviciosDetail", categoria: item.categoria}}>
                                        <div className="cardInt">
                                            <img className="card-img-top" src={item.img} alt="Carpinteria"/>
                                        </div>
                                    </Link>
                                    <Link to={{pathname: "/serviciosDetail", categoria: item.categoria}}>
                                        <div className="card-body">
                                            <h2 className="card-title text-center"><FormattedMessage id={item.categoria}/></h2>
                                        </div>
                                    </Link>
                                </div>
                            </div>)
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Servicios;