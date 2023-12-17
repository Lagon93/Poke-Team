// main.js
document.addEventListener('DOMContentLoaded', function () {
    const equipoDiv = document.getElementById('equipo');
    const controlesDiv = document.getElementById('controles');
    const maxPokemons = 6;
    let isAddingPokemon = false;

    const pokemonNames = [];

    axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => {
            const results = response.data.results;
            pokemonNames.push(...results.map(result => result.name));
        })
        .catch(error => {
            console.error('Error al obtener la lista de nombres de Pokémon', error);
        });

    function agregarPokemonPorNombre(nombrePokemon) {
        if (isAddingPokemon || equipoDiv.children.length >= maxPokemons) {
            return;
        }

        isAddingPokemon = true;

        axios.get(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}/`)
            .then(response => {
                const pokemon = response.data;

                const img = document.createElement('img');
                img.src = pokemon.sprites.front_default;
                img.alt = pokemon.name;

                equipoDiv.appendChild(img);

                // Actualiza el dropdown después de agregar
                actualizarDropdownEliminar();
            })
            .catch(error => {
                console.error(`Error al obtener el Pokémon ${nombrePokemon}`, error);
            })
            .finally(() => {
                isAddingPokemon = false;
            });
    }

    function actualizarListaBusqueda(inputValue) {
        const listaBusqueda = document.getElementById('listaBusqueda');

        // Oculta la lista si no hay nada escrito
        if (!inputValue) {
            listaBusqueda.style.display = 'none';
            return;
        }

        listaBusqueda.style.display = 'block';
        listaBusqueda.innerHTML = '';

        const resultadosFiltrados = pokemonNames.filter(name => name.includes(inputValue.toLowerCase()));

        resultadosFiltrados.forEach(result => {
            const listItem = document.createElement('li');
            listItem.textContent = result;

            // Agrega un listener al hacer clic en un elemento de la lista
            listItem.addEventListener('click', function () {
                agregarPokemonPorNombre(result);
            });

            listaBusqueda.appendChild(listItem);
        });
    }

    function manejarInputBusqueda(event) {
        const inputValue = event.target.value;
        actualizarListaBusqueda(inputValue);
    }

    function actualizarDropdownEliminar() {
        const eliminarSelect = document.getElementById('eliminarSelect');
        eliminarSelect.innerHTML = '';

        // Llena el dropdown con nombres de Pokémon en el equipo
        for (let i = 0; i < equipoDiv.children.length; i++) {
            const option = document.createElement('option');
            option.value = equipoDiv.children[i].alt;
            option.textContent = equipoDiv.children[i].alt;
            eliminarSelect.appendChild(option);
        }
    }

    // Agrega los event listeners
    const buscarInput = document.getElementById('buscarInput');
    const agregarBtn = document.getElementById('agregarBtn');
    const eliminarBtn = document.getElementById('eliminarBtn');

    buscarInput.addEventListener('input', manejarInputBusqueda);
    agregarBtn.addEventListener('mousedown', function () {
        const seleccionado = buscarInput.value.trim();
        if (seleccionado) {
            agregarPokemonPorNombre(seleccionado);
        }
    });

    eliminarBtn.addEventListener('click', function () {
        const eliminarSelect = document.getElementById('eliminarSelect');
        const seleccionado = eliminarSelect.value;
        if (seleccionado) {
            equipoDiv.removeChild(equipoDiv.querySelector(`img[alt="${seleccionado}"]`));
            actualizarDropdownEliminar(); // Actualiza el dropdown después de eliminar
        }
    });

    // Llena el dropdown al cargar la página
    actualizarDropdownEliminar();
});
