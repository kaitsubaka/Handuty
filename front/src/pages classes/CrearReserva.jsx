import React from "react";
import "../pages/CrearServicio.css";
import Sidebar from "../components/Sidebar";
import flecha from "../recursos/arrowIcon.svg";
import {Link} from "react-router-dom";

class CrearReserva extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fechaInicio: "",
            horaInicio: "",
            precio: props.location.servicio.precio,
            servicio: props.location.servicio.id,
            cliente: props.location.user,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        // let fecha = new Date(this.state.fechaInicio)
        // let hours = this.state.horaInicio.split(':')
        // fecha.setHours(parseInt(hours[0]), parseInt(hours[1]), 0)
        let fecha = new Date(this.state.fechaInicio + " " + this.state.horaInicio);
        let hours = this.state.horaInicio.split(":");
        let minutes = (parseInt(hours[1]) + 30) % 60;
        let hour = parseInt(hours[1]) + 30 > 60 ? parseInt(hours[0]) + 1 : hours[0];
        let horaFin = hour + ":" + minutes;
        let fechaFin = new Date(this.state.fechaInicio + " " + horaFin);

        const content = {
            fechaInicio: fecha,
            fechaFin: fechaFin,
            precio: this.state.precio,
            servicio: this.state.servicio,
            cliente: this.state.cliente,
        };

        fetch(`/reservas`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(content),
        }).then((data) => {
            this.props.history.push("/citasCliente");
        });


        event.preventDefault();
    }

    render() {
        return (
            <div className="App">
                <Sidebar/>
                <div className="formServicio">
                    <div className="formServicio-title">
                        <Link to="/serviciosCliente">
                            <img className="arrowImgForm" src={flecha} alt="Flecha"/>
                        </Link>
                        <div className="formServicio-title-txt">
                            <h2>Reservar una cita</h2>
                            <p>Aquí puede solicitar una cita para un servicio general.</p>
                        </div>
                    </div>
                    <div className="formServicio-main">
                        <form className="formDetailCita" onSubmit={this.handleSubmit}>
                            <label htmlFor="fechaInicio">Fecha de inicio</label>
                            <input
                                type="date"
                                min="2018-04-18"
                                value={this.state.value}
                                name="fechaInicio"
                                onChange={this.handleChange}
                            />
                            <label htmlFor="horaInicio">Hora de inicio</label>
                            <input
                                type="time"
                                value={this.state.value}
                                name="horaInicio"
                                onChange={this.handleChange}
                            />
                            <div className="bloqueBotonesCita">
                                <button type="button" className="cancelButton" onClick={this.props.handleClose}>
                                    Cancelar
                                </button>
                                <input type="submit" value="Reservar"/>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        );
        //     "fechaInicio": "{{fechaInicio_reserva}}",
        // "fechaFin":"{{fechaFin_reserva}}",
        // "calificacion":"{{calificacion_reserva}}",
        // "precio":"{{precio_reserva}}",
        // "servicio":"{{id_servicio}}",
        // "cliente":"{{id_cliente}}"
    }
}

export default CrearReserva;
