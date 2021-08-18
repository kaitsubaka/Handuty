import homeIc from "../recursos/homeBar.svg";
import citasIc from "../recursos/citasBar.svg";
import mensajesIc from "../recursos/mensajesBar.svg";
import perfilIc from "../recursos/perfilBar.svg";
import serviciosIc from "../recursos/serviciosBar.svg";


export const DATOS_SIDEBAR_TRABAJADOR = [
    {
        title: "Home",
        path: "/homeTrabajador",
        icon: homeIc,
        cName: "bar-text"
    },
    {
        title: "Profile",
        path: "/perfilTrabajador",
        icon: perfilIc,
        cName: "bar-text"
    },
    {
        title: "Works",
        path: "/citasTrabajador",
        icon: citasIc,
        cName: "bar-text"
    },
    {
        title: "Messages",
        path: "/mensajesTrabajador",
        icon: mensajesIc,
        cName: "bar-text"
    }
]


export const DATOS_SIDEBAR_CLIENTE = [
    {
        title: "Home",
        path: "/homeCliente",
        icon: homeIc,
        cName: "bar-text"
    },
    {
        title: "Services",
        path: "/serviciosCliente",
        icon: serviciosIc,
        cName: "bar-text"
    },
    {
        title: "Works",
        path: "/citasCliente",
        icon: citasIc,
        cName: "bar-text"
    },
    {
        title: "Messages",
        path: "/mensajesCliente",
        icon: mensajesIc,
        cName: "bar-text"
    }
]

