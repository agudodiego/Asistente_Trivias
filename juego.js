
const mostarOpciones = localStorage.getItem("checkbox1");
const mostarRtaOk = localStorage.getItem("checkbox2");
// localStorage.clear();

const $categoria = document.querySelector(".contenedor__categoria");
const $pregunta = document.querySelector(".contenedor__pregunta");
const $hint = document.querySelector(".contenedor__hint");
const $contenedor_opcion = Array.from(document.getElementsByClassName("contenedor__opcion"));
const $opcion = Array.from(document.getElementsByClassName("opcion-texto"));
const $unicaOpcion = document.querySelector(".opcion.opcion--unica");

// getElementsByClassName me devuelve un html collection con TODOS los 
// elementos que compartan la clase en cuestion.
// Para poder usar esa collection debo transformarla en un array con Array.from()
console.log(mostarOpciones);
console.log(mostarRtaOk);

// +++++++++++++++++++++++ Peticion +++++++++++++++++++++++++
// let arrayDePreguntas = [];
// fetch("base-preguntas.json")
//     .then(res => {return res.json()})
//     .then(resFetch => )
//     .catch(err => console.log("Error al leer la base de datos de Preguntas"));

// Hago la peticion y me guardo el resultado en un array (arrayDePreguntas)
const obtenerListadoPreguntas = async ()=>{
    let peticion = await fetch("base-preguntas.json");
    let arrayDePreguntas = await peticion.json();
    // console.log(arrayDePreguntas);
    comenzarJuego(arrayDePreguntas);
}

// +++++++++++++++++++++++ Juego +++++++++++++++++++++++++

let puedoResponder = true;

// valido el tema de mostrar las opciones o no segun el seteo de la pantalla de inicio
// lo que decido aca es si muestro en pantalla los divs 
// en caso de jugar sin opciones debo dejar un solo div dnd voy a imprimir la resp correcta
if (mostarOpciones === "false" || mostarOpciones === null){
    for (let i = 1; i < 4; i++) {
        $contenedor_opcion[i].classList.add("hidden");         
    }
    // oculto la letra "A" del div que va a quedar en pantalla
    $unicaOpcion.classList.add("hidden");
    $hint.classList.remove("hidden");
}

obtenerListadoPreguntas();





let preguntaActual = "";
let respuestasMezcladas = [];

function prepararPregunta (arrayDePreguntas){
    let indiceRandom = Math.round(Math.random()* arrayDePreguntas.length);
    // selecciono de manera random una pregunta del array
    preguntaActual = arrayDePreguntas[indiceRandom];
    // elimino del array la pregunta seleccionada para que no salga repetida
    arrayDePreguntas.splice(indiceRandom, 1);
    console.log(preguntaActual)
    // console.log(arrayDePreguntas)

    // a continuacion lo que hago es generar una array con las 3 respuestas incorrectas    
    for (let i = 0; i < 3; i++) {
        respuestasMezcladas[i] = preguntaActual[`incorrecta${i+1}`];        
    }
    
    // para luego poner de manera random la respuesta correcta 
    indiceRandom = Math.round(Math.random()* 3);
    respuestasMezcladas.splice(indiceRandom, 0, preguntaActual.respuesta);    
}

function iniciarRonda (preguntaActual, respuestasMezcladas, mostarOpciones, mostarRtaOk){
    // pinto en pantalla la categoria y la pregunta 
    $categoria.innerText = "Categoria: " + preguntaActual.categoria;
    $pregunta.innerText = preguntaActual.pregunta;

    // pinto las opciones de la pregunta actual
    if (mostarOpciones === "true"){
        for (let i = 0; i < 4; i++) {
            $opcion[i].innerText = respuestasMezcladas[i];        
        }
    }
}

function validarRespuesta (opcionSeleccionada, mostarOpciones, mostarRtaOk){
    const divTexto = opcionSeleccionada.querySelector(".opcion-texto");

    if (mostarOpciones === "true" && mostarRtaOk === "true"){

        if(divTexto.innerText === preguntaActual.respuesta){
            opcionSeleccionada.classList.add("correcto");
        }else{
            opcionSeleccionada.classList.add("incorrecto");
            for (let i = 0; i < 4; i++){
                let textoCorrecto = $contenedor_opcion[i].querySelector(".opcion-texto").innerText; 
                if (textoCorrecto === preguntaActual.respuesta){
                    $contenedor_opcion[i].classList.add("correcto"); 
                } 
            }
        }
    }else if (mostarOpciones === "true" && mostarRtaOk === "false"){

        if(divTexto.innerText === preguntaActual.respuesta){
            opcionSeleccionada.classList.add("correcto");
        }else{
            opcionSeleccionada.classList.add("incorrecto");
        }
    }else{
        $opcion[0].innerText = preguntaActual.respuesta;
        opcionSeleccionada.classList.add("correcto");
    }
}

function comenzarJuego (arrayDePreguntas){
    
    prepararPregunta (arrayDePreguntas);    
    iniciarRonda(preguntaActual, respuestasMezcladas, mostarOpciones, mostarRtaOk);

    // pongo una escucha para saber que opcion se selecciono o
    // si se apreto el boton de siguiente
    document.addEventListener("click", (e) => {
        // resuelvo que hacer si se apreta el boton "suguiente"
        if(e.target.matches("#siguiente")){
            // limpio los colores verde y rojo de las opciones y en el texto pongo: "¿ ?"
            for (let i = 0; i < 4; i++) {
                $contenedor_opcion[i].classList.remove("correcto");
                $contenedor_opcion[i].classList.remove("incorrecto"); 
                $contenedor_opcion[i].querySelector(".opcion-texto").innerText = "¿ ?";               
            }    

            prepararPregunta (arrayDePreguntas);
            iniciarRonda(preguntaActual, respuestasMezcladas, mostarOpciones, mostarRtaOk);           
            puedoResponder = true;
        }

        // resuelvo que hacer si se apreta alguna opcion de respuesta
        if(e.target.matches(".contenedor__opcion")){
            if (puedoResponder){
                puedoResponder = false;
                validarRespuesta(e.target, mostarOpciones, mostarRtaOk);
            }
        }
    },true)

}
