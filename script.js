// ===== Lista de pokémons (mesmo formato da PokeAPI) =====
// Para adicionar um novo, copie um bloco e troque id, name, tipo e a imagem.
const sprite = id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const pokemons = [
  { id: 1, name: "bulbasaur", tipo: "planta", sprites: { front_default: sprite(1) } },
  { id: 4, name: "charmander", tipo: "fogo", sprites: { front_default: sprite(4) } },
  { id: 5, name: "charmeleon", tipo: "fogo", sprites: { front_default: sprite(5) } },
  { id: 6, name: "charizard", tipo: "fogo", sprites: { front_default: sprite(6) } },
  { id: 7, name: "squirtle", tipo: "agua", sprites: { front_default: sprite(7) } },
  { id: 25, name: "pikachu", tipo: "eletrico", sprites: { front_default: sprite(25) } },
  { id: 371, name: "bagon", tipo: "dragao", sprites: { front_default: sprite(371) } },
  { id: 610, name: "axew", tipo: "dragao", sprites: { front_default: sprite(610) } }
];

// ===== LocalStorage: guardar e ler =====
// O localStorage só guarda texto -> JSON.stringify para salvar, JSON.parse para ler.
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function salvarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  atualizarContador();                               // atualiza o número no menu
}

function alternarFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);   // remove
  } else {
    favoritos.push(id);                            // adiciona
  }
  salvarFavoritos();
  mostrarPokemons();                                 // redesenha a tela
}

// ===== Menu hambúrguer =====
const menu = document.querySelector('.menu-hamburger');

// Mostra a quantidade de favoritos ao lado de "Meus favoritos"
function atualizarContador() {
  const contador = document.querySelector('.menu-lista .contador');
  if (!contador) return;
  contador.textContent = favoritos.length;
  contador.hidden = favoritos.length === 0;
}

if (menu) {
  const paginaAtual = location.pathname.split('/').pop() || 'index.html';
  const itens = [
    { texto: 'Perfil', link: 'perfil.html', icone: '👤' },
    { texto: 'Meus favoritos', link: 'favoritos.html', icone: '♥', contador: true },
    { texto: 'Mais Pokémons', link: 'index.html', icone: '⚡' }
  ];

  // Fundo escuro atrás do menu (só visual)
  const fundo = document.createElement('div');
  fundo.className = 'menu-fundo';
  fundo.hidden = true;

  // Painel com os links, criado pelo JS
  const lista = document.createElement('nav');
  lista.className = 'menu-lista';
  lista.id = 'menu-lista';
  lista.hidden = true;
  lista.setAttribute('aria-label', 'Menu principal');

  itens.forEach(item => {
    const a = document.createElement('a');
    a.href = item.link;
    a.innerHTML = `<span class="icone">${item.icone}</span>${item.texto}`;
    if (item.contador) {
      const c = document.createElement('span');
      c.className = 'contador';
      a.appendChild(c);
    }
    if (item.link === paginaAtual) a.setAttribute('aria-current', 'page');   // página atual destacada
    lista.appendChild(a);
  });

  const sair = document.createElement('a');
  sair.href = '#';
  sair.className = 'sair';
  sair.innerHTML = '<span class="icone">⎋</span>Sair / Deslogar';
  lista.appendChild(sair);

  menu.after(lista);
  document.body.appendChild(fundo);

  // Acessibilidade: o ícone funciona como botão, inclusive no teclado
  menu.setAttribute('role', 'button');
  menu.setAttribute('tabindex', '0');
  menu.setAttribute('aria-controls', 'menu-lista');

  function abrirMenu(abrir) {
    lista.hidden = !abrir;
    fundo.hidden = !abrir;
    menu.classList.toggle('aberto', abrir);              // vira um "X" pelo CSS
    menu.setAttribute('aria-expanded', abrir);
    menu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  }
  abrirMenu(false);

  menu.addEventListener('click', () => abrirMenu(lista.hidden));
  menu.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirMenu(lista.hidden); }
  });

  // Fecha: clicando fora, apertando Esc ou escolhendo um link
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !lista.contains(e.target)) abrirMenu(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lista.hidden) { abrirMenu(false); menu.focus(); }
  });
  lista.addEventListener('click', () => abrirMenu(false));

  sair.addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Deseja sair? Seus dados de usuário serão apagados deste navegador.')) {
      localStorage.removeItem('usuario');
      location.href = 'index.html';
    }
  });

  atualizarContador();
}

// ===== Cards (index.html e favoritos.html) =====
const container = document.querySelector('.cards-pokemon');
const campo = document.querySelector('#pesquisar');
const botoes = [...document.querySelectorAll('.filtro button')];
const soFavoritos = location.pathname.includes('favoritos');   // página de favoritos?
const noPerfil = location.pathname.includes('perfil');
let filtroAtual = 'todos';

// Tira acentos e deixa minúsculo: "Elétrico" -> "eletrico"
const normalizar = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const maiuscula = t => t.charAt(0).toUpperCase() + t.slice(1);

function criarCard(pokemon) {
  const card = document.createElement('div');
  card.className = `card ${pokemon.tipo}`;

  const img = document.createElement('img');
  img.src = pokemon.sprites.front_default;
  img.alt = `Imagem do pokemon ${pokemon.name}.`;

  const info = document.createElement('div');
  info.className = 'informacoes';
  info.innerHTML = `
        <h2>${maiuscula(pokemon.name)}</h2>
        <p>Tipo: ${maiuscula(pokemon.tipo)}</p>`;

  const coracao = document.createElement('button');
  coracao.type = 'button';
  coracao.className = 'btn-favorito';
  const favorito = favoritos.includes(pokemon.id);
  coracao.textContent = favorito ? '♥' : '♡';
  coracao.classList.toggle('ativo', favorito);
  coracao.addEventListener('click', e => {
    e.stopPropagation();               // não abre o card ao clicar no coração
    alternarFavorito(pokemon.id);
  });

  card.addEventListener('click', () => {
    location.href = `pokemon.html?id=${pokemon.id}`;
  });

  card.append(img, info, coracao);
  return card;
}

function mostrarPokemons() {
  if (!container) return;
  const busca = normalizar(campo?.value || '');

  const lista = pokemons.filter(p => {
    const favorito = favoritos.includes(p.id);
    const principais = ['fogo', 'agua', 'planta', 'eletrico'];

    let passaFiltro = true;
    if (filtroAtual === 'favoritos') passaFiltro = favorito;
    else if (filtroAtual === 'exoticos') passaFiltro = !principais.includes(p.tipo);
    else if (filtroAtual !== 'todos') passaFiltro = p.tipo === filtroAtual;

    return passaFiltro
      && normalizar(p.name).includes(busca)
      && (!(soFavoritos || noPerfil) || favorito);
  });

  container.innerHTML = '';                          // limpa os cards antigos
  lista.forEach(p => container.appendChild(criarCard(p)));

  if (lista.length === 0) {
    const aviso = document.createElement('p');
    aviso.className = 'aviso';
    aviso.textContent = 'Nenhum Pokémon encontrado.';
    container.appendChild(aviso);
  }
}

botoes.forEach(botao => botao.addEventListener('click', () => {
  botoes.forEach(b => b.classList.remove('ativo'));
  botao.classList.add('ativo');
  filtroAtual = normalizar(botao.textContent);
  mostrarPokemons();
}));

campo?.addEventListener('input', mostrarPokemons);
mostrarPokemons();

// ===== Pesquisar qualquer Pokémon na PokeAPI (tecla Enter) =====
// Na página do Pokémon sempre busca; nas listas só busca se nada foi encontrado.
async function abrirPokemonPelaApi(texto) {
  const nome = normalizar(texto);
  if (!nome) return;
  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
    if (!resposta.ok) throw new Error('não encontrado');
    const dados = await resposta.json();
    location.href = `pokemon.html?id=${dados.id}`;
  } catch {
    alert('Pokémon não encontrado. Tente o nome em inglês, como "pikachu".');
  }
}

campo?.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const naPaginaDoPokemon = location.pathname.includes('pokemon');
  const semResultados = container?.querySelector('.aviso');
  if (naPaginaDoPokemon || semResultados) abrirPokemonPelaApi(campo.value);
});

// ===== Página do Pokémon =====
// Cada Pokémon tem a sua própria página, escolhida pela URL:
//   pokemon.html?id=25        ou        pokemon.html?nome=pikachu
// O JS lê esse parâmetro, pede os dados à PokeAPI e monta a página.
const API = 'https://pokeapi.co/api/v2';
const ULTIMO_ID = 1025;

const TIPOS_PT = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', grass: 'Planta', electric: 'Elétrico',
  poison: 'Veneno', flying: 'Voador', bug: 'Inseto', ground: 'Terra', rock: 'Pedra',
  ice: 'Gelo', fighting: 'Lutador', psychic: 'Psíquico', ghost: 'Fantasma',
  dragon: 'Dragão', dark: 'Sombrio', steel: 'Aço', fairy: 'Fada'
};
const COR_TIPO = {
  normal: '#a8a77a', fire: '#e8731a', water: '#3b82d6', grass: '#3f9a4a', electric: '#d4b800',
  poison: '#a33ea1', flying: '#7a8fe0', bug: '#8fa01f', ground: '#b8923e', rock: '#9c8a2e',
  ice: '#4fb5b5', fighting: '#b8352c', psychic: '#e04a7d', ghost: '#6b4f8f',
  dragon: '#5a3fd1', dark: '#5a463a', steel: '#8a8aa8', fairy: '#d685ad'
};

// fetch + .json() + erro se a resposta não for 200
async function buscarJson(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return resposta.json();
}

async function mostrarDetalhe() {
  const main = document.querySelector('main');
  const parametros = new URLSearchParams(location.search);
  const busca = (parametros.get('id') || parametros.get('nome') || '25').toLowerCase().trim();

  main.classList.add('carregando');                      // deixa a página "apagada" enquanto carrega

  try {
    const dados = await buscarJson(`${API}/pokemon/${busca}`);
    const id = dados.id;
    const nome = maiuscula(dados.name.replace(/-/g, ' '));
    const tipos = dados.types.map(t => t.type.name);

    // guarda este Pokémon como "visto"
    const vistos = JSON.parse(localStorage.getItem('vistos')) || [];
    if (!vistos.includes(id)) localStorage.setItem('vistos', JSON.stringify([...vistos, id]));

    document.title = `${nome} - Pokedex`;
    main.style.setProperty('--cor-tipo', COR_TIPO[tipos[0]] || '#d4b800');   // cor do 1º tipo

    desenharTitulo(main, id, nome);
    desenharImagem(dados, nome);
    desenharEstatisticas(dados);
    desenharFicha(dados, id, tipos);

    main.classList.remove('carregando');
    carregarEspecie(id);          // categoria + variantes (não trava a página)
    carregarLocais(id);           // onde encontrar
  } catch (erro) {
    console.error('Erro ao buscar na PokeAPI:', erro);
    mostrarErro(main, busca, erro);
  }
}

function desenharTitulo(main, id, nome) {
  document.querySelector('.titulo-pokemon')?.remove();
  const titulo = document.createElement('div');
  titulo.className = 'titulo-pokemon';

  const anterior = document.createElement('a');
  anterior.className = 'nav-pokemon';
  if (id > 1) { anterior.href = `pokemon.html?id=${id - 1}`; anterior.textContent = `‹ #${String(id - 1).padStart(3, '0')}`; }
  else anterior.classList.add('vazio');

  const proximo = document.createElement('a');
  proximo.className = 'nav-pokemon';
  if (id < ULTIMO_ID) { proximo.href = `pokemon.html?id=${id + 1}`; proximo.textContent = `#${String(id + 1).padStart(3, '0')} ›`; }
  else proximo.classList.add('vazio');

  const h1 = document.createElement('h1');
  h1.innerHTML = `${nome} <small>#${String(id).padStart(3, '0')}</small>`;

  titulo.append(anterior, h1, proximo);
  main.querySelector('.barra').after(titulo);
}

function desenharImagem(dados, nome) {
  let img = document.querySelector('img.pokemon');
  if (!img) {                                              // HTML sem a imagem? cria
    img = document.createElement('img');
    img.className = 'pokemon';
    document.querySelector('.titulo-pokemon').after(img);
  }
  img.src = dados.sprites.other['official-artwork'].front_default || dados.sprites.front_default || '';
  img.alt = `Imagem do pokemon ${nome}.`;
}

function desenharEstatisticas(dados) {
  const nomes = ['HP', 'ATAQUE', 'DEFESA', 'SP. ATK', 'SP. DEF', 'VELOCIDADE'];
  let caixa = document.querySelector('.estatistica');
  if (!caixa) {                                            // cria a caixa se não existir no HTML
    caixa = document.createElement('div');
    caixa.className = 'estatistica';
    document.querySelector('img.pokemon').after(caixa);
  }
  if (!caixa.querySelector('ul')) {
    caixa.innerHTML = '<ul>' + nomes.map(() => '<li></li>').join('') + '</ul>';
  }
  if (!caixa.querySelector('.total')) {
    caixa.insertAdjacentHTML('beforeend', '<div class="total"><span>TOTAL</span><b></b></div>');
  }
  document.querySelectorAll('.estatistica li').forEach((li, i) => {
    const valor = dados.stats[i].base_stat;
    li.textContent = `${nomes[i]}: ${valor}`;
    li.style.setProperty('--v', Math.min(100, valor / 1.5));        // largura da barra
  });
  const total = dados.stats.reduce((soma, s) => soma + s.base_stat, 0);
  document.querySelector('.estatistica .total b').textContent = total;
}

function desenharFicha(dados, id, tipos) {
  document.querySelector('.ficha')?.remove();
  const ficha = document.createElement('div');
  ficha.className = 'ficha';

  const linhaTipos = document.createElement('div');
  linhaTipos.className = 'tipos-ficha';
  tipos.forEach(t => {
    const badge = document.createElement('span');
    badge.className = 'tipo-badge';
    badge.textContent = TIPOS_PT[t] || maiuscula(t);
    badge.style.background = COR_TIPO[t] || '#555';
    linhaTipos.appendChild(badge);
  });

  const bloco = (rotulo, valor, idElemento = '') => `
        <div><small>${rotulo}</small><strong ${idElemento ? `id="${idElemento}"` : ''}>${valor}</strong></div>`;
  const habilidades = dados.abilities.map(a => maiuscula(a.ability.name.replace(/-/g, ' '))).join(', ');

  ficha.appendChild(linhaTipos);
  ficha.insertAdjacentHTML('beforeend',
    bloco('PESO', `${dados.weight / 10} kg`) +
    bloco('ALTURA', `${dados.height / 10} m`) +
    bloco('CATEGORIA', '...', 'categoria') +
    bloco('HABILIDADES', habilidades));

  // botão de favoritar (usa o mesmo localStorage da lista)
  const coracao = document.createElement('button');
  coracao.type = 'button';
  coracao.className = 'btn-favorito';
  const pintar = () => {
    const fav = favoritos.includes(id);
    coracao.textContent = fav ? '♥ Favoritado' : '♡ Favoritar';
    coracao.classList.toggle('ativo', fav);
  };
  pintar();
  coracao.addEventListener('click', () => {
    favoritos = favoritos.includes(id) ? favoritos.filter(f => f !== id) : [...favoritos, id];
    salvarFavoritos();
    pintar();
  });
  ficha.appendChild(coracao);
  document.querySelector('img.pokemon').before(ficha);
}

async function carregarEspecie(id) {
  try {
    const especie = await buscarJson(`${API}/pokemon-species/${id}`);
    const genus = especie.genera.find(g => g.language.name === 'en');
    document.querySelector('#categoria').textContent = genus ? genus.genus.replace(' Pokémon', '') : '—';

    let article = document.querySelector('main > article');
    if (!article) {
      article = document.createElement('article');
      document.querySelector('main').appendChild(article);
    }
    article.innerHTML = '';                                     // remove os exemplos do HTML
    const formas = await Promise.all(especie.varieties.slice(0, 4).map(v => buscarJson(v.pokemon.url)));

    formas.forEach((forma, i) => {
      const bloco = document.createElement('div');
      bloco.className = 'variante' + (forma.id === id ? ' atual' : '');
      bloco.innerHTML = `
                <p>${maiuscula(forma.name.replace(/-/g, ' '))}</p>
                <span>${i === 0 ? 'Padrão' : 'Variante'}</span>
                <img src="${forma.sprites.front_default || ''}" alt="${forma.name}">`;
      bloco.addEventListener('click', () => (location.href = `pokemon.html?id=${forma.id}`));   // cada forma tem a sua página
      article.appendChild(bloco);
    });
  } catch (erro) {
    console.error('Erro nas variantes:', erro);
  }
}

async function carregarLocais(id) {
  const main = document.querySelector('main');
  const aside = main.querySelector('aside') || main.appendChild(document.createElement('aside'));
  aside.innerHTML = '';                                           // remove os exemplos do HTML
  try {
    const locais = await buscarJson(`${API}/pokemon/${id}/encounters`);
    if (locais.length === 0) {
      aside.innerHTML = '<p class="aviso">Sem registros de localização.</p>';
      return;
    }
    locais.slice(0, 3).forEach(l => {
      const chance = Math.max(...l.version_details.map(v => v.max_chance));
      const div = document.createElement('div');
      div.className = 'local';
      div.innerHTML = `${maiuscula(l.location_area.name.replace(/-/g, ' '))}
                <span class="badge ${chance >= 30 ? 'comum' : 'raro'}">${chance >= 30 ? 'Comum' : 'Raro'}</span>`;
      aside.appendChild(div);
    });
  } catch (erro) {
    aside.innerHTML = '<p class="aviso">Não foi possível carregar os locais.</p>';
  }
}

function mostrarErro(main, busca, erro) {
  main.classList.remove('carregando');
  [...main.children].filter(el => !el.classList.contains('barra')).forEach(el => el.remove());
  document.title = 'Pokémon não encontrado - Pokedex';

  const aviso = document.createElement('div');
  aviso.className = 'erro-pokemon';
  const naoExiste = erro?.message === 'Erro 404';
  aviso.innerHTML = naoExiste
    ? `<h1>Pokémon não encontrado</h1>
        <p>Não encontramos "${busca.replace(/</g, '&lt;')}". Verifique o nome (em inglês) ou o número.</p>`
    : `<h1>Não foi possível carregar</h1>
        <p>Falha ao conectar com a PokeAPI. Verifique sua internet e tente de novo.</p>`;
  aviso.insertAdjacentHTML('beforeend', `

        <a href="index.html" class="btn-voltar">Voltar para a Pokédex</a>`);
  main.appendChild(aviso);
}

if (location.pathname.includes('pokemon')) mostrarDetalhe();

// ===== Perfil =====
if (noPerfil) {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || { nome: 'Nome do Treinador', email: 'treinador@email.com' };
  const inputs = document.querySelectorAll('.form-perfil input');
  const titulo = document.querySelector('.perfil-card h1');
  const email = document.querySelector('.perfil-card p');

  function mostrarUsuario() {
    titulo.textContent = usuario.nome;
    email.textContent = usuario.email;
    inputs[0].value = usuario.nome;
    inputs[1].value = usuario.email;
  }
  mostrarUsuario();

  document.querySelector('.form-perfil .btn').addEventListener('click', () => {
    usuario.nome = inputs[0].value.trim() || usuario.nome;
    usuario.email = inputs[1].value.trim() || usuario.email;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    mostrarUsuario();
  });

  const vistos = JSON.parse(localStorage.getItem('vistos')) || [];
  const tiposVistos = new Set(pokemons.filter(p => vistos.includes(p.id)).map(p => p.tipo));
  const numeros = document.querySelectorAll('.numeros strong');
  numeros[0].textContent = favoritos.length;
  numeros[1].textContent = vistos.length;
  numeros[2].textContent = tiposVistos.size;
}