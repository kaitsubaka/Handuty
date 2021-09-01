import React, { useContext, useState } from "react";
import ilLogin from "../recursos/ilLogin.svg";
import logoLogin from "../recursos/logoLogin.png";
import { Link } from "react-router-dom";
import "./Registro.css";
import "react-datepicker/dist/react-datepicker.css";
import Joi from "joi";
import { Modal, Button } from "react-bootstrap";
import { userContext } from "../context/User";
import PasoUno from "../components/Registro/PasoUno";
import PasoDos from "../components/Registro/PasoDos";
import { FormattedMessage } from "react-intl";
import passwordComplexity from "joi-password-complexity";
import { ROLES } from "../constants/Roles";

function Registro({ history }) {
  const schemaObjectpersona = {
    nombre: Joi.string().min(1).required(),
    correo: Joi.string()
      .pattern(new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/))
      .required(),
    contrasena: passwordComplexity(),

    contrasenaRepeat: Joi.ref("contrasena"),
    telefono: Joi.string().required(),

    ciudad: Joi.string().min(1).required(),
    direccion: Joi.string().min(1).required(),

    cedula: Joi.string().min(7).required(),
    fechaNacimiento: Joi.string().min(0).custom(older18).isoDate().required(),
    rol: Joi.string().required(),
  };

  const defaultDate = new Date("1990-12-01T10:00:00Z");

  const defaultRol = ROLES.CLIENTE;

  const [showSuccess, setShowSuccess] = useState(false);

  const [showError, setShowError] = useState(false);

  const [validation, setValidation] = useState({});

  const [schemaForm, setSchemaForm] = useState(Joi.object(schemaObjectpersona));

  const context = useContext(userContext);

  const [next, setNext] = useState(false);

  const [conError, setConError] = useState(false);

  function handleCloseConError() {
    setConError(false);
  }

  function handleCloseError() {
    setShowError(false);
  }

  function handleNext() {
    setNext(true);
  }

  function handleCloseSuccess() {
    setShowSuccess(false);
    history.push("/home");
  }

  function older18(fechaNacimiento, helper) {
    const dateValid =
      new Date().getFullYear() - new Date(fechaNacimiento).getFullYear() >= 18;
    if (!dateValid) {
      throw new Error('"fechaNacimiento" must have 18 years"');
    }
    return fechaNacimiento;
  }

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    contrasenaRepeat: "",
    telefono: "",
    cedula: "",
    rol: defaultRol,
    fechaNacimiento: defaultDate.toISOString(),
  });

  function handleChange(event) {
    let newSchema = schemaForm;
    newSchema = Joi.object(schemaObjectpersona);
    setSchemaForm(newSchema);
    setValidation(
      newSchema.validate(
        { ...form, [event.target.name]: event.target.value },
        { abortEarly: false }
      )
    );
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleDateChange(date) {
    setValidation(
      schemaForm.validate(
        { ...form, fechaNacimiento: date.toISOString() },
        { abortEarly: false }
      )
    );
    setForm({ ...form, fechaNacimiento: date.toISOString() });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!navigator.onLine) {
      setConError(true);
      return;
    }
    if (!validation.error) {
      fetch("/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => {
          if (res.status !== 201) {
            setShowError(true);
          } else {
            res.json().then((persona) => {
              context.loginUser(persona);
            });
            setShowSuccess(true);
          }
        })
        .catch((err) => {
          setShowError(true);
          console.log(err);
        });
    } else {
      setShowError(true);
    }
  }

  return (
    <div className="registro">
      <div className="register-der">
        <div className="slogan">
          <h3>
            <FormattedMessage id="Find" />
          </h3>
        </div>
        <img className="ilLogin" src={ilLogin} alt="Ilustration" />
      </div>
      <div className="register-izq">
        <div className="register-izq-content">
          <h1>
            <img className="logoRegistro" src={logoLogin} alt="Logo Handuty" />
          </h1>
          <form className="register-izq-inputs">
            {next === false ? (
              <PasoUno
                setShowError={setShowError}
                validationParent={validation}
                formParent={form}
                callback={handleChange}
                callbackNext={handleNext}
              />
            ) : (
              <PasoDos
                validationParent={validation}
                formParent={form}
                callback={handleChange}
                callbackDate={handleDateChange}
              />
            )}
          </form>
          {next === true && (
            <button className="botonRegister" onClick={handleSubmit}>
              <span>
                <FormattedMessage id="Create" />
              </span>
            </button>
          )}
          <div className="preguntaRegistro">
            <p>
              <FormattedMessage id="Already" />{" "}
              <Link to="/login">
                {" "}
                <span>
                  <FormattedMessage id="Login" />
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Modal
        id="modal_error"
        show={showError}
        onHide={handleCloseError}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedMessage id="SendError" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseError}>
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        id="modal_success"
        show={showSuccess}
        onHide={handleCloseSuccess}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage id="RegisExito" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedMessage id="CuentaExitosa" />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleCloseSuccess}
            id="register_success_btn"
          >
            <FormattedMessage id="Ingresar" />
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        id="modal_con_error"
        show={conError}
        onHide={handleCloseConError}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormattedMessage id="serverProblem" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseConError}>
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Registro;
