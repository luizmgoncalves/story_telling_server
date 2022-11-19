function show_options(){
    let input_number = this
    if (input_number.value==''){
        input_number.value = 0
    }

    if(input_number.value > Number(input_number.max)){
        input_number.value = 5
        return 
    }
    if (input_number.value < 0){
        input_number.value = 0
        return 
    }

    let i=0
    let c_num = input_number.id.split("_")[2]

    let option = document.getElementById(c_num+"_option_"+i.toString())
    while (option !== null){
        i++
        option = document.getElementById(c_num + "_option_"+i.toString())
    }

    let table = document.getElementById("option_list_" + c_num)

    if(input_number.value > i){
        for (;i<input_number.value;i++){
            let el = document.createElement('div')
            el.className = 'mb-3 form_item'
            let el2 = document.createElement('div')
            el2.className = 'mb-3 form_item'
            el.id = c_num + "_option_"+i.toString()
            el2.id = c_num + "_option_link_"+i.toString()
    
            el.innerHTML = `
                        <label>Opção ${i}: </label> 
                        <textarea rows="3" style="width:100%;" id="${c_num}_option_number_${i}">`
                        el2.innerHTML = `
                        <label>Link ${i}: </label> 
                        <input type="number" value="-1" id="${c_num}_option_input_link_${i}" style="width:80px;">
                        `
                        
            table.appendChild(el)
            table.appendChild(el2)
        }
    }else{
        for (;i>input_number.value;i--){
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
        <div class="container" id="choice_table_${actual_id}">
            
            <div class="mb-3 form_item">
                <label>id: </label>
                <span id="id_${actual_id}">${actual_id}</span>
            </div>
            
            <div class="mb-3 form_item">
                <label>História: </label>
                <textarea id="history_${actual_id}" cols="30" rows="5" style="width:100%;"></textarea>
            </div>

            <div class="mb-3" id="option_list_${actual_id}">
            </div>
            
            <div class="mb-3" style="text-align:right;">
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button class="btn btn-outline-dark" id="add_button_${actual_id}" style="height:37px;width:37px;">+</button><button class="btn btn-outline-dark" id="sub_button_${actual_id}" style="height:37px;width:37px;">-</button>
                </div>
            </div>
            <input type="number" class="input_number" id="input_number_${actual_id}"  min="0" max="5" hidden="true">
        </div>
    `

    parent = document.getElementById('choices')
    parent.appendChild(new_choice)

    let add_option_b = document.getElementById(`add_button_${actual_id}`)
    let sub_option_b = document.getElementById(`sub_button_${actual_id}`)

    add_option_b.addEventListener('click', add_option)

    sub_option_b.addEventListener('click', sub_option)


    let input_number = document.getElementById(`input_number_${actual_id}`)
    input_number.addEventListener('change', show_options)
    input_number.value = 0

    actual_id++

}

function add_option(){
    let c_num = this.id.split("_")[2]
    quant_options = document.getElementById(`input_number_${c_num}`)
    quant_options.value ++
    quant_options.dispatchEvent(new Event("change"))
}

function sub_option(){
    let c_num = this.id.split("_")[2]
    quant_options = document.getElementById(`input_number_${c_num}`)
    quant_options.value --
    quant_options.dispatchEvent(new Event("change"))
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