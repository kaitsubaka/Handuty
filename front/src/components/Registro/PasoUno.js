import * as Joi from "joi";
import step from "../../recursos/Step1.svg";
import {FormattedMessage, useIntl} from "react-intl"

const passwordComplexity = require("joi-password-complexity").default;

function PasoUno({setShowError,validationParent,formParent,callback,callbackNext}) {

    const intl = useIntl();

    const schemaObjectPrimeraParte = {
        nombre: Joi.string().min(1).required(),
        correo: Joi.string().pattern(new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)).required(),
        contrasena: passwordComplexity(),
        contrasenaRepeat: Joi.ref("contrasena"),
        rol: Joi.string().required()
    }

    const joiValidator = Joi.object(schemaObjectPrimeraParte);

    const defaultRol = "cliente";

    function handleAction(event){
        callback(event);
    }

    function handleClick(event){
        event.preventDefault();
        const importantFields = {nombre:formParent.nombre, correo: formParent.correo,
            contrasena: formParent.contrasena, contrasenaRepeat: formParent.contrasenaRepeat, rol: formParent.rol }
        const validation = joiValidator.validate(importantFields);
        if(validation.error){
            setShowError(true);
        }else{
            callbackNext();
        }
    }

    return (
        <div className="registro-steps">
            <div className="registro-steps-izq">
                <img className="pregunta-bar" src={step} alt="Estado"/>
            </div>
            <div className="registro-steps-der">
                <div>
                    <p className="registro-steps-der-tit"><FormattedMessage id="Paso1"/></p>
                </div>
                <label htmlFor="inputText1"><p><FormattedMessage id="CompleteName"/></p></label>
                <input type="text" onChange={handleAction} id="inputText1" name="nombre" className={`${validationParent.error && validationParent.error.message.includes('"nombre"')? "is-invalid" : "is-valid"}`}/>
                            {validationParent.error && validationParent.error.message.includes('"nombre"') &&
                <div className="invalid-feedback">
                    <FormattedMessage id="VerName"/>
                </div>}
                <div>
                    <label htmlFor="inputText2"><p><FormattedMessage id="Mail"/></p></label>
                </div>
                <input type="text"  onChange={handleAction} id="inputText2" name="correo" className={`${validationParent.error && validationParent.error.message.includes('"correo"')? "is-invalid" : "is-valid"}`}/>
                            {validationParent.error && validationParent.error.message.includes('"correo"') &&
                <div className="invalid-feedback">
                    <FormattedMessage id="VerMail"/>
                </div>}
                <div className="contrasena">
                    <div className="bloque">
                        <label htmlFor="inputText3"><p><FormattedMessage id="Password"/></p></label>
                        <input type="password"  onChange={handleAction} id="inputText3" name="contrasena" className={`${validationParent.error && validationParent.error.message.includes('"contrasena"')? "is-invalid" : "is-valid"}`}/>
                                    {validationParent.error && validationParent.error.message.includes('"contrasena"') &&
                        <div className="invalid-feedback">
                            <FormattedMessage id="VerPass"/>
                        </div>}
                    </div>
                    <div className="bloque">
                        <label htmlFor="inputText4"><p><FormattedMessage id="Repeat"/></p></label>
                        <input type="password"  onChange={handleAction} id="inputText4" name="contrasenaRepeat" className={`${validationParent.error && validationParent.error.message.includes('"contrasenaRepeat"')? "is-invalid" : "is-valid"}`}/>
                                    {validationParent.error && validationParent.error.message.includes('"contrasenaRepeat"') &&
                        <div className="invalid-feedback">
                            <FormattedMessage id="VerEquals"/>
                        </div>}
                    </div>
                </div>
                <label htmlFor="inputState"><p><FormattedMessage id="SelectType"/></p></label>
                <select  onChange={handleAction} defaultValue={defaultRol} id="inputState" className="form-control" name="rol">
                        <option value="trabajador">{intl.formatMessage({id:"Worker"})}</option>
                        <option value="cliente">{intl.formatMessage({id:"Client"})}</option>
                </select>
                <button className="registro-steps-but" onClick={handleClick}><FormattedMessage id="NEXT"/></button>
            </div>
        </div>
    )
}

export default PasoUno
