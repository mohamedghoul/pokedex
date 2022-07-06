// Get container from HTML
const container = document.getElementById('container')

// Function to get the number of Pokemon in the PokeAPI
async function getPokemonCount(){
    const url = 'https://pokeapi.co/api/v2/pokemon'
    const response = await fetch(url)
    const data = await response.json()
    return data.count
}

// Function to get the number of moves in the PokeAPI
async function getMoveCount(){
    const url = 'https://pokeapi.co/api/v2/move'
    const response = await fetch(url)
    const data = await response.json()
    return data.count
}

// Function to get the number of abilities in the PokeAPI
async function getAbilityCount(){
    const url = 'https://pokeapi.co/api/v2/ability'
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
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index+1}.png`
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
    <div class="search-sort-filter">
        <input type="text" id="search-input" onkeyup="searchPokemon()" placeholder="Search for Pokemon" title="Enter a pokemon name">
        <button id="random-button" onclick="randomPokemon()">Random</button>
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
    return gender
}

// Function that is executed when a user clicks on a pokemon
// Fetches the individual pokemon's data from the PokeAPI and calls another function to display the data in a popup window
async function selectPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url)
    const pokemon = await response.json()
    const gender = await getPokemonGender(pokemon.name)
    pokemon.gender = gender.map((gend) => gend).join(', ')
    displayPokemonPopup(pokemon)
}

// Function that displays pokemon details in a popup window
function displayPokemonPopup(pokemon){
    const type = pokemon.types.map((type) => type.type.name).join(", ")
    const moves = pokemon.moves.map((move) => { return '<p class="table-cell">' + move.move.name + '</p>' }).join(' ');
    const abilities = pokemon.abilities.map((ability) => { return '<p class="table-cell">' + ability.ability.name + '</p>' }).join(' ');
    const image = pokemon.sprites['front_default']
    // const gender = await getPokemonGender(pokemon.name)
    // HTML string for the popup window
    const pokemonDetailsToHTML = `
    <div class="popup">
        <button id="close-popup" onclick="closePopup()">X</button>
        <div class="popup-content">
            <img class="popup-image" src="${image}"/>
            <div class="popup-info">
                <h2 class="popup-title">${pokemon.id} | ${pokemon.name}</h2>
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
            </div>
        </div>
    </div>
    `
    container.innerHTML = pokemonDetailsToHTML + container.innerHTML
}

// Function to close the popup and restore the home page to its original state
function closePopup() {
    const popup = document.querySelector(".popup")
    popup.parentElement.removeChild(popup)
    fetchPokemons()
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
    <li class="card" onclick="">
    <h2 class="card-name">${move.name}</h2>
    </li>
    `
    ).join('')
    container.innerHTML = `
    <div class="search-sort-filter">
        <input type="text" id="search-input" onkeyup="searchMoves()" placeholder="Search for Moves" title="Enter a move name">
        <button id="random-button" onclick="randomMove()">Random</button>
    </div>
    <ol id="moves">${moveToHTML}</ol>
    `
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
    <li class="card" onclick="">
    <h2 class="card-name">${ability.name}</h2>
    </li>
    `
    ).join('')
    container.innerHTML = `
    <div class="search-sort-filter">
        <input type="text" id="search-input" onkeyup="searchAbilities()" placeholder="Search for Abilities" title="Enter an ability name">
        <button id="random-button" onclick="randomAbility()">Random</button>
    </div>
    <ol id="abilities">${abilityToHTML}</ol>
    `
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

async function randomPokemon(){
    const count = await getPokemonCount()
    const random = Math.floor(Math.random() * count) + 1
    selectPokemon(random)
}

async function randomMove(){
    const count = await getMoveCount()
    const random = Math.floor(Math.random() * count) + 1
    selectMove(random)
}

async function randomAbility(){
    const count = await getAbilityCount()
    const random = Math.floor(Math.random() * count) + 1
    selectAbility(random)
}