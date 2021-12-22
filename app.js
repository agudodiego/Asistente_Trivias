const $btnJugar = document.querySelector(".controls__btnJugar");
const $opciones = document.querySelector("#checkbox1");
const $respOk = document.querySelector("#checkbox2");
const $X = document.querySelector(".aviso__x");  
const $aviso = document.querySelector(".aviso");

$btnJugar.addEventListener("click", ()=>{
    localStorage.setItem("checkbox1",$opciones.checked);
    localStorage.setItem("checkbox2",$respOk.checked);
})

$X.addEventListener("click", ()=>{
    $aviso.classList.add("hidden");
})