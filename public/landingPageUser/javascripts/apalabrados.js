let ANSWERS = []

function start(){
    newQuestions()
}

function newQuestions(){
    document.getElementById('mainCol').getElementsByTagName('input')[0].value = ''
    document.getElementById('mainCol').getElementsByTagName('input')[1].value = ''
    document.getElementById('mainCol').getElementsByTagName('input')[2].value = ''

    let questions = []
    $.post('/newQuestions', function (data, status){
        if (status === 'success') {
            const dataParsed = JSON.parse(data)
            questions.push(dataParsed.question[0])
            questions.push(dataParsed.question[1])
            questions.push(dataParsed.question[2])
            ANSWERS= []
            ANSWERS.push(dataParsed.answer[0])
            ANSWERS.push(dataParsed.answer[1])
            ANSWERS.push(dataParsed.answer[2])
        } else {
            alert('Error en el get al servidor')
        }
    })
    document.getElementById('definition1').innerText = questions[0]
    document.getElementById('definition2').innerText = questions[1]
    document.getElementById('definition3').innerText = questions[2]
}

function checkAnswers(){
    let possibleAnswers = []
    possibleAnswers.push(document.getElementById('mainCol').getElementsByTagName('input')[0].value)
    possibleAnswers.push(document.getElementById('mainCol').getElementsByTagName('input')[1].value)
    possibleAnswers.push(document.getElementById('mainCol').getElementsByTagName('input')[2].value)

    console.log(possibleAnswers)

    let hits = 0
    for (let i = 0; i < ANSWERS.length; i++)
        if(ANSWERS[i].toUpperCase() === possibleAnswers[i].toUpperCase())
            hits++

    let text = ''
    switch (hits){
        case 0:
            text = 'No has acertado ninguna palabra.'
            break;
        case 1:
            text = 'Acertaste una.'
            break;
        case 2:
            text = 'Acertaste dos.'
            break;
        case 3:
            text = 'Acertaste tres.'
            break;
        default:
            text = 'error'
    }

    alert(text)

    newQuestions()
}