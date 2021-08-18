import {useState} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {appContext} from './context/AppContext';
import ServiciosDetail from "./pages/ServiciosDetail";
import ServiciosFilter from "./pages/ServiciosFilter";
import RegistroViejo from './pages/RegistroViejo';
import CrearServicio from './pages/CrearServicio';
import CrearReserva from './pages/CrearReserva';
import Principal from "./pages/Landing";
import Messenger from "./pages/Messenger";
import Registro from './pages/Registro';
import Login from './pages/Login';
import Home from "./pages/Home";
import Citas from "./pages/CitasCliente";
import Servicios from "./pages/Servicios";
import "./App.css"; 


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
                        <Route path="/landing" component={Principal}/>
                        <Route path="/login" exact component={Login}/>
                        <Route path="/registroViejo" component={RegistroViejo}/>
                        <Route path="/register" component={Registro}/>
                        <Route path="/home" component={Home}/>
                        <Route path="/apointments" component={Citas}/>
                        <Route path="/services" component={Servicios}/>
                        <Route path="/services-detail" component={ServiciosDetail}/>
                        <Route path="/services-filter/:id" component={ServiciosFilter}/>
                        <Route path="/messages" component={Messenger}></Route>
                        <Route path="/create-reservation" component={CrearReserva}/>
                        <Route path="/create-service" component={CrearServicio}/>
                    </Switch>
                </Router>
            </appContext.Provider>
        </div>
    );
}


export default App;