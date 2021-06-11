function tryToRegister(){
    let email = document.getElementById('email').nodeValue
    let password = document.getElementById('password').nodeValue
    let password2 = document.getElementById('password2').nodeValue

    const regEmail = new RegExp('^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$')

    if(email.isEmpty()){
        //todo que pasa cuando esta vacio
    } 

    if(password.isEmpty()){

    }

    if(password2.isEmpty()){

    }

    if(!email.match(regEmail)){
        
    }

    //todo expresion para la contraseña??

    //todo query a la bbdd


}