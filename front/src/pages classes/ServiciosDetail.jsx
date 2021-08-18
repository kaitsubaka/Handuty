import React from 'react'
import "../pages/ServiciosDetail.css";
import Search from "../components/Search";
import {Link, Redirect} from "react-router-dom";
import flecha from "../recursos/arrowIcon.svg";
import califIcon from "../recursos/califIcon.svg";
import usersIcon from "../recursos/usersIcon.svg";
import fotoPrueba from "../recursos/FotoPrueba1.png"
import Sidebar from '../components/Sidebar';
import {appContext} from "../context/AppContext";


class ServiciosDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {servicios: [], show: true, modalContext: {servicio: {}, user: ""}};
    }

    componentDidMount() {
        if (!this.context.user._id) return;
        if (this.props.location.categoria === 'Ver todos') {
            fetch(`/servicios/detalle`, {method: 'GET', headers: {'Content-Type': 'application/json'}}).then(
                res => res.json()
            ).then(servicios => {


                let serviciosTmp = []
                for (let i = 0; i < servicios.length; i++) {
                    const tmp = servicios[i];
                    let servicio = {}
                    servicio.nombreTrabajador = tmp.trabajador.nombre;
                    servicio.calificacion = tmp.calificacion
                    servicio.precio = tmp.precio
                    servicio.categoria = tmp.categoria
                    servicio.id = tmp._id
                    serviciosTmp.push(servicio)

                }
                this.setState({servicios: serviciosTmp})
            })
        } else {
            fetch(`/servicios/categorias/${this.props.location.categoria}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(
                res => res.json()
            ).then(servicios => {


                let serviciosTmp = []
                for (let i = 0; i < servicios.length; i++) {
                    const tmp = servicios[i];
                    let servicio = {}
                    servicio.nombreTrabajador = tmp.trabajador.nombre;
                    servicio.calificacion = tmp.calificacion
                    servicio.precio = tmp.precio
                    servicio.categoria = tmp.categoria
                    servicio.id = tmp._id
                    serviciosTmp.push(servicio)
                }
                this.setState({servicios: serviciosTmp})
            })
        }


    }

    render() {
        if (!this.context.user._id) return <Redirect to='/'/>;
        return (
            <div className="App">
                <Sidebar/>
                <div className="serviciosDetail">
                    <Search/>
                    <div className="mainServiciosDetail">
                        <div className="serviceDetailTitle">
                            <Link to="/serviciosCliente">
                                <img className="arrowImg" src={flecha} alt="Flecha"/>
                            </Link>
                            <h2>{this.props.location.categoria}</h2>
                        </div>
                        <div className="row">


                            {this.state.servicios.map((item, key) => {
                                return (<div className="card text-center" key={key}>
                                    <div className="card-body cardDetail">
                                        <div className="cardDetail-nombre">
                                            <img className="imgTrabajadorDetail" src={fotoPrueba} alt="Foto Trabajdor"/>
                                            <p>{item.nombreTrabajador}</p>
                                        </div>
                                        <hr/>
                                        <div className="cardDetail-datos">
                                            <div className="cardDetail-datos-primera">
                                                <img className="detailIcon" src={califIcon} alt="Estrella"/>
                                                <p>{item.calificacion}</p>
                                                <img className="detailIcon" src={usersIcon} alt="Usuarios"/>
                                                <p>78 servicios</p>
                                            </div>
                                            <div className="cardDetail-datos-segunda">
                                                <p>$ {item.precio}/hora</p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="buttonCita">
                                            <Link to={{
                                                pathname: "/reservar",
                                                servicio: item,
                                                user: this.context.user._id
                                            }}>
                                                <p>Solicitar cita</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>)
                            })}


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ServiciosDetail.contextType = appContext;
export default ServiciosDetail
