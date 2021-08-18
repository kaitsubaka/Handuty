import React, { useContext, useEffect, useRef, useState } from "react";
import Mensaje from "../components/Mensaje"
import { appContext } from '../context/AppContext';
import Conversation from "../components/Conversation";
import { io } from "socket.io-client";
import "./Messenger.css";
import Sidebar from "../components/Sidebar";
import emptyIcon from "../recursos/emptyIcon.svg";
import {FormattedMessage, useIntl} from 'react-intl'

export default function Messenger() {
    const intl = useIntl();

    // hooks
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const { user } = useContext(appContext)
    const scrollRef = useRef();
    // cosas que me toca hacer por tener 2 documentos de usuario
    const path_aux = user.isTrabajador ? "trabajadores/" : "clientes/";
    // functions and effects

    useEffect(() => {
        socket.current = io();
        socket.current.on("getMessage", (data) => {
                setArrivalMessage(data);
        });
    }, []);

    useEffect(() => {
        
        if (arrivalMessage){
            
        let newMsg = {
            _id: "0",
            trabajador: arrivalMessage.senderId===user._id?user.isTrabajador:!user.isTrabajador,
            contenido: arrivalMessage.text,
            chat: currentChat._id,
            createdAt: Date.now(),
        }
            setMessages((prev)=>[...prev,newMsg]);
        } 
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user._id);
    }, [user]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await fetch(`/chats/${currentChat._id}/mensajes`);
                const parsed_res = await res.json();
                setMessages(parsed_res);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch(path_aux + user._id + '/chats');
                const parsed = await res.json()
                console.log(parsed);
                setConversations(parsed);
                console.log(conversations);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            chat: currentChat,
            trabajador: user.isTrabajador,
            contenido: newMessage,
        };

        const receiverId = user.isTrabajador ? currentChat.cliente : currentChat.trabajador;

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });

        try {
            const res = await fetch("/mensajes", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)

            })
            const parsed_res = await res.json();
            setMessages([...messages, parsed_res]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="App">
           <Sidebar />
            <div className="messenger">
            {conversations.length>0 ? (
                <div className="chatPrincipal">
                    <div className="chatMenu">
                        <div className="chatMenuWrapper">
                            {conversations.map((c, key) => (
                                <div onClick={() => setCurrentChat(c)} key={key}>
                                    <Conversation conversation={c} currentUser={user} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chatBox">
                        <div className="chatBoxWrapper">
                            {currentChat? (
                            <>
                            <div className="chatBoxTop">
                                {messages.map((m, key) => (
                                    <div ref={scrollRef} key={key}>
                                        <Mensaje mensaje={m} own={user.isTrabajador === m.trabajador} />
                                    </div>
                                ))}
                            </div>
                            <div className="chatBoxBottom">
                                <textarea
                                    className="chatMessageInput"
                                    placeholder={intl.formatMessage({id: 'WriteMessage'})}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    value={newMessage}
                                ></textarea>
                                <button className="chatSubmitButton" onClick={handleSubmit}>
                                    <FormattedMessage id="Send"/>
                                </button>
                            </div>
                            </>
                            ):(

                            <div className="emptyPage">
                                <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                <p className="emptyPage-bold"><FormattedMessage id="SelectChat"/></p>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                ):
                (   
                <div className="emptyPage">
                    <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                    <p className="emptyPage-bold">¡Todavía no tienes ningún mensaje!</p>
                </div>
                )}
            </div>
        </div>
    )

}