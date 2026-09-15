
const pokemons = [
    {
        id: 25,
        name: "pikachu",
        sprites: {
            front_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
        }
    },

    {
        id: 4,
        name: "charmander",
        sprites: {
            front_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
        }
    },

    {
        id: 6,
        name: "charizard",
        sprites: {
            front_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
        }
    },

    {
        id: 5,
        name: "charmeleon",
        sprites: {
            front_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png"
        }
    },

    {
        id: 1,
        name: "bulbasaur",
        sprites: {
            front_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
        }
    }
]

const pokemon = JSON.stringify(pokemons);
console.log(pokemon);

console.log(typeof pokemon);

const pokemons1 = JSON.parse(pokemon);
console.log(typeof pokemons1);