import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import NProgress from 'nprogress';
import { toast } from 'react-toastify';

function SinglePokemon() {
    const { name } = useParams();
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllMoves, setShowAllMoves] = useState(false);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            NProgress.start();
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/api/pokemon/${name}`);
                setPokemonDetails(response.data);
            } catch (err) {
                console.error(`Error fetching Pokemon details for ${name}:`, err);
                toast.error("Error fetching Pokemon details")
            } finally {
                setLoading(false);
                NProgress.done();
            }
        };

        if (name) {
            fetchPokemonDetails();
        }
    }, [name]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 dark:from-gray-900 dark:to-gray-800">
                <div className="spinner"></div>
            </div>
        );
    }


    if (!pokemonDetails) {
        return  (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 dark:from-gray-900 dark:to-gray-800">
              <div className="text-center p-8 text-xl font-semibold text-gray-700 dark:text-gray-200">No Pokemon details found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 p-4 flex flex-col items-center justify-center font-sans dark:from-gray-900 dark:to-gray-800">
            <Link 
                to="/" 
                className="self-start mb-4 px-3  pr-6 py-1.5 bg-gradient-to-br from-blue-400 to-purple-400 text-white rounded-full shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center space-x-1 transform group text-xs dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-800 dark:hover:to-gray-900 "
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transform group-hover:-translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Back</span>
            </Link>
            <div className="relative bg-blue-100 rounded-3xl shadow-2xl p-6 max-w-xl w-full flex flex-col items-center transform transition-all duration-500 border border-gray-300 overflow-hidden animation-fade-in dark:bg-gray-800 dark:border-gray-700 dark:shadow-none">
                {/* Subtle pattern/texture background */}
                <div className="absolute inset-0 bg-repeat opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                
                <h1 className="text-5xl font-extrabold capitalize text-gray-900 mb-6 tracking-tight z-10 animation-slide-in-top dark:text-white">{pokemonDetails.name}</h1>
                
                <div className="relative mb-6 p-3 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-full shadow-lg z-10 animation-scale-in dark:from-yellow-700 dark:to-orange-800">
                    <img 
                        src={pokemonDetails.sprites.front_default} 
                        alt={pokemonDetails.name} 
                        className="w-56 h-56 object-contain mx-auto animation-bounce-slow"
                    />
                </div>
                
                <div className="text-lg text-gray-700 w-full grid grid-cols-1 md:grid-cols-2 gap-4 z-10">

                    <div className="bg-blue-100 p-4 rounded-xl shadow-md border border-blue-300 col-span-1 md:col-span-2 hover:shadow-xl transition-shadow duration-300 animation-slide-in-left dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center dark:text-blue-400"><span className="mr-2">⚡</span>Abilities:</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {pokemonDetails.abilities.map(abilityInfo => (
                                <li key={abilityInfo.ability.name} className="text-blue-700 capitalize dark:text-blue-300">{abilityInfo.ability.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-green-100 p-4 rounded-xl shadow-md border border-green-300 col-span-1 md:col-span-2 hover:shadow-xl transition-shadow duration-300 animation-slide-in-right dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center dark:text-green-400"><span className="mr-2">🌿</span>Types:</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {pokemonDetails.types.map(typeInfo => (
                                <li key={typeInfo.type.name} className="text-green-700 capitalize dark:text-green-300">{typeInfo.type.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-red-100 p-4 rounded-xl shadow-md border border-red-300 hover:shadow-xl transition-shadow duration-300 animation-slide-in-bottom dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center dark:text-red-400"><span className="mr-2">📊</span>Stats:</h3>
                        <ul className="space-y-2">
                            {pokemonDetails.stats.map(statInfo => (
                                <li key={statInfo.stat.name} className="flex justify-between items-center text-red-700 dark:text-red-300">
                                    <span className="font-semibold capitalize text-red-800 dark:text-red-400">{statInfo.stat.name}:</span> 
                                    <span className="text-lg font-bold">{statInfo.base_stat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-indigo-50 p-4 rounded-xl shadow-md border border-indigo-300 hover:shadow-xl transition-shadow duration-300 animation-slide-in-bottom animation-delay-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <h3 className="text-xl font-bold text-indigo-800 mb-3 flex items-center dark:text-indigo-400"><span className="mr-2">🥋</span>Moves:</h3>
                        <div className="flex flex-wrap gap-1">
                            {pokemonDetails.moves.slice(0, showAllMoves ? pokemonDetails.moves.length : 8).map(moveInfo => (
                                <span key={moveInfo.move.name} className="bg-indigo-200 text-indigo-800 text-sm font-medium px-2 py-1 rounded-full capitalize shadow-sm transform hover:scale-110 transition-transform duration-200 dark:bg-purple-700 dark:text-purple-200">
                                    {moveInfo.move.name}
                                </span>
                            ))}
                            {!showAllMoves && pokemonDetails.moves.length > 8 && (
                                <button 
                                    onClick={() => setShowAllMoves(true)}
                                    className="bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-full shadow-sm transform hover:scale-110 transition-transform duration-200 dark:bg-gray-600 dark:text-gray-200"
                                >
                                    {pokemonDetails.moves.length - 8}+ more
                                </button>
                            )}
                            {showAllMoves && pokemonDetails.moves.length > 8 && (
                                <button 
                                    onClick={() => setShowAllMoves(false)}
                                    className="bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-full shadow-sm transform hover:scale-110 transition-transform duration-200 dark:bg-gray-600 dark:text-gray-200"
                                >
                                    Show Less
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePokemon; 