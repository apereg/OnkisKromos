async function start(){
    var auxLoad = await loadData();
    auxLoad = JSON.parse(auxLoad);
    writeData(auxLoad);

    var albums = await loadAlbums();
    albums = JSON.parse(albums);

    var collections = await loadCollections(albums[1]);
    collections = JSON.parse(collections);

    var cards = await loadNumCards(albums[1]);
    cards = JSON.parse(cards);

    writeCollections(albums[1], collections, cards);
    writeStatus(collections.length);
    
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

async function loadAlbums() {
    console.log("Accediendo a db para sacar todas las colecciones");
    return $.post(
        "/userAlbums",
        {session: "session"}
    );
}

async function loadCollections() {
    console.log("Accediendo a db para sacar todas las colecciones");
    return $.post(
        "/collections",
    );
}

async function loadNumCards(albums) {
    var ids = [];
    for(let i=0; i<albums.length; i++) {
        ids.push(albums[i].idalbums);
    }
    console.log("Accediendo a db para sacar todas las colecciones");
    return $.post(
        "/cardsIdAlbums",
        {id: ids.toString()}
    );
}

function writeCollections(album, collections, cards) {
    var idCollections = formatAlbumNumbers(album);
    console.log(cards);
    for(let i=0; i<collections.length; i++) {
        switch(collections[i].idcollections) {
            case 1:
                //formula 1
                if(collections[i].activated == 1){
                    document.getElementById("f1_active").innerHTML = "Activa";
                }else{
                    document.getElementById("f1_active").innerHTML = "No activa";
                }
                document.getElementById("f1_price").innerHTML = collections[i].price;
                document.getElementById("f1_date").innerHTML = datetimeToDate(collections[i].date);
                break;
            case 2:
                //csgo
                if(collections[i].activated == 1){
                    document.getElementById("cs_active").innerHTML = "Activa";
                }else{
                    document.getElementById("cs_active").innerHTML = "No activa";
                }
                document.getElementById("cs_price").innerHTML = collections[i].price;
                document.getElementById("cs_date").innerHTML = datetimeToDate(collections[i].date);
                break;
            case 3:
                //super league
                if(collections[i].activated == 1){
                    document.getElementById("super_active").innerHTML = "Activa";
                }else{
                    document.getElementById("super_active").innerHTML = "No activa";
                }
                document.getElementById("super_price").innerHTML = collections[i].price;
                document.getElementById("super_date").innerHTML = datetimeToDate(collections[i].date);
                break;
            case 4:
                //nba
                if(collections[i].activated == 1){
                    document.getElementById("nba_active").innerHTML = "Activa";
                }else{
                    document.getElementById("nba_active").innerHTML = "No activa";
                }
                document.getElementById("nba_price").innerHTML = collections[i].price;
                document.getElementById("nba_date").innerHTML = datetimeToDate(collections[i].date);
                break;
            case 5:
                //rocket league
                if(collections[i].activated == 1){
                    document.getElementById("rocket_active").innerHTML = "Activa";
                }else{
                    document.getElementById("rocket_active").innerHTML = "No activa";
                }
                document.getElementById("rocket_price").innerHTML = collections[i].price;
                document.getElementById("rocket_date").innerHTML = datetimeToDate(collections[i].date);
                break;
            case 6:
                //valorant
                if(collections[i].activated == 1){
                    
                    document.getElementById("valorant_active").innerHTML = "Activa";
                }else{
                    document.getElementById("valorant_active").innerHTML = "No activa";
                }
                document.getElementById("valorant_price").innerHTML = collections[i].price;
                document.getElementById("valorant_date").innerHTML = datetimeToDate(collections[i].date);
                break;
            default:
                console.log("Se lio brutal");
        }
    }
    writeNumberCards(idCollections, cards);
}
function writeNumberCards(idCollections, cards) {
    for(let i=0; i<idCollections.length; i++) {
        switch(idCollections[i]) {
            case 1:
                document.getElementById("2_total").innerHTML = cards[i];
                break;
            case 2:
                document.getElementById("4_total").innerHTML = cards[i];
                break;
            case 3:
                document.getElementById("6_total").innerHTML = cards[i];
                break;
            case 4:
                document.getElementById("3_total").innerHTML = cards[i];
                break;
            case 5:
                document.getElementById("5_total").innerHTML = cards[i];
                break;
            case 6:
                document.getElementById("1_total").innerHTML = cards[i];
                break;
            default:
                console.log("Se lio brutal");
        }
    }
}

function writeStatus(numberCollections) {
    for(let i=0; i<numberCollections; i++) {
        var ruta = (i+1)+"_total";
        writeRealStatus(document.getElementById(ruta).innerHTML, i+1);
    }
}

function writeRealStatus(number, pos) {
    var ruta = pos+"_state"
    if(number==10){
        document.getElementById(ruta).innerHTML = "Finalizada";
    }else if(number>0 && number<10) {
        document.getElementById(ruta).innerHTML = "Completada parcialmente";
    }else{
        document.getElementById(ruta).innerHTML = "No iniciada";
    }
}

function formatAlbumNumbers(albums) {
    var output = [];
    for(let i=0; i<albums.length; i++) {
        output.push(albums[i].idcollection)
    }
    return output;
}

function datetimeToDate(mySQLDate){
    var date = mySQLDate.split("T");
    var aux = date[0].split("-");
    date = aux[2]+"/"+aux[1]+"/"+aux[0];
    return date;
}
