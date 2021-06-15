var valoresKromo = [];
var valoresColeccion = [];
var valoresColeccionEdit = [];
var auxTimes;
var auxTimesAdd;
var imgs = [];
var idCollectionEdit;
var nameColK;

/* Inicialization */
async function start(){
    var auxLoad = await loadNameUsr();
    auxLoad = JSON.parse(auxLoad);
    writeData(auxLoad);
    auxTimesAdd = 0;
    auxTimes = 0;

    addRow(4);
}

/* POST methods */
async function closeSession() {
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
    return $.post(
        "/collectionAdd",
        {kromos: valoresKromo.toString(),
            collection: valoresStringCol}
    );
}

async function saveDataDBEdit(valoresStringCol, idCollectionEdit){
    return $.post(
        "/collectionEdit",
        {collection: valoresStringCol,
            idCol: idCollectionEdit}
    );
}

async function saveImgDB() {
    return $.post(
        "/upload",
        {images: imgs}
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


function modalId(id){
    idCollectionEdit = id;
}

async function addKromo(){
    var nameKromo = document.getElementById('nameCrear').value;
    var precioKromo = document.getElementById('precioCrear').value;
    var cantMaxKromo = document.getElementById('cantMaxCrear').value;
    var fileImg = document.getElementById('fileImg').value;
    imgs.push(fileImg);
    var valoresString;

    if(auxTimesAdd===9){
        $('#kromo').modal('hide');
        document.getElementById('nameCrear').value='';
        document.getElementById('precioCrear').value='';
        document.getElementById('cantMaxCrear').value='';
        //document.getElementById('fileImg').value='';
    }

    nameColK = document.getElementById('name').value;
    if(nameColK.length>0 && nameColK.length<=45){
        if(nameKromo.length>0 && nameKromo.length<=45){
            if(precioKromo>=25 && precioKromo<=150){
                if(cantMaxKromo>=5 && cantMaxKromo<=10){
                        valoresString = nameKromo.concat("-");
                        valoresString = valoresString.concat(precioKromo+"-");
                        valoresString = valoresString.concat(cantMaxKromo+"-");
                        //var path = 'Kromo'+(auxTimesAdd+1)+'_'+nameColK;
                        //valoresString = valoresString.concat(path);
                        addKromoFront(nameKromo);
                        valoresKromo.push(valoresString);
                        auxTimesAdd++;
                }else{
                    swal('Oops...', 'La cantidad maxima de cromos ha de ser entre 5 y 10', 'error'); 
                }
            }else{
                swal('Oops...', 'El precio de los cromos ha de ser entre 25 y 150', 'error'); 
            }
        }else{
            swal('Oops...', 'Debe establecer una nombre para el cromo', 'error');  
        }
    }else{
        swal('Oops...', 'Debe establecer una nombre para la colección', 'error');
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
                    swal('¡Perfecto!', 'Colección añadida', 'success');
                    await saveDataDB(valoresStringCol);
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

async function editCollection(){
    var nameCol= document.getElementById('nombreKromoEdit').value;
    var priceCol = document.getElementById('precioKromoEdit').value;
    var activatedColY = document.getElementById('activatedYesEdit').checked;
    var activatedColN = document.getElementById('activatedNoEdit').checked;
    var valoresStringCol;

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
                swal('¡Perfecto!', 'Colección modificada', 'success');
                await saveDataDBEdit(valoresStringCol, idCollectionEdit);
            }else{
                swal('Oops...', 'Debe seleccionar una de las opciones Activa o No Activa', 'error'); 
            }
        }else{
            swal('Oops...', 'El precio debe establecerse entre 150 y 350 puntos', 'error'); 
        }
    }else{
        swal('Oops...', 'Debe establecer una nombre para la colección', 'error'); 
    }
}

function addRow(id){
    const table = document.getElementById("edit_table");

    let row = document.createElement('tr');

    let nameCell = document.createElement('td');

        let nameImage = document.createElement("img");
        
        //Source de la imagen
        nameImage.src = "http://onkisko.ciscofreak.com:3000/landingPageUser/assets/img/avatars/profile-pic.jpg";
        nameImage.width = '30';
        nameImage.height = '30';
        nameImage.className = 'rounded-circle me-2';

        let nameText = document.createTextNode('Ejemplo');
       
        nameCell.appendChild(nameImage);
        nameCell.innerHTML += '&nbsp;';
        nameCell.appendChild(nameText);

        let editCell = document.createElement('td');

        let editLink = document.createElement('a');

        editLink.innerText = "Editar";
        editLink.href = '#collection';
        editLink.setAttribute('data-bs-toggle', "modal");
        editLink.setAttribute('onclick', "modalId("+id+");");
       
        editCell.appendChild(editLink);

        row.appendChild(nameCell);
        row.appendChild(editCell);

        table.appendChild(row);
}
