// Get pokemon container from HTML
const pokedex = document.getElementById('pokedex')

// Function to fetch the pokemon data from the PokeAPI and save them locally
async function fetchPokemons() {
    const url = 'https://pokeapi.co/api/v2/pokemon/?limit=50'
    const response = await fetch(url)
    const data = await response.json()
    const pokemons = data.results.map((result, index) => ({
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

// Function that is executed when a user clicks on a pokemon
// Fetches the individual pokemon's data from the PokeAPI and calls another function to display the data in a popup window
async function selectPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url)
    const pokemon = await response.json()
    displayPopup(pokemon)
}

// Function that displays pokemon details in a popup window
function displayPopup(pokemon){
    const type = pokemon.types.map((type) => type.type.name).join(', ')
    const image = pokemon.sprites['front_default']
    // HTML string for the popup window
    const pokemonDetailsToHTML = `
    <div class="popup">
        <button id="close-popup" onclick="closePopup()">X</button>
        <div class="card">
            <img class="card-image" src="${image}"/>
            <h2 class="card-name">${pokemon.id}. ${pokemon.name}</h2>
            <p><small>Height: </small>${pokemon.height} | <small>Weight: </small>${pokemon.weight} | <small>Type: </small>${type}</p>
        </div>
    </div>
    `
    console.log(pokemonDetailsToHTML)
    pokedex.innerHTML = pokemonDetailsToHTML + pokedex.innerHTML
}

// Function to close the popup and restore the home page to its original state
function closePopup() {
    const popup = document.querySelector(".popup")
    popup.parentElement.removeChild(popup)
    fetchPokemons()
}

fetchPokemons()