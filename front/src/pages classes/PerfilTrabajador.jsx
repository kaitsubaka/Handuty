import React from "react";
import "../pages/PerfilTrabajador.css";
import {Link, Redirect} from "react-router-dom";
//import fotoPrueba from "../recursos/FotoPrueba1.png";
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import SidebarTrabajador from "../components/SidebarTrabajador";
import editIcon from "../recursos/perfilEditIcon.svg"
import addIcon from "../recursos/addIcon.svg"
import deleteIcon from "../recursos/deleteIcon.svg"
import califIcon from "../recursos/califIcon.svg";
//import usersIcon from "../recursos/usersIcon.svg";
import {appContext} from "../context/AppContext";
import emptyIcon from "../recursos/emptyIcon.svg"


class PerfilTrabajador extends React.Component {
    constructor(props) {
        super(props);
        this.state = {servicios: []};
        this.deleteServicio = this.deleteServicio.bind(this);
    }

    componentDidMount() {
        if (!this.context.user._id) return;
        fetch(`/trabajadores/${this.context.user._id}/servicios`).then(resp => {
            resp.json().then(servicios => {
                this.setState({servicios: servicios});
            })
        })
    }

    deleteServicio(event) {
        fetch("/servicios/" + event.target.id, {method: 'DELETE'}).then(() => {
            this.setState({servicios: this.state.servicios.filter(servicio => servicio._id !== event.target.id)})
        });
    }

    render() {
        if (!this.context.user._id) return <Redirect to='/'/>;
        return (
            <div className="App">
                <SidebarTrabajador/>
                <div className="perfil">
                    <div className="perfil-title">
                        <h2>Perfil</h2>
                    </div>
                    <div className="perfil-main">
                        <div className="mainHome-der">
                            <div className="perfil-main-persona">
                                <img className="imagen" src={avatarTrabajador} alt="Foto"/>
                                <h3>{this.context.user.nombre}</h3>
                            </div>
                            <div className="perfil-main-informacion">
                                <p>Información</p>
                                <div className="perfil-main-informacionDetail">
                                    <p><span>Tel</span> {this.context.user.telefono}</p>
                                    <p><span>Cédula</span> {this.context.user.cedula}</p>
                                    <p>
                                        <span>Fec nac.</span> {new Date(this.context.user.fechaNacimiento).toISOString().substring(0, 10)}
                                    </p>
                                </div>
                            </div>
                            <div className="buttonPerfil">
                                <Link to="/serviciosCliente">
                                    <span>Modificar</span>
                                </Link>
                            </div>

                        </div>
                        <div className="perfilMain-servicios">
                            <div className="perfilMain-servicios-title">
                                <h3>Mis Servicios</h3>
                                <p>Aquí podrás ver y manejar los servicios que ofrecer a los clientes.</p>
                            </div>
                            <hr/>
                            {
                                this.state.servicios.length > 0 ?
                                    this.state.servicios.map(servicio => {
                                        return (
                                            <div key={servicio._id} className="servicioDetailPerfil">
                                                <div className="servicioDetailPerfil-primera">
                                                    <p>{servicio.categoria}</p>
                                                    <div className="servicioDetailIconos">
                                                        <Link to="/homeTrabajador">
                                                            <img className="iconPerfil" src={editIcon} alt="Editar"/>
                                                        </Link>
                                                        <img className="iconPerfil" id={servicio._id}
                                                             onClick={this.deleteServicio} src={deleteIcon}
                                                             alt="Eliminar"/>
                                                    </div>
                                                </div>
                                                <div className="servicioDetailPerfil-segunda">
                                                    <img className="iconPerfil" src={califIcon} alt="Estrella"/>
                                                    <p>{servicio.calificacion}</p>
                                                    {/*<img className="iconPerfil" src={usersIcon} alt="Usuarios" />/*}
                                            {/*<p>78 servicios</p>*/}
                                                    <p className="costo">Costo</p>
                                                    <p>${servicio.precio}/hora</p>
                                                </div>
                                                <hr/>
                                            </div>
                                        )
                                    })

                                    :
                                    <div className="emptyPage">
                                        <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                        <p className="emptyPage-bold">No has agregado ningún servicio</p>
                                        <p>¡Da el primer paso, es muy fácil!</p>
                                    </div>


                            }
                            <div className="perfilMain-servicios-boton">
                                <Link to="/crearServicio">

                                    <img className="iconPerfil" src={addIcon} alt="Agregar"/>
                                    <p>Agregar Servicio</p>

                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PerfilTrabajador.contextType = appContext;

export default PerfilTrabajador;