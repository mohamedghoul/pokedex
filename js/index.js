// Get container from HTML
const container = document.getElementById('container')

// TODO Pokemon

// Function to get the number of Pokemon in the PokeAPI
async function getPokemonCount(){
    const url = 'https://pokeapi.co/api/v2/pokemon-species'
    const response = await fetch(url)
    const data = await response.json()
    return data.count
}

// Function to fetch the pokemon data from the PokeAPI
async function fetchPokemons() {
    const count = await getPokemonCount()
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${count}`
    const pokemonResponse = await fetch(pokemonUrl)
    const pokemonData = await pokemonResponse.json()
    const pokemons = pokemonData.results.map((result, index) => ({
        ...result,
        name: result.name,
        id: index + 1,
        image: (index + 1 >= 899) ? '../media/questionmark_icon.png' : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index+1}.png`
    }))
    displayPokemon(pokemons)
}

// Function to display Pokemon on the home screen
function displayPokemon(pokemons) {
    // HTML string to inject into the home page
    const pokemonToHTML = pokemons.map((pokemon) => `
    <li class="card" onclick="selectPokemon(${pokemon.id})">
    <h4 class="card-id">${pokemon.id}</h4>
    <img class="card-image" src="${pokemon.image}"/>
    <h2 class="card-name">${pokemon.name}</h2>
    </li>
    `
    ).join('')
    container.innerHTML = `
    <div class="bar">
        <input type="text" id="search-input" onkeyup="searchPokemon()" placeholder="Search for Pokemon" title="Enter a pokemon name">
        <button id="random-button" onclick="randomPokemon()">Random</button>
        <p class="bar-text">Sort by:</p>
        <select id="sort-select" onchange="sortPokemon(document.getElementById('sort-select').value)">
            <option value="id (ascending)">ID (Ascending)</option>
            <option value="id (descending)">ID (Descending)</option>
            <option value="name (ascending)">Name (Ascending)</option>
            <option value="name (descending)">Name (Descending)</option>
        </select>
        <p class="bar-text">Filter by:</p>
        <select id="filter-select" onchange="filterPokemon()">
            <option value="all">All</option>
        </select>
    </div>
    <ol id="pokedex">${pokemonToHTML}</ol>
    `
}

// Function that returns the gender of a particular pokemon
async function getPokemonGender(pokemon_name){
    let gender = []

    const maleUrl = 'https://pokeapi.co/api/v2/gender/2/'
    const maleResponse = await fetch(maleUrl)
    const maleJson = await maleResponse.json()

    for (var i = 0 ; i < maleJson.pokemon_species_details.length ; i++) {
        if (maleJson.pokemon_species_details[i].pokemon_species["name"] == pokemon_name) {
            gender.push("male");
        }
    }
    
    const femaleUrl = 'https://pokeapi.co/api/v2/gender/1/'
    const femaleResponse = await fetch(femaleUrl)
    const femaleJson = await femaleResponse.json()

    for (var i = 0 ; i < femaleJson.pokemon_species_details.length ; i++) {
        if (femaleJson.pokemon_species_details[i].pokemon_species["name"] == pokemon_name) {
            gender.push("female");
        }
    }

    const genderlessUrl = 'https://pokeapi.co/api/v2/gender/3/'
    const genderlessResponse = await fetch(genderlessUrl)
    const genderlessJson = await genderlessResponse.json()

    for (var i = 0 ; i < genderlessJson.pokemon_species_details.length ; i++) {
        if (genderlessJson.pokemon_species_details[i].pokemon_species["name"] == pokemon_name) {
            gender.push("genderless");
        }
    }

    if(gender.length == 0){
        gender.push("not applicable")
    }
    return gender
}

// Function that is executed when a user clicks on a pokemon
// Fetches the individual pokemon's data from the PokeAPI and calls another function to display the data in a popup window
async function selectPokemon(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`
    let response = await fetch(url)
    const pokemon = await response.json()
    url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
    response = await fetch(url)
    const species = await response.json()
    pokemon.generation = species.generation.name
    if (species.evolution_chain != null){
        url = species.evolution_chain.url
        response = await fetch(url)
        const evolution_chain = await response.json()
        pokemon.evolution_chain = evolution_chain
    }
    const gender = await getPokemonGender(pokemon.name)
    pokemon.gender = gender.map((gend) => gend).join(', ')
    displayPokemonPopup(pokemon)
}

// Function that displays pokemon details in a popup window
function displayPokemonPopup(pokemon){
    const type = pokemon.types.length > 0 ? pokemon.types.map((type) => type.type.name).join(", ") : 'None'
    const moves = pokemon.moves.length > 0 ? pokemon.moves.map((move) => { return '<p class="table-cell">' + move.move.name + '</p>' }).join(' ') : 'None'
    const abilities = pokemon.abilities.length > 0 ? pokemon.abilities.map((ability) => { return '<p class="table-cell">' + ability.ability.name + '</p>' }).join(' ') : 'None'
    const image = (pokemon.id <= 898) ? pokemon.sprites['front_default'] : '../media/questionmark_icon.png'
    // HTML string for the popup window
    const pokemonDetailsToHTML = `
    <div id="pokemon-popup">
        <button id="close-popup" onclick="closePokemonPopup()">X</button>
        <div class="pokemon-popup-content">
            <img class="popup-image" src="${image}"/>
            <div class="popup-info">
                <h2 class="popup-title">${pokemon.id} | ${pokemon.name}</h2>
                <h3>${pokemon.generation}</h3>
                <p><strong>Gender: </strong>${pokemon.gender}<br>
                <strong>Type: </strong>${type}<br>
                <strong>Height: </strong>${pokemon.height}<br>
                <strong>Weight: </strong>${pokemon.weight}</p>
                <h4>Stats</h4>
                <p><strong>HP: </strong>${pokemon.stats[0].base_stat}<br>
                <strong>Attack: </strong>${pokemon.stats[1].base_stat}<br>
                <strong>Defense: </strong>${pokemon.stats[2].base_stat}<br>
                <strong>Special Attack: </strong>${pokemon.stats[3].base_stat}<br>
                <strong>Sepcial Defense: </strong>${pokemon.stats[4].base_stat}<br>
                <strong>Speed: </strong>${pokemon.stats[5].base_stat}</p>
                <h4>Moves</h4>
                <div class="table">
                    ${moves}
                </div>
                <h4>Abilities</h4>
                <div class="table">
                    ${abilities}
                </div>
                <h4>Evolutions</h4>
                <div class="evolution-container">
                    ${(pokemon.evolution_chain != undefined) ? displayEvolutionChain(pokemon.evolution_chain) : 'No evolution chain found'}
                </div>
            </div>
        </div>
    </div>
    `
    container.innerHTML = pokemonDetailsToHTML + container.innerHTML
}

// Function to close the popup and restore the home page to its original state
function closePokemonPopup() {
    const popup = document.querySelector("#pokemon-popup")
    popup.parentElement.removeChild(popup)
    fetchPokemons()
}

// Function to search for a pokemon
function searchPokemon() {
    var input = document.getElementById("search-input");
    var filter = input.value.toUpperCase();
    var pokedex = document.getElementById("pokedex");
    var pokemon = pokedex.getElementsByTagName("li");
    for (i = 0; i < pokemon.length; i++) {
        var name = pokemon[i].querySelector(".card-name");
        var text = name.textContent || name.innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
            pokemon[i].style.display = "";
        } else {
            pokemon[i].style.display = "none";
        }
    }
}

async function randomPokemon(){
    const count = await getPokemonCount()
    const random = Math.floor(Math.random() * count) + 1
    selectPokemon(random)
}

function displayEvolutionChain(evolutionChain) {
    let chain = [];
    var data = evolutionChain.chain;
    
    do {
      let numberOfEvolutions = data.evolves_to.length;  
      chain.push(data.species.name)
    
      if(numberOfEvolutions > 1) {
        for (let i = 1;i < numberOfEvolutions; i++) { 
          chain.push(data.evolves_to[i].species.name)
        }
      }

      data = data.evolves_to[0];  
    }
    while (data != undefined && data.hasOwnProperty('evolves_to'));
    if (chain.length > 1){
        const evolutionChainToHTML = chain.map((evolution) => `
            ${evolution}
        `
        ).join(' \u2192 ')
        return evolutionChainToHTML
    }
    else {
        return 'No evolution chain found'
    }
}

function sortPokemon(sortBy) {
    const pokedex = document.getElementById("pokedex");
    const pokemon = pokedex.getElementsByTagName("li");
    const pokemonArray = Array.from(pokemon)
    if (sortBy == 'id (ascending)'){
        const sortedPokemon = pokemonArray.sort((a, b) => {
            const idA = a.querySelector(".card-id").textContent.toUpperCase();
            const idB = b.querySelector(".card-id").textContent.toUpperCase();
            return idA - idB;
        }).map((pokemon) => pokemon.outerHTML)
        pokedex.innerHTML = sortedPokemon.join('')
    }
    else if (sortBy == 'id (descending)'){
        const sortedPokemon = pokemonArray.sort((a, b) => {
            const idA = a.querySelector(".card-id").textContent.toUpperCase();
            const idB = b.querySelector(".card-id").textContent.toUpperCase();
            return idB - idA;
        }).map((pokemon) => pokemon.outerHTML)
        pokedex.innerHTML = sortedPokemon.join('')
    }
    else if (sortBy == 'name (ascending)'){
        const sortedPokemon = pokemonArray.sort((a, b) => {
            const nameA = a.querySelector(".card-name").textContent.toUpperCase();
            const nameB = b.querySelector(".card-name").textContent.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        }).map((pokemon) => pokemon.outerHTML)
        pokedex.innerHTML = sortedPokemon.join('')
    }
    else if (sortBy == 'name (descending)'){
        const sortedPokemon = pokemonArray.sort((a, b) => {
            const nameA = a.querySelector(".card-name").textContent.toUpperCase();
            const nameB = b.querySelector(".card-name").textContent.toUpperCase();
            if (nameB < nameA) {
                return -1;
            }
            if (nameB > nameA) {
                return 1;
            }
            return 0;
        }).map((pokemon) => pokemon.outerHTML)
        pokedex.innerHTML = sortedPokemon.join('')
    }
}

// TODO Moves

// Function to get the number of moves in the PokeAPI
async function getMoveCount(){
    const url = 'https://pokeapi.co/api/v2/move'
    const response = await fetch(url)
    const data = await response.json()
    return data.count
}

// Function to fetch moves from the PokeAPI
async function fetchMoves() {
    const count = await getMoveCount()
    const movesUrl = `https://pokeapi.co/api/v2/move/?limit=${count}`
    const movesResponse = await fetch(movesUrl)
    const movesData = await movesResponse.json()
    const moves = movesData.results.map((result, index) => ({
        ...result,
        name: result.name,
        id: index + 1,
    }))
    displayMoves(moves)
}

// Function to display moves on the home screen
function displayMoves(moves) {
    // HTML string to inject into the home page
    const moveToHTML = moves.map((move) => `
    <li class="card" onclick="selectMove(${move.id})">
    <h4 class="card-id">${move.id}</h4>
    <h2 class="card-name">${move.name}</h2>
    </li>
    `
    ).join('')
    container.innerHTML = `
    <div class="bar">
        <input type="text" id="search-input" onkeyup="searchMoves()" placeholder="Search for moves" title="Enter a move">
        <button id="random-button" onclick="randomMove()">Random</button>
        <p class="bar-text">Sort by:</p>
        <select id="sort-select" onchange="sortMoves(document.getElementById('sort-select').value)">
            <option value="id (ascending)">ID (Ascending)</option>
            <option value="id (descending)">ID (Descending)</option>
            <option value="name (ascending)">Name (Ascending)</option>
            <option value="name (descending)">Name (Descending)</option>
        </select>
        <p class="bar-text">Filter by:</p>
        <select id="filter-select" onchange="filterMoves()">
            <option value="all">All</option>
        </select>
    </div>
    <ol id="moves">${moveToHTML}</ol>
    `
}

// Function to search for moves
function searchMoves() {
    var input = document.getElementById("search-input");
    var filter = input.value.toUpperCase();
    var moves = document.getElementById("moves");
    var move = moves.getElementsByTagName("li");
    for (i = 0; i < move.length; i++) {
        var name = move[i].querySelector(".card-name");
        var text = name.textContent || name.innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
            move[i].style.display = "";
        } else {
            move[i].style.display = "none";
        }
    }
}

async function randomMove(){
    const count = await getMoveCount()
    const random = Math.floor(Math.random() * count) + 1
    selectMove(random)
}

// Function that fetches an ability
async function selectMove(id) {
    let url = `https://pokeapi.co/api/v2/move/${id}`
    let response = await fetch(url)
    const move = await response.json()
    displayMovePopup(move)
}

// Function that displays pokemon details in a popup window
function displayMovePopup(move){
    const pokemon = move.learned_by_pokemon.length > 0 ? move.learned_by_pokemon.map((pokemon) => { return '<p class="table-cell">' + pokemon.name + '</p>' }).join(' ') : 'None'
    // HTML string for the popup window
    const moveToHTML = `
    <div id="popup">
        <button id="close-popup" onclick="closeMovePopup()">X</button>
        <div class="popup-content">
                <h2 class="popup-title">${move.id} | ${move.name}</h2>
                <h3 class="popup-subtitle">${move.generation.name}</h3>
                <p class="stats"><strong>Type: </strong>${move.type.name}<br>
                <strong>Category: </strong>${move.damage_class.name}<br>
                <strong>PP: </strong>${move.pp}<br>
                <strong>Accuracy: </strong>${move.accuracy}<br>
                <strong>Power: </strong>${move.power}</p>
                <p><strong>Effect: </strong>${move.effect_entries[0].short_effect}<br><br>
                ${move.effect_entries[0].effect}</p>
                <h4>Learned by:</h4>
                <div class="table">
                ${pokemon}
                </div>
        </div>
    </div>
    `
    container.innerHTML = moveToHTML + container.innerHTML
}

// Function to close the popup and restore the home page to its original state
function closeMovePopup() {
    const popup = document.querySelector("#popup")
    popup.parentElement.removeChild(popup)
    fetchMoves()
}

function sortMoves(sortBy) {
    const moveList = document.getElementById("moves");
    const moves = moveList.getElementsByTagName("li");
    const movesArray = Array.from(moves)
    if (sortBy == 'id (ascending)'){
        const sortedMoves = movesArray.sort((a, b) => {
            const idA = a.querySelector(".card-id").textContent.toUpperCase();
            const idB = b.querySelector(".card-id").textContent.toUpperCase();
            return idA - idB;
        }).map((move) => move.outerHTML)
        moveList.innerHTML = sortedMoves.join('')
    }
    else if (sortBy == 'id (descending)'){
        const sortedMoves = movesArray.sort((a, b) => {
            const idA = a.querySelector(".card-id").textContent.toUpperCase();
            const idB = b.querySelector(".card-id").textContent.toUpperCase();
            return idB - idA;
        }).map((move) => move.outerHTML)
        moveList.innerHTML = sortedMoves.join('')
    }
    else if (sortBy == 'name (ascending)'){
        const sortedMoves = movesArray.sort((a, b) => {
            const nameA = a.querySelector(".card-name").textContent.toUpperCase();
            const nameB = b.querySelector(".card-name").textContent.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        }).map((move) => move.outerHTML)
        moveList.innerHTML = sortedMoves.join('')
    }
    else if (sortBy == 'name (descending)'){
        const sortedMoves = movesArray.sort((a, b) => {
            const nameA = a.querySelector(".card-name").textContent.toUpperCase();
            const nameB = b.querySelector(".card-name").textContent.toUpperCase();
            if (nameB < nameA) {
                return -1;
            }
            if (nameB > nameA) {
                return 1;
            }
            return 0;
        }).map((move) => move.outerHTML)
        moveList.innerHTML = sortedMoves.join('')
    }
}

// TODO Abilities

// Function to get the number of abilities in the PokeAPI
async function getAbilityCount(){
    const url = 'https://pokeapi.co/api/v2/ability'
    const response = await fetch(url)
    const data = await response.json()
    return data.count
}

// Function to fetch abilities from the PokeAPI
async function fetchAbilities() {
    const count = await getAbilityCount()
    const abilitiesUrl = `https://pokeapi.co/api/v2/ability/?limit=${count}`
    const abilitiesResponse = await fetch(abilitiesUrl)
    const abilitiesData = await abilitiesResponse.json()
    const abilities = abilitiesData.results.map((result, index) => ({
        ...result,
        name: result.name,
        id: index + 1,
    }))
    displayAbilities(abilities)
}

// Function to display abilities on the home screen
function displayAbilities(abilities) {
    // HTML string to inject into the home page
    const abilityToHTML = abilities.map((ability) => `
    <li class="card" onclick="selectAbility(${ability.id})">
    <h4 class="card-id">${ability.id}</h4>
    <h2 class="card-name">${ability.name}</h2>
    </li>
    `
    ).join('')
    container.innerHTML = `
    <div class="bar">
        <input type="text" id="search-input" onkeyup="searchAbilities()" placeholder="Search for abilities" title="Enter an ability">
        <button id="random-button" onclick="randomAbility()">Random</button>
        <p class="bar-text">Sort by:</p>
        <select id="sort-select" onchange="sortAbilities(document.getElementById('sort-select').value)">
            <option value="id (ascending)">ID (Ascending)</option>
            <option value="id (descending)">ID (Descending)</option>
            <option value="name (ascending)">Name (Ascending)</option>
            <option value="name (descending)">Name (Descending)</option>
        </select>
        <p class="bar-text">Filter by:</p>
        <select id="filter-select" onchange="filterAbilities()">
            <option value="all">All</option>
        </select>
    </div>
    <ol id="abilities">${abilityToHTML}</ol>
    `
}

function sortAbilities(sortBy) {
    const abilityList = document.getElementById("abilities");
    const abilities = abilityList.getElementsByTagName("li");
    const abilitiesArray = Array.from(abilities)
    if (sortBy == 'id (ascending)'){
        const sortedAbilities = abilitiesArray.sort((a, b) => {
            const idA = a.querySelector(".card-id").textContent.toUpperCase();
            const idB = b.querySelector(".card-id").textContent.toUpperCase();
            return idA - idB;
        }).map((ability) => ability.outerHTML)
        abilityList.innerHTML = sortedAbilities.join('')
    }
    else if (sortBy == 'id (descending)'){
        const sortedAbilities = abilitiesArray.sort((a, b) => {
            const idA = a.querySelector(".card-id").textContent.toUpperCase();
            const idB = b.querySelector(".card-id").textContent.toUpperCase();
            return idB - idA;
        }).map((ability) => ability.outerHTML)
        abilityList.innerHTML = sortedAbilities.join('')
    }
    else if (sortBy == 'name (ascending)'){
        const sortedAbilities = abilitiesArray.sort((a, b) => {
            const nameA = a.querySelector(".card-name").textContent.toUpperCase();
            const nameB = b.querySelector(".card-name").textContent.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        }).map((ability) => ability.outerHTML)
        abilityList.innerHTML = sortedAbilities.join('')
    }
    else if (sortBy == 'name (descending)'){
        const sortedAbilities = abilitiesArray.sort((a, b) => {
            const nameA = a.querySelector(".card-name").textContent.toUpperCase();
            const nameB = b.querySelector(".card-name").textContent.toUpperCase();
            if (nameB < nameA) {
                return -1;
            }
            if (nameB > nameA) {
                return 1;
            }
            return 0;
        }).map((ability) => ability.outerHTML)
        abilityList.innerHTML = sortedAbilities.join('')
    }
}

// Function to search for abilities
function searchAbilities() {
    var input = document.getElementById("search-input");
    var filter = input.value.toUpperCase();
    var abilities = document.getElementById("abilities");
    var ability = abilities.getElementsByTagName("li");
    for (i = 0; i < ability.length; i++) {
        var name = ability[i].querySelector(".card-name");
        var text = name.textContent || name.innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
            ability[i].style.display = "";
        } else {
            ability[i].style.display = "none";
        }
    }
}

async function randomAbility(){
    const count = await getAbilityCount()
    const random = Math.floor(Math.random() * count) + 1
    selectAbility(random)
}

// Function that fetches an ability
async function selectAbility(id) {
    let url = `https://pokeapi.co/api/v2/ability/${id}`
    let response = await fetch(url)
    const ability = await response.json()
    displayAbilityPopup(ability)
}

// Function that displays pokemon details in a popup window
function displayAbilityPopup(ability){
    const pokemon = ability.pokemon.length > 0 ? ability.pokemon.map((pokemon) => { return '<p class="table-cell">' + pokemon.pokemon.name + '</p>' }).join(' ') : 'None'
    // HTML string for the popup window
    const abilityToHTML = `
    <div id="popup">
        <button id="close-popup" onclick="closeAbilityPopup()">X</button>
        <div class="popup-content">
                <h2 class="popup-title">${ability.id} | ${ability.name}</h2>
                <h3 class="popup-subtitle">${ability.generation.name}</h3>
                <p><strong>Effect: </strong>${ability.effect_entries[1].short_effect}<br><br>
                ${ability.effect_entries[1].effect}</p>
                <h4>Pokemon:</h4>
                <div class="table">
                ${pokemon}
                </div>
        </div>
    </div>
    `
    container.innerHTML = abilityToHTML + container.innerHTML
}

// Function to close the popup and restore the home page to its original state
function closeAbilityPopup() {
    const popup = document.querySelector("#popup")
    popup.parentElement.removeChild(popup)
    fetchAbilities()
}