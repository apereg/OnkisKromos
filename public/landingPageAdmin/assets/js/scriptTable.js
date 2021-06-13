async function start(){
    var auxLoad = await loadData();
    auxLoad = JSON.parse(auxLoad);
    writeData(auxLoad);

    var collections = await loadCollections();
    collections = JSON.parse(collections);

    var cards = await loadNumCards(collections);
    console.log(cards);
    cards = JSON.parse(cards);

    writeCollections(collections, cards);
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

async function loadCollections() {
    console.log("Accediendo a db para sacar todas las colecciones");
    return $.post(
        "/collections",
        {session: "session"}
    );
}

async function loadNumCards(collections) {
    var ids = [];
    for(let i=0; i<collections.length; i++) {
        ids.push(collections[i].idcollections);
    }
    console.log(ids);
    console.log(ids.toString());
    console.log("Accediendo a db para sacar todas las colecciones");
    return $.post(
        "/cardsCollections",
        {id: ids.toString()}
    );
}

function writeCollections(collections, cards) {
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
                if(cards[i].result!="null"){
                    document.getElementById("f1_total").innerHTML = cards[i].result;
                }else{
                    document.getElementById("f1_total").innerHTML = "0";
                }
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
                if(cards[i].result!="null"){
                    document.getElementById("cs_total").innerHTML = cards[i].result;
                }else{
                    document.getElementById("cs_total").innerHTML = "0";
                }
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
                if(cards[i].result!="null"){
                    document.getElementById("super_total").innerHTML = cards[i].result;
                }else{
                    document.getElementById("super_total").innerHTML = "0";
                }
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
                if(cards[i].result!="null"){
                    document.getElementById("nba_total").innerHTML = cards[i].result;
                }else{
                    document.getElementById("nba_total").innerHTML = "0";
                }
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
                if(cards[i].result!="null"){
                    document.getElementById("rocket_total").innerHTML = cards[i].result;
                }else{
                    document.getElementById("rocket_total").innerHTML = "0";
                }
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
                if(cards[i].result!="null"){
                    console.log("venimos")
                    document.getElementById("valorant_total").innerHTML = cards[i].result;
                }else{
                    document.getElementById("valorant_total").innerHTML = "0";
                }
                document.getElementById("valorant_date").innerHTML = datetimeToDate(collections[i].date);
                break;
            default:
                console.log("Se lio brutal");
        }
    }
}

function datetimeToDate(mySQLDate){
    var date = mySQLDate.split("T");
    var aux = date[0].split("-");
    date = aux[2]+"/"+aux[1]+"/"+aux[0];
    return date;
}
