async function start(){
    var auxLoad = await loadData();
    auxLoad = JSON.parse(auxLoad);
    writeData(auxLoad);
}

function closeSession() {
    console.log("Cerrando la sesion");
    return $.post(
        "/closeSession",
        {session: "session"}
    );
}

async function loadData() {
    console.log("Accediendo a db js");

    return $.post(
        "/userInfo",
        {session: "session"}
    );
}

function writeData(data) {
    document.getElementById("username").value =  data.username;
    document.getElementById("email").value =  data.email;
    document.getElementById("first_name").value =  data.name;
    document.getElementById("last_name").value =  data.surnames;
    document.getElementById("address").value =  data.address;
    document.getElementById("city").value =  data.city;
    document.getElementById("country").value =  data.country;
}