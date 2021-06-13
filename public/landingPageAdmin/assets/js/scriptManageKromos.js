var valoresKromo = [];
var valoresColeccion = [];
var auxTimes;
var auxTimesAdd;

/* Inicialization */
async function start(){
    var auxLoad = await loadNameUsr();
    auxLoad = JSON.parse(auxLoad);
    writeData(auxLoad);
    auxTimesAdd = 0;
    auxTimes = 0;
}

/* POST methods */
async function closeSession() {
    console.log("Cerrando la sesion");
    return $.post(
        "/closeSession",
        {session: "session"}
    );
}

async function loadNameUsr() {
    return $.post(
        "/userInfo",
        {session: "session"}
    );
}

async function saveDataDB(valoresStringCol) {
    console.log("Accediendo a db js");
    return $.post(
        "/collectionAdd",
        {kromos: valoresKromo.toString(),
            collection: valoresStringCol}
    );
}

async function saveImgDB(path) {
    console.log(path);
    return $.post(
        "/upload"
    );
}

/* Main functions */
function addKromoFront(nameKromo){
    if(auxTimes<10){
        var li = document.createElement('li');
        li.appendChild(document.createTextNode("Kromo "+(auxTimes+1)+": "+nameKromo));
        document.getElementById('idUl').appendChild(li);
        auxTimes++;
    }
}

function writeData(data) {
    document.getElementById("nombre").innerHTML = data.name.concat(" "+data.surnames);
}

async function addKromo(){
    var nameKromo = document.getElementById('nameCrear').value;
    var precioKromo = document.getElementById('precioCrear').value;
    var cantMaxKromo = document.getElementById('cantMaxCrear').value;
    var fileImg = document.getElementById('fileImg').value;
    var valoresString;

    if(auxTimesAdd===9){
        $('#kromo').modal('hide');
        document.getElementById('nameCrear').value='';
        document.getElementById('precioCrear').value='';
        document.getElementById('cantMaxCrear').value='';
        document.getElementById('fileImg').value='';
    }

    if(nameKromo.length>0 && nameKromo.length<=45){
        if(precioKromo>=25 && precioKromo<=150){
            if(cantMaxKromo>=5 && cantMaxKromo<=10){
                if (fileImg.length>0) {
                    valoresString = nameKromo.concat("-");
                    valoresString = valoresString.concat(precioKromo+"-");
                    valoresString = valoresString.concat(cantMaxKromo+"-");
                    var path = fileImg.split("\\");
                    valoresString = valoresString.concat(path[2]);
                   
                    addKromoFront(nameKromo);
                    await saveImgDB(fileImg);
                    valoresKromo.push(valoresString);
                    auxTimesAdd++;
                }else{
                    swal('Oops...', 'Debe seleccionar una imagen', 'error'); 
                }
            }else{
                swal('Oops...', 'La cantidad maxima de cromos ha de ser entre 5 y 10', 'error'); 
            }
        }else{
            swal('Oops...', 'El precio de los cromos ha de ser entre 5 y 10', 'error'); 
        }
    }else{
        swal('Oops...', 'Debe establecer una nombre para el cromo', 'error');  
    }

}

async function addCollection(){
    var nameCol= document.getElementById('name').value;
    var priceCol = document.getElementById('price').value;
    var activatedColY = document.getElementById('activatedYes').checked;
    var activatedColN = document.getElementById('activatedNo').checked;
    var valoresStringCol;

    if(valoresKromo.length===10){
        if(nameCol.length>0 && nameCol.length<=45){
            if(priceCol>=150 && priceCol<=350){
                if(activatedColY || activatedColN){
                    valoresStringCol = nameCol.concat("-");
                    valoresStringCol = valoresStringCol.concat(priceCol+"-");
                    if(activatedColY){
                        valoresStringCol = valoresStringCol.concat("1"+"-");
                    }else{
                        valoresStringCol = valoresStringCol.concat("0");
                    }
                    await saveDataDB(valoresStringCol);
                    swal('¡Perfecto!', 'Colección añadida', 'success'); 
                }else{
                    swal('Oops...', 'Debe seleccionar una de las opciones Activa o No Activa', 'error'); 
                }
            }else{
                swal('Oops...', 'El precio debe establecerse entre 150 y 350 puntos', 'error'); 
            }
        }else{
            swal('Oops...', 'Debe establecer una nombre para la colección', 'error'); 
        }
    }else{
        swal('Oops...', 'Debe crear 10 cromos', 'error');
    }
}

function editCollection(){

}