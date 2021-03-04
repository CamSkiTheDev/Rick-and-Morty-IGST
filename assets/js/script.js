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
    $poweredByImg: $('.icon-container > img'),
    $addToRadarBtn: $('#add-to-radar-btn'),
    $loadRadarBtn: $('.load-radar'),
    localStorageKey: 'sB43ZlxXzcmAVVBzxi2M8GCoL+geTduMiEZjnDdGZ2WhFMSpVd8e',
}

const renderCurrentBeing = (being) => {
    const radarArray = JSON.parse(localStorage.getItem(state.localStorageKey))
    let isOnRadar
    if(radarArray)
        isOnRadar = !!radarArray.filter(x => x.id === being.id).length
    state.currentBeing = {...being}
    state.$sidebarName.text(state.currentBeing.name)
    state.$sidebarImg.attr('src', state.currentBeing.image)
    if(isOnRadar)
        state.$addToRadarBtn.html('<b>Remove From Radar</b> <i class="fal fa-radar"></i>')
    else
        state.$addToRadarBtn.html('<b>Add To Radar</b> <i class="fal fa-radar"></i>')
    state.$sidebarStatus.html(`<b>Status: </b>${state.currentBeing.status}`)
    state.$sidebarSpecies.html(`<b>Species: </b>${state.currentBeing.species}`)
    state.$sidebarGender.html(`<b>Gender: </b>${state.currentBeing.gender}`)
    state.$sidebarLocation.html(`<b>Last Known Location</b></br>${state.currentBeing.location.name}`)
    state.$sidebarName[0].scrollIntoView({behavior: 'smooth'})
}

const renderBeingCard = (being) => {
    const $newBeingCard = $(`
        <div class="card" data-id="${being.id}">
            <img src="${being.image}" />
            <span>${being.name}</span>
            <span>${being.species} - ${being.status}</span>
        </div>
    `)

    $newBeingCard.on('click', (e) => {
        const { id } = e.currentTarget.dataset
        const resident = state.otherResidents.filter(resident => resident.id === parseInt(id))[0]
        renderCurrentBeing(resident)
    })

    return $newBeingCard
}

const getResidentData = async (url) => {
    const resident = await $.ajax({url})

    state.$otherResidents.append(renderBeingCard(resident))

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

const loadRadar = () => {
    let radar = JSON.parse(localStorage.getItem(state.localStorageKey))

    if(!radar || radar.length < 1)
        return alert('No beings are currently on your radar.')
    
    state.$otherResidentsTitle.text(`Being's On Your Radar`)
    state.$otherResidents.html(null)

    radar = radar.map(being => {
        
        state.$otherResidents.append(renderBeingCard(being))

        return being
    })

    state.otherResidents = radar
}

const addToRadar = () => {
    let personalRadar = JSON.parse(localStorage.getItem(state.localStorageKey))
    if(!personalRadar) {
        personalRadar = [{...state.currentBeing}]
        localStorage.setItem(state.localStorageKey, JSON.stringify(personalRadar))
        state.$addToRadarBtn.html('<b>Remove From Radar</b> <i class="fal fa-radar"></i>')
        alert(`${state.currentBeing.name} has been added to your radar.`)
    } else {
        if(personalRadar.filter(being => being.name === state.currentBeing.name).length < 1){
            personalRadar.push({...state.currentBeing})
            localStorage.setItem(state.localStorageKey, JSON.stringify(personalRadar))
            state.$addToRadarBtn.html('<b>Remove From Radar</b> <i class="fal fa-radar"></i>')
            alert(`${state.currentBeing.name} has been added to your radar.`)
        } else {
            personalRadar = personalRadar.filter(being => being.name !== state.currentBeing.name)
            localStorage.setItem(state.localStorageKey, JSON.stringify(personalRadar))
            state.$addToRadarBtn.html('<b>Add To Radar</b> <i class="fal fa-radar"></i>')
            alert(`${state.currentBeing.name} has been removed to your radar.`)
        }
    }
}

// Handle saerch bar form submition 
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

// Initalization function
const init = () => {
    state.$searchBar.on('submit', searchBeing)
    state.$addToRadarBtn.on('click', addToRadar)
    state.$loadRadarBtn.on('click', loadRadar)
    state.$poweredByImg.on('click', (e) => window.open(e.target.dataset.url, '_blank'))
    $.ajax({
        url: `${state.baseUri}/character/1` 
    }).then(data => setState(data))
}

init()