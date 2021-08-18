import React, { useEffect, useState } from 'react'
import "./Search.css";
import searchIcon from "../recursos/searchIcon.svg";
import {useHistory} from "react-router-dom";
import {FormattedMessage, useIntl} from 'react-intl'

function Search() {

    const intl = useIntl();

    let history = useHistory();
    const categoriesEsp = [{categoria: "Carpintería"},
        {categoria: "Cerrajería"},
        {categoria: "Electricista"},
        {categoria: "Fumigación"},
        {categoria: "Jardinería"},
        {categoria: "Limpieza"},
        {categoria: "Mascotas"},
        {categoria: "Mantenimiento"},
        {categoria: "Pintura"},
        {categoria: "Plomería"},
        {categoria: "Seguridad"},
    ];

    const categoriesEng = [{categoria: "Carpintry"},
        {categoria: "Locksmith"},
        {categoria: "Electrician"},
        {categoria: "Fumigation"},
        {categoria: "Gardening"},
        {categoria: "Cleaning"},
        {categoria: "Pets"},
        {categoria: "Maintenance"},
        {categoria: "Paint"},
        {categoria: "Plumbing"},
        {categoria: "Security"},
    ];

    var userLang = navigator.language || navigator.userLanguage; 
    const categories = userLang.startsWith('en')?categoriesEng:categoriesEsp

    const [categ, setCategs] = useState([]);
    const [input, setInput] = useState('');
    const [workers, setWorkers] = useState([]);
    const [allWork, setAllWork] = useState([]);

    const handleInput = (event)=>{
        const valor = event.target.value;
        const a_mostrar_categs = categories.filter(item => {
            return item.categoria.toLowerCase().includes(valor.toLowerCase())
        })

        const a_mostrar_trab = allWork.filter(item => {
            return item.nombre.toLowerCase().includes(valor.toLowerCase())
        })
        setCategs(a_mostrar_categs);
        setWorkers(a_mostrar_trab);
        setInput(valor);
    }

    const handleEnter = (e) => {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == '13') {
            history.push('/serviciosFilter/'+input)
        }
    }

    const handleClickO = (e) => {
        history.push('/serviciosFilter/'+input);
    }

    const onInput = (e) => {
        /*console.log("input", e.target.value);*/

        const value = e.target.value;

        const namePos = allWork.filter(el => el.nombre.toLowerCase() === value.toLowerCase());
        const catPos = categories.filter(el => el.categoria.toLowerCase() === value.toLowerCase());

        /*console.log("namePos", namePos);
        console.log("catPos", catPos);*/
       
        let busq = null;

        if(catPos.length > 0 ){
            busq = catPos[0].categoria;
        } else if(namePos.length >0 ){
            busq = namePos[0].nombre;
        }
        /*console.log("busq", busq);*/

        if(busq != null){
            history.push('/serviciosFilter/'+busq);
        }
    }

    const handleClickDatalist = (e) => {
        console.log("clickeo");
    }


    useEffect(()=>{
        fetch('/trabajadores')
        .then(res=>res.json())
        .then(res=>{
            setAllWork(res)
        })
    },[])

    return (
        <div>
            <div className="searchBar">
                <button className="searchBarBut">
                    <img className="searchIcon" src={searchIcon} alt="Search icon" onClick={handleClickO}/>
                </button>
                <input
                    type="text"
                    id="searchText"
                    placeholder={intl.formatMessage({id: 'Search'})}
                    list="datalistOptions"
                    
                    onChange={handleInput} 
                    onKeyDown={handleEnter}
                    onInput={onInput}
                />
                <datalist id="datalistOptions" >
                {
                    categ.map((item, key)=>{
                        return(
                            <option value={item.categoria} key={key}/>
                        )
                    })
                }
                {
                    workers.map((item, key)=>{
                        return(
                            <option value={item.nombre} key={key}/>
                        )
                    })
                }
                </datalist>
            </div>
            {/*<div className = 'ans'>
                {
                    categ.map(item=>{
                        return(
                            <h1>{item.categoria}</h1>
                        )
                    })
                }
                {
                    workers.map(item=>{
                        return(
                            <h1>{item.nombre}</h1>
                        )
                    })
                }
            </div>*/}
        </div>
    )
}

export default Search
