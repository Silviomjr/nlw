function populateufs() {
    const ufselect = document.querySelector("select[name = uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json() )
    .then( states => {

        for( const state of states) {
            ufselect.innerHTML += `<option value = "${state.id}">${state.nome}</option>`
        }
        
    })
}

populateufs()

function getcities(event) {
    const cityselect = document.querySelector("select[name = city]")
    const stateinput = document.querySelector("input[name = state]")

    const ufvalue = event.target.value

    const indexofselectedstate = event.target.selectedIndex
    stateinput.value = event.target.options[indexofselectedstate].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufvalue}/municipios`

    cityselect.innerHTML = "<option value>Selecione a Cidade</option>"
    cityselect.disabled = true

    fetch(url)
    .then((res) => { return res.json() })
    .then( cities => {
        
        for(city of cities) {
            cityselect.innerHTML += `<option value = "${city.nome}">${city.nome}</option>`
        }

        cityselect.disabled = false
    })

}



document
    .querySelector("select[name = uf]")
    .addEventListener("change", getcities)


//Itens de coleta

//pegar todos os li's

const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []




function handleSelectedItem(event) {
    
    const itemLi = event.target
    //add or remove uma classe com JS

    itemLi.classList.toggle("selected")
        
    const itemId = itemLi.dataset.id

    console.log('ITEM ID: ', itemId)

    //verificar se existem items selecionadas, se sim pegar os items selecionados

    const alreadySelected = selectedItems.findIndex(item => {
        const itemFound = item == itemId
        return itemFound
    })
    
    //se selecionado, tira a seleção
    if(alreadySelected != -1) {
        //remover da seleção

        const filteredItems = selectedItems.filter(item => {
             const itemIsDifferent = item != itemId
             return itemIsDifferent
        })
        selectedItems = filteredItems
    } else {
        selectedItems.push(itemId)
    }



    //se não estiver selecionado, adicionar à seleção


    console.log("selectedItems: ", selectedItems)
    //atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems

    
}