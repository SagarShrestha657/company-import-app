import axios from "axios";

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export const getAllPokemon = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        
        // First, get the list of Pokemon names and URLs
        const listResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonList = listResponse.data.results;

        // For each Pokemon, fetch its detailed data and extract name and front_default sprite
        const detailedPokemonPromises = pokemonList.map(async (pokemon) => {
            const detailResponse = await axios.get(pokemon.url);
            return {
                name: detailResponse.data.name,
                sprite: detailResponse.data.sprites.front_default,
            };
        });

        const detailedPokemon = await Promise.all(detailedPokemonPromises);
        res.status(200).json(detailedPokemon);
    } catch (error) {
        console.error("Error fetching all Pokemon:", error);
        res.status(500).json({ message: "Error fetching all Pokemon", error: error.message });
    }
};

export const getPokemonByName = async (req, res) => {
    const { name } = req.params;
    try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${name.toLowerCase()}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching Pokemon by name ${name}:`, error);
        res.status(404).json({ message: `Pokemon with name ${name} not found`, error: error.message });
    }
};
