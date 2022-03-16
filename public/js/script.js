function option_clicked() {
    console.log(options[this.id].link, options[this.id].Texto)
    if (options[this.id].link !== null){
        current_choice = options[this.id].link
        load_history()
    }
}

function history_initialization(){
    var title = document.getElementById("history_title")
    title.innerText = main_json.Titulo
}

function load_history(){
    var content = document.getElementById("History")
    
    content.innerText = main_json.Escolhas[current_choice].História

    options = main_json.Escolhas[current_choice].Opções

    var options_div = document.getElementById("options")

    options_div.innerHTML = ""

    options.forEach(option => {
        let el = document.createElement('p')
        el.className = "option"
        el.id = option.Id
        el.innerText = `${option.Texto}`
        el.addEventListener('click', option_clicked, false)
        options_div.appendChild(el)
    });
    
}