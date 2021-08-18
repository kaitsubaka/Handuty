import React from 'react'
import "../pages/Login.css";
import {Link, withRouter} from "react-router-dom";
import ilLogin from "../recursos/ilLogin.svg";
import logoLogin from "../recursos/logoLogin.png";

import {appContext} from '../context/AppContext';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: {correo: "", contrasena: "", tipo: "cliente"}, show: false};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal() {
        this.setState({show: true});
    };

    hideModal() {
        this.setState({show: false});
    };


    handleInputChange(event) {
        this.setState({login: {...this.state.login, [event.target.name]: event.target.value}});
    }

    handleSubmit(event) {
        event.preventDefault();
        const input = {
            correo: this.state.login.correo,
            contrasena: this.state.login.contrasena
        }
        if (this.state.login.tipo === "trabajador") {
            fetch("/trabajadores/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input)
            }).then(res => {
                if (res.status !== 202) return alert("El correo o constraseña parecen ser incorrectos.");
                res.json().then(trabajador => {
                    trabajador.isTrabajador = true;
                    this.context.loginUser(trabajador);
                    this.props.history.push("/homeTrabajador");
                });
            }).catch(err => {
                console.log(err);
            });
        } else {
            fetch("/clientes/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(input)
            }).then(res => {
                if (res.status !== 202) return alert("El correo o constraseña parecen ser incorrectos.");
                res.json().then(cliente => {
                    cliente.isTrabajador = false;
                    this.context.loginUser(cliente);
                    this.props.history.push("/homeCliente");
                });
            }).catch(err => {
                console.log(err);
            });
        }
    }

    componentDidMount() {

    }


    render() {


        return (
            <div className="login">
                <div className="login-izq">
                    <div className="login-izq-content">
                        <img className="logoLogin" src={logoLogin} alt="Logo Handuty"/>
                        <form className="login-izq-inputs">
                            <p>Correo electrónico</p>
                            <input type="text" id="inputText1" name="correo" onChange={this.handleInputChange}/>
                            <p>Contraseña</p>
                            <input type="password" id="inputText2" name="contrasena" onChange={this.handleInputChange}/>
                            <select defaultValue="cliente" id="inputState" className="form-control" name="tipo"
                                    onChange={this.handleInputChange}>
                                <option value="trabajador">Trabajador</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </form>
                        <button className="botonLogin" onClick={this.handleSubmit}>
                            <span>Iniciar Sesión</span>
                        </button>
                        <div className="preguntaRegistro">
                            <p>¿No tienes una cuenta? <Link to="/registro"> <span>Regístrate</span></Link></p>
                        </div>
                    </div>
                </div>
                <div className="login-der">
                    <div className="slogan">
                        <h3>Encuentra <span>personal</span> capacitado en <span>servicios generales</span> de forma
                            rápida, fácil y segura</h3>
                    </div>
                    <img className="ilLogin" src={ilLogin} alt="Ilustration"/>

                </div>
            </div>

        )
    }
}

Login.contextType = appContext;
export default withRouter(Login)
