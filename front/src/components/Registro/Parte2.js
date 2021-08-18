import React from "react";
import DatePicker, {registerLocale }from "react-datepicker";
import step from "../../recursos/Step2.svg";
import {FormattedMessage} from 'react-intl';
import es from "date-fns/locale/es";
import en from "date-fns/locale/es";

function Parte2(props) {
registerLocale("es", es);
registerLocale("en", en);
  const validation  = props.validationParent;
  const form = props.formParent;

  function handleAction(event) {
    props.callback(event);
  }

  function handleDate(date) {
    props.callbackDate(date);
  }
  var userLang = navigator.language || navigator.userLanguage; 

  return (
    <div className="registro-steps">
        <div className="registro-steps-izq">
            <img className="pregunta-bar" src={step} alt="Estado"/>
        </div>
        <div className="registro-steps-der">
        <div>
            <p className="registro-steps-der-tit"><FormattedMessage id="Paso2"/></p>
        </div>
        {form.tipo === "cliente" && (
            <div className="contrasena">
            <div className="bloque">
                <label htmlFor="inputText1"><p><FormattedMessage id="City"/></p></label>
                <input
                type="text"  onChange={handleAction} id="inputText1"  name="ciudad" className={`${ validation.error && validation.error.message.includes('"ciudad"') ? "is-invalid"  : "is-valid" }`}
                />
                {validation.error &&
                validation.error.message.includes('"ciudad"') && (
                    <div className="invalid-feedback">
                    <FormattedMessage id="VerCity"/>
                    </div>
                )}
            </div>
            <div className="bloque">
                <label htmlFor="inputText2"><p><FormattedMessage id="Address"/></p></label>
                <input
                type="text" onChange={handleAction} id="inputText2" name="direccion" className={`${ validation.error &&  validation.error.message.includes('"direccion"')? "is-invalid" : "is-valid" }`}
                />
                {validation.error &&
                validation.error.message.includes('"direccion"') && (
                    <div className="invalid-feedback">
                    <FormattedMessage id="VerAdd"/>
                    </div>
                )}
            </div>
            </div>
        )}
        <div className="contrasena">
            <div className="bloque">
            <label htmlFor="inputText3"><p><FormattedMessage id="Phone"/></p></label>
            <input
                type="number"  onChange={handleAction}  id="inputText3" name="telefono" className={`${ validation.error && validation.error.message.includes('"telefono"') ? "is-invalid" : "is-valid"  }`}/>
            {validation.error &&
                validation.error.message.includes('"telefono"') && (
                <div className="invalid-feedback"><FormattedMessage id="VerPho"/></div>
                )}
            </div>
            <div className="bloque">
            <label htmlFor="inputText4"><p><FormattedMessage id="idNumber"/></p></label>
            <input
                type="number" onChange={handleAction}  id="inputText4"  name="cedula" className={`${ validation.error && validation.error.message.includes('"cedula"') ? "is-invalid" : "is-valid"}`}
            />
            {validation.error &&
                validation.error.message.includes('"cedula"') && (
                <div className="invalid-feedback">
                    <FormattedMessage id="VerId"/>
                </div>
                )}
            </div>
        </div>
        <label htmlFor="inputFechaNac"><p><FormattedMessage id="Birth"/></p></label>
        <DatePicker
            selected={new Date(form.fechaNacimiento)} 
            id="inputFechaNac" 
            name="fechaNacimiento"  
            onChange={(date) => handleDate(date)}  
            peekNextMonth 
            showMonthDropdown 
            showYearDropdown 
            dropdownMode="select"
            dateFormat={userLang.startsWith('en')?"MM/dd/yyyy":"dd/MM/yyyy"}
            locale={userLang.startsWith('en')?"en":"es"}/>
        {validation.error &&
            validation.error.message.includes('"fechaNacimiento"') && (
            <div id="bad-date-feedback">
                <p><FormattedMessage id="VerBirth"/></p>
            </div>
            )}
        </div>
    </div>
  );
}

export default Parte2;
