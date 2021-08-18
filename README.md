# HANDUTY 202110_S1_E3

DESCRIPCIÓN DE PROYECTO

Handuty es una plataforma en la que los usuarios podrán encontrar personal capacitado en servicios generales como carpintería, pintura o limpieza de forma rápida, fácil y segura. Además, los trabajadores podrán publicar los servicios que prestan y asignarles un costo por hora. 

* Problema: Encontrar personal capacitado y serio que preste un servicio general es una tarea difícil e insegura

* Solución: Conectar prestadores de servicios generales capacitados con usuarios que los necesiten de forma rápida, fácil y segura

* Propuesta: Plataforma WEB en la que usuarios podrán conectar con trabajadores dependiendo de su calificación, cobro por hora y descripción de las labores que desempeña

En el siguiente enlace se presenta la descripción del proyecto https://youtu.be/iXBas3co0v8.

RECURSOS
En este proyecto todas las ilustraciones utilizadas se tomaron de unDraw y de Stories by Freepik las cuales son de uso libre y gratuito. Los íconos de tomaron de FlatIcon, también de uso libre y gratuito. 

LIVE DEMO
En el siguiente enlace https://youtu.be/v_ypzvT571c se presenta un video en el que se explican las funcionalidades core de Handuty.

NOTA
Salen 21 issues de accesibilidad relacionados con D3 que dicen que requieren revisión pero que no tienen ningún fundamento porque el contraste de color es muy bueno entre blanco del fondo y negro del texto. 

PATRONES DE DISEÑO (UI_Patterns)

Los patrones de diseño utilizados en esta plataforma son:
* Password Strength Meter: Se utiliza en el registro paragarantizar que el usuario sepa que tiene que poner mayúscula, minúscula, número, caracter especial y una longitud mínima. Esto también se verifica para poder crear la cuenta. 
* Input feedback: En los formularios como los de registr y login se les informa a los usuarios que deben poner antes de enviar el forms. 
* Calendar Picker: A la hora de crear una cita, se habilita un calendar picker en el que el cliente solo puede seleccionar las horas en las que puede agendar una cita para que no cometá errores.
* Input prompt: En todos los casos, cuando es necesario, se ponen placeholders o labels para indicar al usuario que debe hacer. 
* Steps Left: el registro se divide en varios pasos ya que la información en esta cambia dependiente dle tip de usuario. Se indica claramente. 
* Rate content: Para las citas pasadas del cliente, es posible calificar a los trabajadores. 
* Breadcumbs: Cuando se navegan los servicios, se tiene un breadcumbs de tal forma que el usuario sepa en que lugar de la aplicación se encuentra.
* Home Link (reemplazo de fat footer): Cada vez que los usuarios hagan click en el icono, volverán a sus respectivas páginas home con sus dashboards personalizados. 
* Menu: En los filtros se utilizaron menús de dropdown para mostrar las diferentes opciones a los usuarios. También se utilizó en la barra de búsqueda. En el menú principal no se consideró necesario debido a que hay muy pocas opciones. 
* Carousel: en los home de cliente y trabajador se tienen carruseles para que puedan ver todas las citas futuras que tienen. 
* Cards: Todos los servicios y citas se presentan como cards.
* Table filter: Todos los servicios que ve el cliente tienen filtros habilitados.
* Sort by column: Todos los serivcios que ve el cliente se pueden ordenar.
* Dashboard: Tanto cliente como trabajador tienen dashboards en sus respectivoos homes donde se presenta un resumen de la actividad de la aplicación.
* Search Autocomplete (Reemplazo gallery): Cuando se utiliza la barra de búsqueda para buscar servicios o trabajadores, se autocompleta lo que ingresa el usuario.
* Chat: Se implementó un chat entre clientes y trabajadores que solo puede comenzar el cliente. 


DESPLIEGUE Y USO

Para el despliegue es necesario completar los siguientes pasos.
1. Clone el repositorio
2. En la carpeta handuty-front ejecute el comando npm run build. Esto compilará el proyecto front y creará una nueva carpeta denominada build.
3. Vaya al directorio raiz, abra el archivo app.js y modifique la linea correspondiente por app.use(express.static(path.join(__dirname, 'handuty-front/build')));. Con esta modificación, todas las páginas que están en este directorio serán servidas al cliente como páginas estáticas.
4. Ahora ingresa en un navegador a la url http://localhost:3001/, podrá ver la página "estática" constuida en React.
5. Ingrese a la carpeta front, modifique el archivo package.json e incluya esta nueva línea: "proxy": "http://localhost:3001/

