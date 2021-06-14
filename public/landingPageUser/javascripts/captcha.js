async function start(){
    var auxLoad = await loadData();
    auxLoad = JSON.parse(auxLoad);
    writeData(auxLoad);
}

async function loadData() {
    return $.post(
        "/userInfo",
        {session: "session"}
    );
}

function writeData(data) {
    document.getElementById("nombre").innerHTML = data.name.concat(" "+data.surnames);
}

async function captcha() {
    //Captcha response
    var formData = new FormData(document.getElementById('submit_form'));
    var captcha = formData.get('g-recaptcha-response');

    console.log(captcha);
    var solucion = false;
    //Opcion con jquery

    alert( await verifyCaptcha(captcha));
                  
    if('true' === await verifyCaptcha(captcha)){
        alert(solucion);  
        console.log("We did it");
        solucion = true;
    }

    

    if('true' === result){
        console.log("has ganado 50 coins ");
        //Give points
    }else{
        console.log("Se ha producido un error");
        //Nothing
    }
                      
}

async function verifyCaptcha(captcha) {
    return $.post(
        "/submit", {captcha: captcha},                 
    );
}


async function givePoints(points){
    await ($.post('/addPoints', {points: points}, function (data, status) {
        if (status !== 'success') swal("¡Oh no!", "Ha ocurrido un error al otorgar los puntos, ¡Intentalo de nuevo!", "error", {button: "¡Aceptar!",});
}));
}