async function fetchPokemonData(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const pokemonData = await response.json();
    return pokemonData;
  } catch (error) {
    console.error(`Error fetching Pokemon data for ID ${pokemonId}:`, error);
    return null;
  }
}

async function getPokemonDataForPage(pageNumber, pageSize) {
  try {
    const maxPokemon = 50;
    const startIndex = (pageNumber - 1) * pageSize + 1;
    const endIndex = Math.min(pageNumber * pageSize, maxPokemon);
    const pokemonArray = [];
    for (let id = startIndex; id <= endIndex; id++) {
      const pokemonData = await fetchPokemonData(id);
      if (pokemonData) {
        pokemonArray.push(pokemonData);
      }
    }
    return pokemonArray;
  } catch (error) {
    console.error('Error getting Pokemon data for page:', error);
    return null;
  }
}

const pageSize = 10; // Number of Pokemon per page
let currentPage = 1;

async function fetchAndDisplayPokemonData() {
  try {
    const pokemonDataArray = await getPokemonDataForPage(currentPage, pageSize);
    console.log("Fetched Pokemon data for page", currentPage, ":", pokemonDataArray);
    const cardContainer = document.getElementById('cardContainer');
    if (!cardContainer) {
      console.error('Card container not found.');
      return;
    }
    cardContainer.innerHTML = ''; // Clear existing cards
    pokemonDataArray.forEach(pokemon => {
      const card = document.createElement('div');
      card.classList.add('cardContainer');

      const name = document.createElement('h3');
      name.textContent = pokemon.name;

      const image = document.createElement('img');
      image.src = pokemon.sprites.front_default;
      image.alt = pokemon.name + ' image';
      image.classList.add('pokemonImage');

      const types = document.createElement('p');
      types.textContent = 'Types: ' + pokemon.types.map(type => type.type.name).join(', ');

      const abilities = document.createElement('p');
      abilities.textContent = 'Abilities: ' + pokemon.abilities.map(ability => ability.ability.name).join(', ');

      const weight = document.createElement('p');
      weight.textContent = 'Weight: ' + pokemon.weight;

      const moves = document.createElement('p');
      moves.textContent = 'Moves: ' + pokemon.moves.slice(0, 5).map(move => move.move.name).join(', ');

      card.appendChild(name);
      card.appendChild(image);
      card.appendChild(types);
      card.appendChild(weight);
      card.appendChild(abilities);
      card.appendChild(moves);

      cardContainer.appendChild(card);
    });

    // Update current page number
    const pageNumberElement = document.getElementById('pageNumber');
    if (pageNumberElement) {
      pageNumberElement.textContent = currentPage;
    }

    // Disable/enable pagination buttons based on current page
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage * pageSize >= 50;

  } catch (error) {
    console.error('Error fetching and displaying Pokemon data:', error);
  }
}

// Pagination buttons
document.addEventListener('DOMContentLoaded', () => {
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchAndDisplayPokemonData();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentPage * pageSize < 50) {
      currentPage++;
      fetchAndDisplayPokemonData();
    }
  });

  // Initial fetch and display
  fetchAndDisplayPokemonData();
});
