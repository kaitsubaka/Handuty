import "./Mensaje.css";
import { format } from "timeago.js";
import { useContext } from "react";
import { appContext } from "../context/AppContext";
import avatarTrabajador from "../recursos/avatarTrabajador.png";
import avatarCliente from "../recursos/avatarCliente.png"

export default function Mensaje({ mensaje, own, isTrabajador }) {
const context = useContext(appContext)
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={context.user.isTrabajador?avatarTrabajador:avatarCliente}
          alt=""
        />
        <p className="messageText">{mensaje.contenido}</p>
      </div>
      <div className="messageBottom">{format(mensaje.createdAt)}</div>
    </div>
  );
}