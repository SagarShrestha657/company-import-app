import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../lib/axios';
import NProgress from 'nprogress';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';

function AllPokemon() {
    const [inputValue, setInputValue] = useState('');
    const [pokemonData, setPokemonData] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const debounceTimeoutRef = useRef(null);
    const fetchedPokemonNames = useRef(new Set());

    const fetchPokemon = async(currentOffset) => {
        if (!hasMore) return;

        NProgress.start();
        setLoadingMore(true);
        try {

            const response = await axiosInstance.get(`/api/pokemon?limit=50&offset=${currentOffset}`);
            const newPokemonList = response.data;

            const uniqueNewPokemonList = newPokemonList.filter(p => {
                if (fetchedPokemonNames.current.has(p.name)) {
                    return false;
                }
                fetchedPokemonNames.current.add(p.name);
                return true;
            });

            setPokemonData(prevPokemonData => {
                const updatedData = [...prevPokemonData, ...uniqueNewPokemonList];
                localStorage.setItem('allPokemonData', JSON.stringify(updatedData));
                setFilteredPokemon(updatedData)
                return updatedData;
            });

            setOffset(prevOffset => prevOffset + uniqueNewPokemonList.length)

            if (uniqueNewPokemonList.length < 10) {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Error fetching Pokemon:", error);
            toast.error("Error fetching Pokemon")
        } finally {
            NProgress.done();
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        const cachedData = localStorage.getItem('allPokemonData');
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            setPokemonData(parsedData);
            setFilteredPokemon(parsedData);
            setOffset(parsedData.length);
            setHasMore(true);
        } else {
            fetchPokemon(offset);
        }
    }, []);


    const handleSearchChange = (event) => {
        const { value } = event.target;
        setInputValue(value);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (value.trim() === "") {
                setFilteredPokemon(pokemonData);
            } else {
                const filtered = pokemonData.filter(pokemon =>
                    pokemon.name.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredPokemon(filtered);
            }
        }, 1000);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 font-sans dark:from-gray-900 dark:to-gray-800">
            <h1 className="text-3xl  sm:text-5xl font-extrabold text-center text-gray-800 dark:text-white mb-8 animation-slide-in-top">Pokemon Explorer</h1>
            <div className="flex flex-row flex-wrap justify-center items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search Pokemon by name..."
                    className="flex-grow p-3 border  bg-indigo-50  border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    value={inputValue}
                    onChange={handleSearchChange}
                />
            </div>

            <InfiniteScroll
                dataLength={filteredPokemon.length}
                next={() => fetchPokemon(offset)}
                hasMore={hasMore}
                loader={loadingMore ? (
                    <div className="text-center p-4">
                        <div className="spinner mx-auto"></div>
                    </div>
                ) : null}
                endMessage={
                    !hasMore && pokemonData.length > 0 && (
                        <p className="text-center p-4 text-xl font-semibold text-gray-500 dark:text-gray-400">
                            No more Pokemon.
                        </p>
                    )
                }
                threshold={0.9}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 ">
                    {filteredPokemon.map((pokemon) => (
                        <Link to={`/pokemon/${pokemon.name}`} key={pokemon.name} className="block animation-fade-in">
                            <div className="bg-white rounded-xl shadow-lg transition-all duration-300 p-6 flex flex-col items-center justify-center transform hover:scale-105 dark:bg-gray-700 dark:shadow-xl">
                                {pokemon.sprite && (
                                    <img
                                        src={pokemon.sprite}
                                        alt={pokemon.name}
                                        className="w-32 h-32 object-contain mb-4 animation-scale-in"
                                    />
                                )}
                                <h2 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white text-center animation-slide-in-bottom animation-delay-100">{pokemon.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}

export default AllPokemon; 