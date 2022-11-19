function HtmlDecode(s){
    let el = document.createElement("div");
    el.innerHTML = s;
    s = el.innerText;
    return s;
}

function option_clicked() {
    console.log(options[this.id].link, options[this.id].Texto)
    if (options[this.id].link !== null){
        current_choice = options[this.id].link
        load_history()
    }
}

function return_all(){
    current_choice = 0;
    load_history()
}

function history_initialization(){
    var title = document.getElementById("history_title")
    title.innerText = HtmlDecode(main_json.Titulo)
}

function load_history(){
    if(current_choice!=0){
        return_all_b.style.display = "inline"
    }
    else{
        return_all_b.style.display = "none"
    }
    var content = document.getElementById("History")
    
    content.innerText = HtmlDecode(main_json.Escolhas.find(ob=>{return ob.id==current_choice}).História)

    options = main_json.Escolhas.find(ob=>{return ob.id==current_choice}).Opções

    var options_div = document.getElementById("options")

    if(options.length <= 1){
        choice_p = document.getElementById("choice")
        choice_p.innerText = ""
    }else{
        choice_p = document.getElementById("choice")
        choice_p.innerText = "O que você escolhe?"
    }

    options_div.innerHTML = ""

    options.forEach(option => {
        let el = document.createElement('div')
        el.className = "option"
        el.id = option.Id
        el.innerText = HtmlDecode(`${option.Texto}`)
        el.addEventListener('click', option_clicked, false)
        options_div.appendChild(el)
    });
    
}

return_all_b = document.getElementById('return')
return_all_b.addEventListener('click', return_all, false)