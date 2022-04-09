function option_clicked() {
    console.log(options[this.id].link, options[this.id].Texto)
    if (options[this.id].link !== null){
        current_choice = options[this.id].link
        load_history()
    }
}

function history_initialization(){
    var title = document.getElementById("history_title")
    title.innerHTML = main_json.Titulo
}

function load_history(){
    var content = document.getElementById("History")
    
    content.innerHTML = main_json.Escolhas.find(ob=>{return ob.id==current_choice}).História

    options = main_json.Escolhas.find(ob=>{return ob.id==current_choice}).Opções

    var options_div = document.getElementById("options")

    if(options.length <= 1){
        choice_p = document.getElementById("choice")
        choice_p.innerHTML = ""
    }else{
        choice_p = document.getElementById("choice")
        choice_p.innerHTML = "O que você escolhe?"
    }

    options_div.innerHTML = ""

    options.forEach(option => {
        let el = document.createElement('div')
        el.className = "option"
        el.id = option.Id
        el.innerHTML = `${option.Texto}`
        el.addEventListener('click', option_clicked, false)
        options_div.appendChild(el)
    });
    
}