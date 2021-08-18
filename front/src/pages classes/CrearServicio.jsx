import React from "react";
import "../pages/CrearServicio.css";
import flecha from "../recursos/arrowIcon.svg";
import {appContext} from "../context/AppContext";
import {Link, Redirect} from "react-router-dom";
import SidebarTrabajador from "../components/SidebarTrabajador";

class CrearServicio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {categorias: [], servicio: {categoria: "Carpintería", precio: "", descripcion: "", trabajador: ""}}
        this.handleInputChange = this.handleInputChange.bind(this);
        this.aceptar = this.aceptar.bind(this);
    }

    componentDidMount() {
        this.setState({servicio: {...this.state.servicio, trabajador: this.context.user._id}});
        fetch('/servicios/categorias').then(categorias => categorias.json().then(categorias =>
            this.setState({categorias: categorias})));
    }

    handleInputChange(event) {
        this.setState({servicio: {...this.state.servicio, [event.target.name]: event.target.value}});
    }

    aceptar(event) {
        fetch('/servicios', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.servicio)
        }).then(res => {
            this.props.history.push("/perfilTrabajador");
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        if (!this.context.user._id) return <Redirect to='/'/>;
        return (
            <div className="App">
                <SidebarTrabajador/>
                <div className="formServicio">
                    <div className="formServicio-title">
                        <Link to="/perfilTrabajador">
                            <img className="arrowImgForm" src={flecha} alt="Flecha"/>
                        </Link>
                        <div className="formServicio-title-txt">
                            <h2>Agregar Servicio</h2>
                            <p>Define aquí los servicios que puedes prestar a los clientes.</p>
                        </div>
                    </div>
                    <div className="formServicio-main">
                        <form className="formDetail">
                            <label htmlFor="categoria">Selecciona una categoría</label>
                            <select name="categoria" onChange={this.handleInputChange}>
                                {this.state.categorias.map(categoria => {
                                    return <option key={categoria} value={categoria}>{categoria}</option>
                                })}
                            </select>
                            <label htmlFor="precio">Indica el precio por hora</label>
                            <input type="number" id="precio" name="precio" onChange={this.handleInputChange}></input>
                            <label htmlFor="descripcion">Descripción del Servicio</label>
                            <textarea id="descripcion" onChange={this.handleInputChange} name="descripcion"></textarea>
                            <div className="bloqueBotones">
                                <Link to="/perfilTrabajador">
                                    <button type="button" className="cancelButton">Cancelar</button>
                                </Link>
                                <button type="button" onClick={this.aceptar}>Aceptar</button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        )
    }


}


CrearServicio.contextType = appContext;
export default CrearServicio;