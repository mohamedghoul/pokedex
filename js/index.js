// Get pokemon container from HTML
const pokedex = document.getElementById('pokedex')

// Function to get the number of Pokemon in the PokeAPI
async function getPokemonCount(){
    const url = 'https://pokeapi.co/api/v2/pokemon'
    const response = await fetch(url)
    const data = await response.json()
    return data.count
}

// Function to fetch the pokemon data from the PokeAPI and save them locally
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
    displayPokemonOnHomeScreen(pokemons)
}
 
// Function to display Pokemon on the home screen
function displayPokemonOnHomeScreen(pokemons) {
    // HTML string to inject into the home page
    const pokemonToHTML = pokemons.map((pokemon) => `
    <li class="card" onclick="selectPokemon(${pokemon.id})">
    <h4 class="card-id">${pokemon.id}</h4>
    <img class="card-image" src="${pokemon.image}"/>
    <h2 class="card-name">${pokemon.name}</h2>
    </li>
    `
    ).join('')
    pokedex.innerHTML = pokemonToHTML
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
    pokemon.gender = gender.map((gen) => gen).join(', ')
    displayPopup(pokemon)
}

// Function that displays pokemon details in a popup window
function displayPopup(pokemon){
    const type = pokemon.types.map((type) => type.type.name).join(", ")
    const moves = pokemon.moves.map((move) => move.move.name).join(", ")
    const abilities = pokemon.abilities.map((ability) => ability.ability.name).join(", ")
    console.log(moves)
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
                <p>${moves}</p>
                <h4>Abilities</h4>
                <p>${abilities}</p>
            </div>
        </div>
    </div>
    `
    pokedex.innerHTML = pokemonDetailsToHTML + pokedex.innerHTML
}

// Function to close the popup and restore the home page to its original state
function closePopup() {
    const popup = document.querySelector(".popup")
    popup.parentElement.removeChild(popup)
    fetchPokemons()
}

fetchPokemons()