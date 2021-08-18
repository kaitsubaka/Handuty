import React from "react";
import "../pages/Citas.css";
import {Link, Redirect} from "react-router-dom";
//import fotoPrueba from "../recursos/FotoPrueba1.png"
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import qrIcon from "../recursos/qrIcon.svg"
import messageIcon from "../recursos/messageIcon.svg"
import cancelIcon from "../recursos/cancelIcon.svg"
import Sidebar from "../components/Sidebar";
import { appContext } from "../context/AppContext";
import emptyIcon from "../recursos/emptyIcon.svg"



class CitasClienteClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = { citas: [] };
        this.delete = this.delete.bind(this);
    }

    delete(event){
        fetch(`/reservas/${event.target.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).then(res => console.log(res))
        let copiaCitas = this.state.citas
        const index = copiaCitas.findIndex(cita => cita.id === event.target.id)

        copiaCitas.splice(index, 1)
        this.setState({ citas: copiaCitas })
    }

    componentDidMount() {
        if(!this.context.user._id) return ;
        // cuando el componente entra
        fetch(`/clientes/${this.context.user._id}/reservas/detalle/next`, { method: 'GET', headers: { 'Content-Type': 'application/json' } }).then(
            res => res.json()
        ).then(reservas => {
            if (reservas.length === 0) { return this.setState({ errorCita: 'No hay citas agendadas para el usuario' }) }
            
            let citasTmp = []
            for (let i = 0; i < reservas.length; i++) {
                const tmp = reservas[i];
                const tmpDate = new Date(tmp.fechaInicio)
                let cita = {
                    duracion: '30 minutos',
                    direccion: this.context.user.direccion,
                    fotoTrabajador: avatarTrabajador,
                }
                cita.id = tmp._id
                cita.horaInicio = tmpDate.getHours() + ':' + (tmpDate.getMinutes()<10?'0':'') + tmpDate.getMinutes()
                cita.fecha = tmpDate.getFullYear() + ' ' + tmpDate.getMonth() + ' ' + tmpDate.getDate()
                cita.categoria = tmp.servicio.categoria
                cita.trabajador = tmp.servicio.trabajador.nombre
                cita.precio = tmp.servicio.precio
                citasTmp.push(cita)
            }
            this.setState({ citas: citasTmp })
        })
    }
    render() {
        if(!this.context.user._id) return <Redirect to='/'  />;
        return (
            <div className="App">
                <Sidebar />
                <div className="citas">
                    <div className="title">
                        <h2>Citas</h2>
                        <p>Aquí encontrarás todas las citas que has programado.</p>
                    </div>
                    { this.state.citas.length===0? 
                            <div className="emptyPage">
                                <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                <p className="emptyPage-bold">¡Todavía no tienes ninguna cita!</p>
                                <p>Corre a ver los <Link to="/serviciosCliente"> <span>servicios</span></Link> disponibles</p>
                            </div>
                        :this.state.citas.map((item, key) => {
                        return (
                            <div key={key} className="citasDetail">
                        <div className="card cardCita">
                            <div className="cardIntCitas">
                                <div className="cardPrincipal">
                                    <div className="bloqueBorderCitas text-center">
                                        <h3>{item.horaInicio}</h3>
                                        <p>30 minutos</p>
                                    </div>
                                    <div>
                                        <img className="imgTrabajadorCitas" src={avatarTrabajador} alt="Foto Trabajador" />
                                    </div>
                                    <div className="bloqueTrabajadorCitas">
                                        <h3>{item.trabajador}</h3>
                                        <p>{item.categoria}</p>
                                    </div>
                                    <div className="bloqueTextoCitas">
                                        <h3>{item.fecha}</h3>
                                        <p>{item.direccion}</p>
                                        <p>$ {item.precio}k</p>
                                    </div>
                                </div>
                                <div className="bloqueIconosCitas">
                                    <Link to="/citasCliente">
                                        <img className="iconCitas" src={qrIcon} alt="Icono QR" />
                                    </Link>
                                    <Link to="/citasCliente">
                                        <img className="iconCitas" src={messageIcon} alt="Icono Mensaje" />
                                    </Link>
                                    <Link to="/citasCliente" onClick = {this.delete}>
                                        <img id={item.id} className="iconCitas" src={cancelIcon} alt="Icono Eliminar" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                        )
                    })}
                    
                </div>
            </div>
        );
    }
}
CitasClienteClass.contextType = appContext
export default CitasClienteClass;
