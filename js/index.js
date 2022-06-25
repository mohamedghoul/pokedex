// Get pokemon container from HTML
const pokedex = document.getElementById('pokedex')

// Function to fetch the pokemon data from the PokeAPI and save them locally
function fetchPokemon() {
    // Putting promises in an array since resolving promises in a for loop is not recommended when we can use Promise.all
    const promises = []
    // Used a count of 50 due to the large number of pokemon in the database (1000+!!)
    // Could potentially add support for pagination in the future to mitigate this issue.
    const count = 50
    // Create a promise for each pokemon and push it to the promises array
    for(let i = 1; i <= count; i++){
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`
        promises.push(fetch(url).then(response => response.json()))
    }

    // Resolve all promises and map the data we need
    Promise.all(promises).then((results) => {
        const pokemon = results.map((result) => ({
            name: result.name,
            id: result.id,
            image: result.sprites.front_default,
            species: result.species.name,
            height: result.height,
            weight: result.weight,
            gender: (result.front_female == null) ? "male": "female", // To be dealt with later using dedicated endpoint
            stats: result.stats,
            moves: result.moves,
            type: result.types.map((type) => type.type.name).join(', ')
        }))
        // Display the pokemon on the home screen
        displayPokemonOnHomeScreen(pokemon)
    })
}

// Function to display Pokemon on the home screen
function displayPokemonOnHomeScreen(pokemon) {
    const pokemonToHTML = pokemon.map((pokemon) => `
    <li class="card">
    <h4 class="card-id">${pokemon.id}</h4>
    <img class="card-image" src="${pokemon.image}"/>
    <h2 class="card-name">${pokemon.name}</h2>
    <p class="card-type">Type: ${pokemon.type}</p>
    </li>
    `
    ).join('')
    pokedex.innerHTML = pokemonToHTML
}

fetchPokemon()