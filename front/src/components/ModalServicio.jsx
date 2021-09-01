import {useState} from 'react';
import "./ModalServicio.css";

const ModalServicio = ({handleClose, show}) => {
    const [categorias, setCategorias] = useState([]);
    const [servicio, setServicio] = useState({categoria: "", precio: "", descripcion: ""});
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    const handleInputChange = (event) => {
        setServicio({...servicio, [event.target.name]: event.target.value})
    }
    fetch('/servicios/categorias').then(categorias => categorias.json().then(categorias => setCategorias(categorias)));
    const aceptar = (event) => {
        fetch('/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(servicio)
        }).then(res => {
            handleClose();
        });
    }
    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                <form>
                    <select name="categoria" onChange={handleInputChange}>
                        {categorias.map(categoria => {
                            return <option key={categoria} value={categoria}>{categoria}</option>
                        })}
                    </select>
                    <label htmlFor="precio">Precio</label>
                    <input type="number" id="precio" name="precio" onChange={handleInputChange}></input>
                    <label htmlFor="descripcion">descripcion</label>
                    <textarea id="descripcion" onChange={handleInputChange} name="descripcion"></textarea>
                    <button type="button" onClick={aceptar}>Aceptar</button>
                    <button type="button" onClick={handleClose}>Cancelar</button>
                </form>
            </section>

        </div>

    )
}

export default ModalServicio;