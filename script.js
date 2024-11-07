let BASE_URL = "https://pokeapi.co/api/v2";
let currentOffset = 0;

async function init() {
    await dataIntoJson();
    closePokemonDetails();
}

function showSpinner() {
    document.getElementById('spinnerWrapper').classList.remove('hidden');
}

function hideSpinner() {
    document.getElementById('spinnerWrapper').classList.add('hidden');
}

async function getData(path = "") {
    try {
        let response = await fetch(BASE_URL + path);
        return response.json();
    } catch (error) {
        console.error("Failed to fetch", error);
    }
}

async function dataIntoJson() {
    showSpinner();
    try {
        let pokeResponse = await getData(`/pokemon?limit=20&offset=0`);
        let pokeArray = pokeResponse.results;
        await dataIntoJsonForLoop(pokeArray);
    } catch (error) {
        console.log("failed to fetch", error);
    } finally {
        hideSpinner();
    }
}

async function dataIntoJsonForLoop(pokeArray) {
    for (let index = 0; index < pokeArray.length; index++) {
        let pokemon = pokeArray[index];
        let pokemonDetails = await getData(`/pokemon/${pokemon.name}`);
        let pokemonObject = await createPokemonObject(pokemonDetails);
        allPokemons.push(pokemonObject);
    }
    renderAllPokemon();
}

async function loadPokemonBatch() {
    showSpinner();
    try {
        currentOffset += 20;
        let pokeResponse = await getData(`/pokemon?limit=20&offset=${currentOffset}`);
        let pokeArray = pokeResponse.results;
        let newPokemons = [];
        pokemonBatchLoop(newPokemons, pokeArray)

    } catch (error) {
        console.log("failed to fetch", error);
    } finally {
        hideSpinner();
    }
}

async function pokemonBatchLoop(newPokemons, pokeArray) {
    for (let index = 0; index < pokeArray.length; index++) {
        let pokemon = pokeArray[index];
        let pokemonDetails = await getData(`/pokemon/${pokemon.name}`);
        let pokemonObject = await createPokemonObject(pokemonDetails);
        newPokemons.push(pokemonObject);
    }
    allPokemons.push(...newPokemons);
    renderNewPokemons(newPokemons);
}

async function loadMorePokemon() {
    await loadPokemonBatch();
}

function renderAllPokemon() {
    let content = document.getElementById('contentWrapper');
    allPokemons.forEach((pokemon, index) => {
        content.innerHTML += pokemonsTemplate(pokemon, index);
    });
    document.getElementById('loadMoreButton').classList.remove('hidden');
}

function renderNewPokemons(newPokemons) {
    let content = document.getElementById('contentWrapper');
    newPokemons.forEach((pokemon) => {
        let index = allPokemons.indexOf(pokemon);
        content.innerHTML += pokemonsTemplate(pokemon, index);
    });
}

function renderPokemonDetails(index) {
    document.body.classList.add('noScroll');
    let pokemon = allPokemons[index];
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.add('show');
    overlayRef.innerHTML = pokemonDetailsTemplate(pokemon, index);
}

function renderPokemonBaseStats(index) {
    let pokemon = allPokemons[index];
    let baseStatsRef = document.getElementById('baseStats');
    baseStatsRef.innerHTML = pokemonBaseStatsTemplate(pokemon);
}

function renderPokemonAbout(index) {
    let pokemon = allPokemons[index];
    let baseStatsRef = document.getElementById('baseStats');
    baseStatsRef.innerHTML = pokemonAboutTemplate(pokemon);
}

async function loadEvolution(index) {
    try {
        let speciesDataArray = await fetchSpeciesData(index);
        let evoChainData = await fetchEvolutionChain(speciesDataArray);
        let { species, firstEvo, secondEvo } = extractEvolutionNames(evoChainData);
        let { speciesId, firstEvoId, secondEvoId } = getEvolutionIds(index, evoChainData);
        let speciesImage = getPokemonImageUrl(speciesId);
        let firstEvoImage = getPokemonImageUrl(firstEvoId);
        let secondEvoImage = getPokemonImageUrl(secondEvoId);

        addEvolutionToArray(species, speciesImage, firstEvo, firstEvoImage, secondEvo, secondEvoImage);
        renderEvolution();
        pokeEvolutions = [];
    } catch (error) {
        console.error(error);
    }
}

async function fetchSpeciesData(index) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${index + 1}/`);
    return await response.json();
}

async function fetchEvolutionChain(speciesDataArray) {
    let response = await fetch(speciesDataArray.evolution_chain.url);
    return await response.json();
}

function extractEvolutionNames(evoChainData) {
    return {
        species: evoChainData.chain.species.name,
        firstEvo: evoChainData.chain.evolves_to[0]?.species.name,
        secondEvo: evoChainData.chain.evolves_to[0]?.evolves_to[0]?.species.name
    };
}

function getEvolutionIds(index, evoChainData) {
    let speciesId = index + 1;
    let firstEvoId = evoChainData.chain.evolves_to[0].species.url.split('/').slice(-2, -1)[0];
    let secondEvoId = evoChainData.chain.evolves_to[0]?.evolves_to[0]?.species.url.split('/').slice(-2, -1)[0];

    if (speciesId == firstEvoId) {
        speciesId -= 1;
    } else if (speciesId == secondEvoId) {
        speciesId -= 2;
    }
    return { speciesId, firstEvoId, secondEvoId };
}

function getPokemonImageUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function addEvolutionToArray(species, speciesImage, firstEvo, firstEvoImage, secondEvo, secondEvoImage) {
    pokeEvolutions.push({
        species,
        speciesImage,
        firstEvo,
        firstEvoImage,
        secondEvo,
        secondEvoImage
    });
}

function renderEvolution() {
    let pokemon = pokeEvolutions;
    let evolutionRef = document.getElementById('baseStats');
    evolutionRef.classList.add('flexEvolution')
    evolutionRef.innerHTML = evolutionTemplate(pokemon);
}

function closePokemonDetails() {
    let overlayRef = document.getElementById('overlay');
    let closeButton = document.getElementById('closeDetailsButton')
    overlayRef.addEventListener('click', function (event) {
        if (event.target === overlayRef || event.target === closeButton) {
            overlayRef.classList.remove('show');
        }
        document.body.classList.remove('noScroll');
    });
}

function nextPokemon(index) {
    let nextIndex = (index + 1) % allPokemons.length; // Zyklisch zum nächsten
    renderPokemonDetails(nextIndex);
}

function prevPokemon(index) {
    let prevIndex = (index - 1 + allPokemons.length) % allPokemons.length;
    renderPokemonDetails(prevIndex);
}

async function createPokemonObject(pokemonDetails) {
    return {
        type: pokemonDetails.types[0].type.name,
        id: pokemonDetails.id,
        img: pokemonDetails.sprites.other.dream_world.front_default,
        name: pokemonDetails.name,
        abilities: pokemonDetails.abilities,
        weight: pokemonDetails.weight + `kg`,
        height: pokemonDetails.height,
        species: pokemonDetails.species.name,
        hp: pokemonDetails.stats[0].base_stat,
        attack: pokemonDetails.stats[1].base_stat,
        defense: pokemonDetails.stats[2].base_stat,
    };
}

function searchPokemons() {
    let searchInput = document.getElementById('searchInput').value.toLowerCase();
    if (searchInput.length >= 3) {
        document.getElementById('searchResults').innerHTML = renderPokemonName(searchInput);
    } else {
        deleteSearchInput();
    }
}

function deleteSearchInput() {
    let dropdown = document.getElementsByClassName('dropdown')[0];
    dropdown.classList.add('hidden');
    let search = document.getElementById('searchInput');
    search.addEventListener('input', evt => {
        if (search.value === '') {
            dropdown.classList.add('hidden');
        }
    });
}

function renderPokemonName(searchInput) {
    document.getElementsByClassName('dropdown')[0].classList.remove('hidden');
    let pokeName = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchInput)
    )
    return pokeName.map(pokemon => `
        <div class="pokemon-dropdown" onclick="renderPokemonDetails(${pokemon.id - 1})">
            ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </div>
    `).join('');
}






