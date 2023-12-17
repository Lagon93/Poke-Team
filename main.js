// main.js
document.addEventListener('DOMContentLoaded', function () {
    const equipoDiv = document.getElementById('equipo');
    const controlesDiv = document.getElementById('controles');
    const maxPokemons = 6;

    // Agrega los event listeners a los botones
    const agregarBtn = document.getElementById('agregarBtn');
    const eliminarBtn = document.getElementById('eliminarBtn');

    agregarBtn.addEventListener('click', agregarPokemonPorNombre);
    eliminarBtn.addEventListener('click', eliminarPokemon);
    
    function agregarPokemonPorNombre() {
        if (equipoDiv.children.length >= maxPokemons) {
            alert('Ya has alcanzado el máximo de Pokémon en tu equipo (6).');
            return;
        }

        // Solicita al usuario el nombre del Pokémon a agregar
        const nombrePokemon = prompt('Ingresa el nombre del Pokémon:');

        if (nombrePokemon !== null && nombrePokemon.trim() !== '') {
            // Realiza una solicitud a la PokeAPI para obtener la información del Pokémon por nombre
            axios.get(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}/`)
                .then(response => {
                    const pokemon = response.data;

                    // Crea la imagen del Pokémon
                    const img = document.createElement('img');
                    img.src = pokemon.sprites.front_default;
                    img.alt = pokemon.name;

                    // Añade la imagen del nuevo Pokémon al equipo
                    equipoDiv.appendChild(img);
                })
                .catch(error => {
                    console.error(`Error al obtener el Pokémon ${nombrePokemon}`, error);
                });
        }
    }

    function eliminarPokemon() {
        // Elimina el último hijo del div de equipo (último Pokémon añadido)
        equipoDiv.removeChild(equipoDiv.lastChild);
    }

});
