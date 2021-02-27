const state = {
    baseUri:'https://rickandmortyapi.com/api',
    currentBeing: null,
    otherResidents: [],
    $sidebarName: $('.person-wrapper > h1'),
    $sidebarImg: $('.person-wrapper > img'),
    $sidebarStatus: $('#sidebar-status'),
    $sidebarSpecies: $('#sidebar-species'),
    $sidebarGender: $('#sidebar-gender'),
    $sidebarLocation: $('#sidebar-location'),
    $otherResidents: $('.being-card-container'),
    $otherResidentsTitle: $('#other-residents-title'),
    $searchBar: $('.search-bar'),
    $searchInput: $('.search-bar > input'),
    $poweredByImg: $('.icon-container > img')
}

const renderCurrentBeing = (being) => {
    state.currentBeing = {...being}
    state.$sidebarName.text(state.currentBeing.name)
    state.$sidebarImg.attr('src', state.currentBeing.image)
    state.$sidebarStatus.html(`<b>Status: </b>${state.currentBeing.status}`)
    state.$sidebarSpecies.html(`<b>Species: </b>${state.currentBeing.species}`)
    state.$sidebarGender.html(`<b>Gender: </b>${state.currentBeing.gender}`)
    state.$sidebarLocation.html(`<b>Last Known Location</b></br>${state.currentBeing.location.name}`)
}

const getResidentData = async (url) => {
    const resident = await $.ajax({url})

    const $newResidentCard = $(`
        <div class="card" data-id="${resident.id}">
            <img src="${resident.image}" />
            <span>${resident.name}</span>
            <span>${resident.species} - ${resident.status}</span>
        </div>
    `)

    $newResidentCard.on('click', (e) => {
        const { id } = e.currentTarget.dataset
        const resident = state.otherResidents.filter(resident => resident.id === parseInt(id))[0]
        renderCurrentBeing(resident)
    })
        
    state.$otherResidents.append($newResidentCard)

    return resident
}

const setState = async (data) => {
    renderCurrentBeing(data)

    state.$otherResidentsTitle.text(`Other Residents of ${state.currentBeing.location.name}`)
    state.$otherResidents.html(null)

    if(state.currentBeing.location.url) 
        await $.ajax({
            url: state.currentBeing.location.url
        }).then(async data => {
            state.otherResidents = []
            for (residentUrl of data.residents) {
                state.otherResidents.push(await getResidentData(residentUrl))
            }
        })
}

const searchBeing = (e) => {
    e.preventDefault()
    const searchTerm = state.$searchInput.val().trim()
    
    if(!searchTerm)
        return alert('Please enter a beings name.')
    
    $.ajax({
        url: `${state.baseUri}/character/?name=${encodeURI(searchTerm)}` 
    }).then(data => setState(data.results[0]))

    state.$searchInput.val('')
}

const init = () => {
    state.$searchBar.on('submit', searchBeing)
    state.$poweredByImg.on('click', (e) => window.open(e.target.dataset.url, '_blank'))
    $.ajax({
        url: `${state.baseUri}/character/1` 
    }).then(data => setState(data))
}

init()