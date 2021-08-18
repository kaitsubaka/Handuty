import React from 'react'
import "../pages/Login.css";
import {Link} from "react-router-dom";
import ilLogin from "../recursos/ilLogin.svg";
import logoLogin from "../recursos/logoLogin.png";

class Registro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // cuando el componente entra
    }

    render() {
        return (
            <div className="registro">
                <div className="login-der">
                    <div className="slogan">
                        <h3>Encuentra <span>personal</span> capacitado en <span>servicios generales</span> de forma
                            rápida, fácil y segura</h3>
                    </div>
                    <img className="ilLogin" src={ilLogin} alt="Ilustration"/>
                </div>
                <div className="login-izq">
                    <div className="login-izq-content">
                        <img className="logoRegistro" src={logoLogin} alt="Logo Handuty"/>
                        <form className="login-izq-inputs">
                            <p>Nombre completo</p>
                            <input type="text" id="inputText1" name="nombre"/>
                            <p>Correo electrónico</p>
                            <input type="text" id="inputText1" name="correo"/>
                            <div className="contrasena">
                                <div className="bloque">
                                    <p>Contraseña</p>
                                    <input type="password" id="inputText2" name="contrasena"/>
                                </div>
                                <div className="bloque">
                                    <p>Repetir</p>
                                    <input type="password" id="inputText2" name="contrasena"/>
                                </div>
                            </div>
                            <div className="contrasena">
                                <div className="bloque">
                                    <p>Teléfono</p>
                                    <input type="text" id="inputText2" name="telefono"/>
                                </div>
                                <div className="bloque">
                                    <p>Cédula</p>
                                    <input type="text" id="inputText2" name="cedula"/>
                                </div>
                            </div>
                            <p>Fecha de nacimiento</p>
                            <input type="text" id="inputText2" name="fecha"/>
                            <select defaultValue="cliente" id="inputState" className="form-control" name="tipo">
                                <option value="trabajador">Trabajador</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </form>
                        <button className="botonLogin" onClick={this.handleSubmit}>
                            <span>Crear Cuenta</span>
                        </button>
                        <div className="preguntaRegistro">
                            <p>¿Ya estás registrado? <Link to="/"> <span>Iniciar Sesión</span></Link></p>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Registro
    