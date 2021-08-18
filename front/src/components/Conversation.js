import avatarTrabajador from "../recursos/avatarTrabajador.png";
import avatarCliente from "../recursos/avatarCliente.png"
import { useContext, useEffect, useState } from "react";
import  "./Conversation.css";
import { appContext } from "../context/AppContext";

export default function Conversation({ conversation, currentUser}) {
  const [user, setUser] = useState(null);
  const context = useContext(appContext);

  useEffect(() => {
    const friendId = context.user.isTrabajador?conversation.cliente:conversation.trabajador;
    console.log(friendId);

    const getUser = async () => {
      try {
        let path_aux = context.user.isTrabajador?"clientes/":"trabajadores/";
        const res = await fetch(path_aux+`${friendId}`);
        const parsed_res = await res.json();
        setUser(parsed_res);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation, context.user]);


  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={context.user.isTrabajador?avatarTrabajador:avatarCliente}
        alt=""
      />
      <span className="conversationName">{user?.nombre}</span>
    </div>
  );
}