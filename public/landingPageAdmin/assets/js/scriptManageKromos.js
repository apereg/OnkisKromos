async function start(){
    var auxLoad = await loadNameUsr();
    auxLoad = JSON.parse(auxLoad);
    writeData(auxLoad);
}

async function closeSession() {
    console.log("Cerrando la sesion");
    return $.post(
        "/closeSession",
        {session: "session"}
    );
}

async function loadNameUsr() {
    console.log("Accediendo a db js");
    return $.post(
        "/userInfo",
        {session: "session"}
    );
}

function writeData(data) {
    document.getElementById("nombre").innerHTML = data.name.concat(" "+data.surnames);
}

async function addKromo(){
    var valoresKromo = [];
    valoresKromo.push(document.getElementById('nameCrear').value);
    valoresKromo.push(document.getElementById('precioCrear').value);
    valoresKromo.push(document.getElementById('cantMaxCrear').value);
    valoresKromo.push(document.getElementById('fileImg').value);

    console.log(valoresKromo);
}

function addCollection(){
    var valoresColeccion = [];
    valoresColeccion.push(document.getElementById('name').value);
    valoresColeccion.push(document.getElementById('price').value);
    valoresColeccion.push(document.getElementById('activated').value);

    console.log(valoresColeccion);
}

function editCollection(){

}