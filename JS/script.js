
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

// ===== Menu hambúrguer =====
// As divs do menu no HTML estão vazias, então os links são criados aqui.
const menu = document.querySelector('.menu-hamburger');

if (menu) {
  const lista = document.createElement('nav');
  lista.className = 'menu-lista';
  lista.hidden = true;
  lista.innerHTML = `
    <a href="perfil.html">Perfil</a>
    <a href="favoritos.html">Meus favoritos</a>
    <a href="index.html">Mais Pokémons</a>
    <a href="#" class="sair">Sair / Deslogar</a>`;
  menu.after(lista);

  menu.setAttribute('role', 'button');
  menu.setAttribute('tabindex', '0');
  menu.setAttribute('aria-label', 'Abrir menu');

  const alternar = () => (lista.hidden = !lista.hidden);
  menu.addEventListener('click', alternar);
  menu.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(); }
  });
  // Fecha ao clicar fora ou apertar Esc
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !lista.contains(e.target)) lista.hidden = true;
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lista.hidden = true; });
}

// ===== Pesquisa + filtros por tipo =====
const cards = [...document.querySelectorAll('.cards-pokemon .card')];
const campo = document.querySelector('#pesquisar');
const botoes = [...document.querySelectorAll('.filtro button')];
let filtroAtual = 'todos';

// Tira acentos e deixa minúsculo: "Elétrico" -> "eletrico"
const normalizar = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

function filtrar() {
  const busca = normalizar(campo?.value || '');
  cards.forEach(card => {
    const nome = normalizar(card.querySelector('h2')?.textContent || '');
    const tipo = normalizar(card.querySelector('.informacoes p')?.textContent || '');
    const favorito = card.classList.contains('favorito');

    const passaFiltro =
      filtroAtual === 'todos' ||
      (filtroAtual === 'favoritos' ? favorito : tipo.includes(filtroAtual));

    card.hidden = !(passaFiltro && nome.includes(busca));
  });
}

botoes.forEach(botao => botao.addEventListener('click', () => {
  botoes.forEach(b => b.classList.remove('ativo'));
  botao.classList.add('ativo');
  filtroAtual = normalizar(botao.textContent);
  filtrar();
}));

campo?.addEventListener('input', filtrar);

// ===== Clicar no card abre a página do Pokémon =====
cards.forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const nome = card.querySelector('h2')?.textContent.trim();
    if (nome) location.href = `pokemon.html?nome=${encodeURIComponent(nome)}`;
  });
});