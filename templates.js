function pokemonsTemplate(pokemon, index) {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return `
    <div class="pokemonCard ${pokemon.type}" onclick="renderPokemonDetails(${index})">
    <div class="cardHeader">
        <p>${capitalizeFirstLetter(pokemon.name)}</p>
    </div>
    <div class="imageWrapper">
        <img class="pokeImg" src="${pokemon.img}" alt="${pokemon.name} back view" />
    </div>
    <div class="cardFooter">
        <p>${capitalizeFirstLetter(pokemon.type)}</p>
    </div>
    </div>
    `
}

function pokemonDetailsTemplate(pokemon, index) {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return `
        <div class="pokemonDetails ${capitalizeFirstLetter(pokemon.type)}">
            <div id="closeDetailsButton" onclick="closePokemonDetails()">X</div>
            <div class="headerDetails">
                <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
                <h3>${capitalizeFirstLetter(pokemon.type)}</h3>
            </div>
            <img src="${pokemon.img}" class="pokeDetailsImg" alt="front view" />

            <div class="contentSection">
                <nav class="navbarDetails">
                    <button class="btn btn-secondary" type="submit" onclick="renderPokemonAbout(${index})">About</button>
                    <button class="btn btn-secondary" type="submit" onclick="renderPokemonBaseStats(${index})">Base Stats</button>
                    <button class="btn btn-secondary" type="submit" onclick="loadEvolution(${index})">Evolution</button>
                </nav>
                <div id="baseStats">
                    <p><strong>Species:</strong> ${capitalizeFirstLetter(pokemon.species)}</p>
                    <p><strong>Height:</strong> ${pokemon.height}</p>
                    <p><strong>Weight:</strong> ${pokemon.weight}</p>
                </div>
            </div>
            <div class="footerDetails">
                <div class="navButtons">
                    <button class="btn btn-secondary" type="submit" onclick="prevPokemon(${index})">&larr; Previous</button>
                    <button class="btn btn-secondary" type="submit" onclick="nextPokemon(${index})">Next &rarr;</button>
                </div>
            </div>
        </div>
    `;
}


function pokemonBaseStatsTemplate(pokemon) {
    return `
            <p><strong>HP:</strong> ${pokemon.hp}</p>
            <p><strong>Attack:</strong> ${pokemon.attack}</p>
            <p><strong>Defense:</strong> ${pokemon.defense}</p>
    `
}

function pokemonAboutTemplate(pokemon) {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return `
        <p><strong>HP:</strong> ${capitalizeFirstLetter(pokemon.species)}</p>
        <p><strong>Height:</strong> ${pokemon.height}</p>
        <p><strong>Weight:</strong> ${pokemon.weight}</p>
    `
}

function evolutionTemplate(pokemon) {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    let template = `
        <div class="evolution">
        <div class="evoCollum" id="evoCollum1">
        <p><strong>${capitalizeFirstLetter(pokemon[0].species)}</strong></p> 
        <img src="${pokemon[0].speciesImage}">
        </div>
        <div class="evoCollum" id="evoCollum2">
        <p><strong>${capitalizeFirstLetter(pokemon[0].firstEvo)}</strong></p> 
        <img src="${pokemon[0].firstEvoImage}">
        </div>
        `
    if (pokemon[0].secondEvo && pokemon[0].secondEvoImage) {
        template += `
             <div class="evoCollum" id="evoCollum3">
            <p><strong>${capitalizeFirstLetter(pokemon[0].secondEvo)}</strong></p> 
            <img src="${pokemon[0].secondEvoImage}">
            </div>`
    }
    template += `</div>`;
    return template;

}
