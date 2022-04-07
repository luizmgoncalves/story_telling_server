function show_options(){
    if (this.value==''){
        this.value = 0
    }

    if(this.value > Number(this.max) || this.value < 0){
        window.alert("Número inválido, digite um número entre 0 e 5.")
        return 
    }

    let i=0
    let c_num = this.id.split("_")[2]

    let option = document.getElementById(c_num+"_option_"+i.toString())
    while (option !== null){
        i++
        option = document.getElementById(c_num + "_option_"+i.toString())
    }

    let table = document.getElementById("choice_table_" + c_num)

    if(this.value > i){
        for (;i<this.value;i++){
            let el = document.createElement('tr')
            let el2 = document.createElement('tr')
            el.id = c_num + "_option_"+i.toString()
            el2.id = c_num + "_option_link_"+i.toString()
    
            el.innerHTML = `
                        <td>Opção ${i}: </td> 
                        <td><input type="text" id="${c_num}_option_number_${i}"></td>`
                        el2.innerHTML = `
                        <td>Link ${i}: </td> 
                        <td><input type="number" value="-1" id="${c_num}_option_input_link_${i}"></td>
                        `
                        
            table.appendChild(el)
            table.appendChild(el2)
        }
    }else{
        for (;i>this.value;i--){
            option = document.getElementById(c_num+"_option_"+(i-1).toString())
            link = document.getElementById(c_num + "_option_link_"+(i-1).toString())
            option.remove()
            link.remove()
        }
    }

    
}

function add_choice() {
    let new_choice = document.createElement("div")
    new_choice.className = "input_atom"
    new_choice.style.maxWidth = '600px'
    console.log(actual_id)

    new_choice.innerHTML = `
        <h4>Escolha</h4>
        <table class="choice_table" id="choice_table_${actual_id}">
            <tr>
                <td>id: </td>
                <td><span id="id_${actual_id}">${actual_id}</span></td>
            </tr>
            <tr>
                <td>História: </td>
                <td><textarea class="input_text" id="history_${actual_id}" cols="30" rows="5" style="width:100%;"></textarea></td>
            </tr>
            <tr>
                <td>Quantidade de opções: </td>
                <td><input type="number" class="input_number" id="input_number_${actual_id}"  min="0" max="5"></td>
            </tr>
        </table>
    `

    parent = document.getElementById('choices')
    parent.appendChild(new_choice)

    let input_number = document.getElementById(`input_number_${actual_id}`)
    input_number.addEventListener('change', show_options)
    input_number.value = 0

    actual_id++

}

function generate_json(){
    json_result = {
        "Titulo": document.getElementById('title').value,
        "Escolhas": []
    }

    let i=0

    choice = document.getElementById(`choice_table_${i}`)

    for (;choice !== null;){
        choice_json = {
            "id": i,
            "História": document.getElementById(`history_${i}`).value,
            "Opções": []
        }
        
        let j=0

        let option = document.getElementById(i.toString()+"_option_number_"+j.toString())
        let link = document.getElementById(i.toString()+"_option_input_link_"+j.toString())
        while (option !== null){
            let option_json = {"Id": j, "Texto": option.value, "link": null}

            if(link.value ==  ''){
                option_json.link  = null
            }
            
            if (link.value >= 0 && link.value < actual_id){
                option_json.link = Number.parseInt(link.value)
            }

            choice_json["Opções"].push(option_json)

            j++
            option = document.getElementById(i.toString()+"_option_number_"+j.toString())
            link = document.getElementById(i.toString()+"_option_input_link_"+j.toString())
        }

        json_result['Escolhas'].push(choice_json)

        i++

        choice = document.getElementById(`choice_table_${i}`)
    }
    handle_json(json_result)
}

function deleteLastChoice(){
    choices = document.getElementsByClassName('input_atom')
    if(actual_id>1){
        choices[choices.length-1].remove()
        actual_id--
    }
}

var actual_id = 0

let add_choice_button = document.getElementById('add_choice')
let submit_button = document.getElementById('submit')
let delete_button = document.getElementById('del_choice')
submit_button.addEventListener('click', generate_json, false)
add_choice_button.addEventListener('click', add_choice, false)
delete_button.addEventListener('click', deleteLastChoice, false)

var json_result