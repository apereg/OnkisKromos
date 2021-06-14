var kromos = [];
var index = 0;

async function start() {
    var auxLoad = await loadData();
    auxLoad = JSON.parse(auxLoad);
    writeData(auxLoad);

    kromos = await loadCards();
    kromos = JSON.parse(kromos);

    writeCard();
}

async function loadData() {
    console.log("Accediendo a db js");
    return $.post(
        "/userInfo",
        {session: "session"}
    );
}

function writeData(data) {
    document.getElementById("nombre").innerHTML = data.name.concat(" "+data.surnames);
}

async function loadCards() {
    console.log("Accediendo a db js");
    return $.post(
        "/cards",
    );
}

async function writeCard() {
    document.getElementById("name").value = kromos[index].name;
    document.getElementById("price").value = kromos[index].price;
    document.getElementById("units").value = kromos[index].maxUnits;
    var nameCol = await idToNameCollection(kromos[index].idcollections);
    namecol = JSON.parse(nameCol);
    document.getElementById("nameCol").value = nameCol.replaceAll("\"", "");
    var path = `url(../resources/kromos/${kromos[index].imagePath}.png)`;
    document.getElementById("expositor").style.backgroundImage = path;
}

async function idToNameCollection(id) {
    console.log("Accediendo a db para sacar el nombre de la colección");
    return $.post(
        "/nameCollectionId",
        {id: id}
    );
}

function stepBack() {
    if(index>0) {
        index --;
        writeCard();
    }
}

function stepForward() {
    if(index<kromos.length-1){
        index ++;
        writeCard();
    }
}