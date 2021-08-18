import {useEffect, useState} from "react";
import React from 'react';
import "./App.css";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import HomeCliente from "./pages/HomeCliente";
import CitasCliente from "./pages/CitasCliente";
import ServiciosCliente from "./pages/ServiciosCliente";
import ServiciosDetail from "./pages/ServiciosDetail";
import ServiciosFilter from "./pages/ServiciosFilter";
import {appContext} from './context/AppContext';
import Login from './pages/Login';
import RegistroViejo from './pages/RegistroViejo';
import HomeTrabajador from './pages/HomeTrabajador';
import CitasTrabajador from './pages/CitasTrabajador';
import PerfilTrabajador from './pages/PerfilTrabajador';
import CrearServicio from './pages/CrearServicio';
import CrearReserva from './pages/CrearReserva';
import Messenger from "./pages/Messenger";
import Registro from './pages/Registro';
import Principal from "./pages/Principal";


function App(){

    const [state, setState] = useState({usuario: JSON.parse(localStorage.getItem("usuario") || '{}')});


    function login(usuario){
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setState({...state, usuario: usuario});
    }

    function logout(){
        localStorage.removeItem("usuario")
        setState({...state, usuario: {}});
    }


    return (

        <div className="App">
            <appContext.Provider value={ {
                user: state.usuario,
                logoutUser: logout,
                loginUser: login
            }}>
                <Router>
                    <Switch>
                        <Route path="/" exact component={Principal}/>
                        <Route path="/principal" component={Principal}/>
                        <Route path="/login" exact component={Login}/>
                        <Route path="/registroViejo" component={RegistroViejo}/>
                        <Route path="/registro" component={Registro}/>

                        <Route path="/homeCliente" component={HomeCliente}/>
                        <Route path="/serviciosCliente" component={ServiciosCliente}/>
                        <Route path="/citasCliente" component={CitasCliente}/>
                        <Route path="/serviciosDetail" component={ServiciosDetail}/>
                        <Route path="/serviciosFilter/:id" component={ServiciosFilter}/>
                        <Route path="/mensajesCliente" component={Messenger}></Route>

                        <Route path="/mensajesTrabajador" component={Messenger}></Route>
                        <Route path="/homeTrabajador" component={HomeTrabajador}/>
                        <Route path="/perfilTrabajador" component={PerfilTrabajador}/>
                        <Route path="/citasTrabajador" component={CitasTrabajador}/>
                        <Route path="/crearServicio" component={CrearServicio}/>
                        <Route path="/reservar" component={CrearReserva}/>

                    </Switch>
                </Router>
            </appContext.Provider>
        </div>
    );
}


export default App;