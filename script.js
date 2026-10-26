const API = 'https://pokeapi.co/api/v2';

const pokemons = [
    { id: 1,   nome: 'bulbasaur',  tipos: ['grass', 'poison'], altura: 0.7, peso: 6.9,   stats: [45, 49, 49, 65, 65, 45] },
    { id: 4,   nome: 'charmander', tipos: ['fire'],            altura: 0.6, peso: 8.5,   stats: [39, 52, 43, 60, 50, 65] },
    { id: 5,   nome: 'charmeleon', tipos: ['fire'],            altura: 1.1, peso: 19,    stats: [58, 64, 58, 80, 65, 80] },
    { id: 6,   nome: 'charizard',  tipos: ['fire', 'flying'],  altura: 1.7, peso: 90.5,  stats: [78, 84, 78, 109, 85, 100] },
    { id: 7,   nome: 'squirtle',   tipos: ['water'],           altura: 0.5, peso: 9,     stats: [44, 48, 65, 50, 64, 43] },
    { id: 25,  nome: 'pikachu',    tipos: ['electric'],        altura: 0.4, peso: 6,     stats: [35, 55, 40, 50, 50, 90] },
    { id: 39,  nome: 'jigglypuff', tipos: ['normal', 'fairy'], altura: 0.5, peso: 5.5,   stats: [115, 45, 20, 45, 25, 20] },
    { id: 52,  nome: 'meowth',     tipos: ['normal'],          altura: 0.4, peso: 4.2,   stats: [40, 45, 35, 40, 40, 90] },
    { id: 54,  nome: 'psyduck',    tipos: ['water'],           altura: 0.8, peso: 19.6,  stats: [50, 52, 48, 65, 50, 55] },
    { id: 74,  nome: 'geodude',    tipos: ['rock', 'ground'],  altura: 0.4, peso: 20,    stats: [40, 80, 100, 30, 30, 20] },
    { id: 94,  nome: 'gengar',     tipos: ['ghost', 'poison'], altura: 1.5, peso: 40.5,  stats: [60, 65, 60, 130, 75, 110] },
    { id: 131, nome: 'lapras',     tipos: ['water', 'ice'],    altura: 2.5, peso: 220,   stats: [130, 85, 80, 85, 95, 60] },
    { id: 133, nome: 'eevee',      tipos: ['normal'],          altura: 0.3, peso: 6.5,   stats: [55, 55, 50, 45, 65, 55] },
    { id: 143, nome: 'snorlax',    tipos: ['normal'],          altura: 2.1, peso: 460,   stats: [160, 110, 65, 65, 110, 30] },
    { id: 150, nome: 'mewtwo',     tipos: ['psychic'],         altura: 2,   peso: 122,   stats: [106, 110, 90, 154, 90, 130] },
    { id: 371, nome: 'bagon',      tipos: ['dragon'],          altura: 0.6, peso: 42.1,  stats: [45, 75, 60, 40, 30, 50] },
    { id: 610, nome: 'axew',       tipos: ['dragon'],          altura: 0.6, peso: 18,    stats: [46, 87, 60, 30, 40, 57] },
    { id: 810, nome: 'grookey',    tipos: ['grass'],           altura: 0.3, peso: 5,     stats: [50, 65, 50, 40, 40, 65] }
];

const traducao = {
    normal: 'Normal', fire: 'Fogo', water: 'Água', grass: 'Planta', electric: 'Elétrico',
    poison: 'Veneno', flying: 'Voador', bug: 'Inseto', ground: 'Terra', rock: 'Pedra',
    ice: 'Gelo', fighting: 'Lutador', psychic: 'Psíquico', ghost: 'Fantasma',
    dragon: 'Dragão', dark: 'Sombrio', steel: 'Aço', fairy: 'Fada'
};

const cores = {
    normal: '#a8a77a', fire: '#e8731a', water: '#3b82d6', grass: '#3f9a4a', electric: '#d4b800',
    poison: '#a33ea1', flying: '#7a8fe0', bug: '#8fa01f', ground: '#b8923e', rock: '#9c8a2e',
    ice: '#4fb5b5', fighting: '#b8352c', psychic: '#e04a7d', ghost: '#6b4f8f',
    dragon: '#5a3fd1', dark: '#5a463a', steel: '#8a8aa8', fairy: '#d685ad'
};

const classes = { fire: 'fogo', water: 'agua', grass: 'planta', electric: 'eletrico' };
const filtros = { fogo: 'fire', agua: 'water', planta: 'grass', eletrico: 'electric' };

function imagem(id) {
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + id + '.png';
}

function nomeBonito(texto) {
    const palavras = texto.split('-');
    for (let i = 0; i < palavras.length; i++) {
        palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1);
    }
    return palavras.join(' ');
}

function semAcento(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function acharLocal(busca) {
    for (let i = 0; i < pokemons.length; i++) {
        if (String(pokemons[i].id) === busca || pokemons[i].nome === busca) return pokemons[i];
    }
    return null;
}

function guardar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function pegar(chave, valorPadrao) {
    const texto = localStorage.getItem(chave);
    if (texto === null) return valorPadrao;
    return JSON.parse(texto);
}

const estado = {
    pagina: document.body.dataset.pagina,
    usuario: null,
    favoritos: [],
    vistos: [],
    filtro: 'todos',
    busca: '',
    quantidade: 12
};

function emailDoDono() {
    if (estado.usuario) return estado.usuario.email;
    return 'visitante';
}

function carregarUsuario() {
    const email = pegar('logado', null);
    const lista = pegar('usuarios', []);
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].email === email) estado.usuario = lista[i];
    }

    estado.favoritos = pegar('favoritos-' + emailDoDono(), []);
    estado.vistos = pegar('vistos-' + emailDoDono(), []);
}

function alternarFavorito(id) {
    if (estado.favoritos.includes(id)) {
        estado.favoritos = estado.favoritos.filter(f => f !== id);
    } else {
        estado.favoritos.push(id);
    }
    guardar('favoritos-' + emailDoDono(), estado.favoritos);
    atualizarContador();
}

function registrarVisto(p) {
    for (let i = 0; i < estado.vistos.length; i++) {
        if (estado.vistos[i].id === p.id) return;
    }
    estado.vistos.push({ id: p.id, tipos: p.tipos });
    guardar('vistos-' + emailDoDono(), estado.vistos);
}

function mostrarMensagem(form, texto, tipo) {
    const antiga = form.querySelector('.mensagem');
    if (antiga) antiga.remove();

    const mensagem = document.createElement('p');
    mensagem.className = 'mensagem ' + tipo;
    mensagem.textContent = texto;
    form.appendChild(mensagem);
}

function atualizarContador() {
    const contador = document.querySelector('.contador');
    if (!contador) return;
    contador.textContent = estado.favoritos.length;
    contador.hidden = estado.favoritos.length === 0;
}

function sair() {
    if (confirm('Deseja sair da sua conta?')) {
        localStorage.removeItem('logado');
        window.location.href = 'login.html';
    }
}

function iniciarMenu() {
    const botao = document.querySelector('.menu-hamburger');
    const menu = document.getElementById('menu-lista');
    if (!botao || !menu) return;

    const links = menu.querySelectorAll('a');
    const arquivoAtual = window.location.pathname.split('/').pop() || 'index.html';
    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === arquivoAtual) links[i].setAttribute('aria-current', 'page');
    }

    function abrirOuFechar(abrir) {
        menu.hidden = !abrir;
        botao.classList.toggle('aberto', abrir);
        document.body.classList.toggle('menu-aberto', abrir);
        botao.setAttribute('aria-expanded', abrir);
    }

    botao.addEventListener('click', function () {
        abrirOuFechar(menu.hidden);
    });

    document.addEventListener('click', function (evento) {
        const clicouNoMenu = menu.contains(evento.target) || botao.contains(evento.target);
        if (!clicouNoMenu) abrirOuFechar(false);
    });

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') abrirOuFechar(false);
    });

    document.getElementById('btn-sair').addEventListener('click', sair);
    atualizarContador();
}

function classeDoTipo(p) {
    return classes[p.tipos[0]] || 'exotico';
}

function ehExotico(p) {
    for (let i = 0; i < p.tipos.length; i++) {
        if (classes[p.tipos[i]] !== undefined) return false;
    }
    return true;
}

function passaNoFiltro(p, soFavoritos) {
    const ehFavorito = estado.favoritos.includes(p.id);

    const busca = semAcento(estado.busca);
    if (busca !== '' && !p.nome.includes(busca) && String(p.id) !== busca) return false;

    if (soFavoritos && !ehFavorito) return false;

    if (estado.filtro === 'todos') return true;
    if (estado.filtro === 'favoritos') return ehFavorito;
    if (estado.filtro === 'exoticos') return ehExotico(p);
    return p.tipos.includes(filtros[estado.filtro]);
}

function pintarCoracao(botao, id) {
    if (estado.favoritos.includes(id)) {
        botao.textContent = '♥';
        botao.classList.add('ativo');
        botao.setAttribute('aria-label', 'Remover dos favoritos');
    } else {
        botao.textContent = '♡';
        botao.classList.remove('ativo');
        botao.setAttribute('aria-label', 'Adicionar aos favoritos');
    }
}

function criarCard(p, posicao, animar, aoFavoritar) {
    const nome = nomeBonito(p.nome);

    const card = document.createElement('article');
    card.className = 'card ' + classeDoTipo(p);
    if (animar) card.classList.add('animar');
    card.style.setProperty('--i', posicao);

    let tiposHtml = '';
    for (let i = 0; i < p.tipos.length; i++) {
        tiposHtml += '<span class="tipo">' + (traducao[p.tipos[i]] || p.tipos[i]) + '</span>';
    }

    card.innerHTML =
        '<img src="' + imagem(p.id) + '" alt="Imagem do pokemon ' + nome + '." loading="lazy">' +
        '<div class="informacoes">' +
            '<h2><a href="pokemon.html?id=' + p.id + '">' + nome + '</a></h2>' +
            '<p class="tipos">' + tiposHtml + '</p>' +
            '<p class="medidas">' + p.altura + ' m · ' + p.peso + ' kg</p>' +
        '</div>';

    const coracao = document.createElement('button');
    coracao.type = 'button';
    coracao.className = 'btn-favorito';
    pintarCoracao(coracao, p.id);

    coracao.addEventListener('click', function (evento) {
        evento.stopPropagation();
        alternarFavorito(p.id);
        pintarCoracao(coracao, p.id);
        coracao.classList.add('pulsar');
        setTimeout(function () { coracao.classList.remove('pulsar'); }, 400);
        aoFavoritar();
    });

    card.appendChild(coracao);
    card.addEventListener('click', function () {
        window.location.href = 'pokemon.html?id=' + p.id;
    });
    return card;
}

async function iniciarLista(soFavoritos) {
    const container = document.getElementById('cards');
    const botaoMais = document.getElementById('ver-mais');
    let base = pokemons;

    if (soFavoritos) {
        container.innerHTML = '<p class="aviso">Carregando favoritos...</p>';
        base = [];
        for (let i = 0; i < estado.favoritos.length; i++) {
            const id = estado.favoritos[i];
            let p = acharLocal(String(id));
            if (p === null) p = await buscarNaApi(id);
            if (p !== null) base.push(p);
        }
    }

    function desenhar(animar) {

        const lista = [];
        for (let i = 0; i < base.length; i++) {
            if (passaNoFiltro(base[i], soFavoritos)) lista.push(base[i]);
        }

        container.innerHTML = '';

        const visiveis = lista.slice(0, estado.quantidade);
        for (let i = 0; i < visiveis.length; i++) {
            container.appendChild(criarCard(visiveis[i], i, animar, aoFavoritar));
        }

        if (lista.length === 0) {
            const aviso = document.createElement('p');
            aviso.className = 'aviso';
            aviso.textContent = soFavoritos && estado.favoritos.length === 0
                ? 'Você ainda não favoritou nenhum Pokémon.'
                : 'Nenhum Pokémon encontrado.';
            container.appendChild(aviso);
        }

        if (botaoMais) botaoMais.hidden = lista.length <= estado.quantidade;
        if (estado.pagina === 'perfil') atualizarNumerosPerfil();
    }

    function aoFavoritar() {

        if (soFavoritos || estado.filtro === 'favoritos') desenhar(false);
        else if (estado.pagina === 'perfil') atualizarNumerosPerfil();
    }

    const botaoFiltros = document.getElementById('btn-filtros');
    const grupoFiltros = document.getElementById('grupo-filtros');
    if (botaoFiltros) {
        botaoFiltros.addEventListener('click', function () {
            grupoFiltros.hidden = !grupoFiltros.hidden;
            botaoFiltros.setAttribute('aria-expanded', !grupoFiltros.hidden);
        });
    }

    const botoes = document.querySelectorAll('.filtro button');
    botoes.forEach(function (botao) {
        botao.addEventListener('click', function () {
            botoes.forEach(function (outro) { outro.setAttribute('aria-pressed', 'false'); });
            botao.setAttribute('aria-pressed', 'true');
            estado.filtro = semAcento(botao.textContent);
            estado.quantidade = 12;
            desenhar(true);
        });
    });

    const campo = document.getElementById('pesquisar');
    if (campo) {
        campo.addEventListener('input', function () {
            estado.busca = campo.value;
            estado.quantidade = 12;
            desenhar(true);
        });

        campo.closest('form').addEventListener('submit', function (evento) {
            evento.preventDefault();
            if (!container.querySelector('.card')) abrirPokemonDaApi(campo.value);
        });
    }

    if (botaoMais) {
        botaoMais.addEventListener('click', function () {
            estado.quantidade += 12;
            desenhar(false);
        });
    }

    desenhar(true);
}

function converter(dados) {
    const habilidades = [];
    for (let i = 0; i < dados.abilities.length; i++) habilidades.push(nomeBonito(dados.abilities[i].ability.name));
    const tipos = [];
    for (let i = 0; i < dados.types.length; i++) tipos.push(dados.types[i].type.name);
    const stats = [];
    for (let i = 0; i < dados.stats.length; i++) stats.push(dados.stats[i].base_stat);

    return {
        id: dados.id,
        nome: dados.name,
        tipos: tipos,
        altura: dados.height / 10,
        peso: dados.weight / 10,
        stats: stats,
        habilidades: habilidades
    };
}

async function buscarNaApi(idOuNome) {
    try {
        const resposta = await fetch(API + '/pokemon/' + idOuNome);
        if (!resposta.ok) return null;
        return converter(await resposta.json());
    } catch (erro) {
        return null;
    }
}

async function abrirPokemonDaApi(texto) {
    const nome = semAcento(texto);
    if (nome === '') return;
    const p = await buscarNaApi(nome);
    if (p === null) alert('Pokémon não encontrado. Use o nome em inglês (ex.: pikachu) ou o número.');
    else window.location.href = 'pokemon.html?id=' + p.id;
}

function iniciarCarrossel() {
    const slides = document.getElementById('slides');
    const anterior = document.getElementById('slide-anterior');
    const proximo = document.getElementById('slide-proximo');
    if (!slides) return;

    proximo.addEventListener('click', function () {
        slides.appendChild(slides.firstElementChild);
    });
    anterior.addEventListener('click', function () {
        slides.insertBefore(slides.lastElementChild, slides.firstElementChild);
    });
}

let idAtual = null;

async function iniciarDetalhe() {
    const parametros = new URLSearchParams(window.location.search);
    const busca = (parametros.get('id') || parametros.get('nome') || '25').toLowerCase();

    document.getElementById('pesquisar').closest('form').addEventListener('submit', function (evento) {
        evento.preventDefault();
        abrirPokemonDaApi(document.getElementById('pesquisar').value);
    });

    const botaoFavorito = document.getElementById('btn-favorito');
    botaoFavorito.addEventListener('click', function () {
        alternarFavorito(idAtual);
        pintarBotaoDetalhe();
        botaoFavorito.classList.add('pulsar');
        setTimeout(function () { botaoFavorito.classList.remove('pulsar'); }, 400);
    });

    const local = acharLocal(busca);
    if (local !== null) preencherPagina(local);

    const p = await buscarNaApi(busca);
    if (p !== null) {
        preencherPagina(p);
        registrarVisto(p);
        buscarVariantes(p.id);
        buscarLocais(p.id);
    } else if (local !== null) {
        registrarVisto(local);
        document.getElementById('variantes').innerHTML = '<li class="aviso">Variantes indisponíveis sem internet.</li>';
        document.getElementById('locais').innerHTML = '<li class="aviso">Locais indisponíveis sem internet.</li>';
    } else {
        document.querySelector('main').innerHTML =
            '<section class="erro-pokemon"><h1>Pokémon não encontrado</h1>' +
            '<p>Confira o nome (em inglês) ou o número e tente de novo.</p>' +
            '<a class="btn-voltar" href="index.html">Voltar para a Pokédex</a></section>';
    }
}

function pintarBotaoDetalhe() {
    const botao = document.getElementById('btn-favorito');
    if (estado.favoritos.includes(idAtual)) {
        botao.textContent = '♥ Favoritado';
        botao.classList.add('ativo');
    } else {
        botao.textContent = '♡ Favoritar';
        botao.classList.remove('ativo');
    }
}

function preencherPagina(p) {
    idAtual = p.id;
    const nome = nomeBonito(p.nome);

    document.title = nome + ' - Pokedex';
    document.getElementById('nome-pokemon').textContent = nome;
    document.getElementById('numero-pokemon').textContent = '#' + String(p.id).padStart(3, '0');
    document.getElementById('imagem').src = imagem(p.id);
    document.getElementById('imagem').alt = 'Imagem do pokemon ' + nome + '.';
    document.getElementById('peso').textContent = p.peso + ' kg';
    document.getElementById('altura').textContent = p.altura + ' m';
    if (p.habilidades) document.getElementById('habilidades').textContent = p.habilidades.join(', ');

    document.querySelector('main').style.setProperty('--cor-tipo', cores[p.tipos[0]] || '#d4b800');

    const listaTipos = document.getElementById('tipos');
    listaTipos.innerHTML = '';
    for (let i = 0; i < p.tipos.length; i++) {
        const etiqueta = document.createElement('li');
        etiqueta.className = 'tipo-badge';
        etiqueta.textContent = traducao[p.tipos[i]] || p.tipos[i];
        etiqueta.style.background = cores[p.tipos[i]] || '#555';
        listaTipos.appendChild(etiqueta);
    }

    const linhas = document.querySelectorAll('#stats li');
    let total = 0;
    for (let i = 0; i < linhas.length; i++) {
        linhas[i].querySelector('.barra-stat').style.setProperty('--v', Math.min(100, p.stats[i] / 1.5));
        linhas[i].querySelector('b').textContent = p.stats[i];
        total += p.stats[i];
    }
    document.getElementById('total').textContent = total;

    pintarBotaoDetalhe();
    document.querySelector('main').classList.remove('carregando');
}

async function buscarVariantes(id) {
    const lista = document.getElementById('variantes');
    try {
        const resposta = await fetch(API + '/pokemon-species/' + id);
        const especie = await resposta.json();

        for (let i = 0; i < especie.genera.length; i++) {
            if (especie.genera[i].language.name === 'en') {
                document.getElementById('categoria').textContent = especie.genera[i].genus.replace(' Pokémon', '');
            }
        }

        lista.innerHTML = '';
        const total = Math.min(4, especie.varieties.length);
        for (let i = 0; i < total; i++) {
            const forma = await (await fetch(especie.varieties[i].pokemon.url)).json();
            const item = document.createElement('li');
            item.className = 'variante';
            item.innerHTML =
                '<a href="pokemon.html?id=' + forma.id + '">' +
                    '<p>' + nomeBonito(forma.name) + '</p>' +
                    '<span class="selo">' + (i === 0 ? 'Padrão' : 'Variante') + '</span>' +
                    '<img src="' + (forma.sprites.front_default || '') + '" alt="' + forma.name + '">' +
                '</a>';
            lista.appendChild(item);
        }
    } catch (erro) {
        lista.innerHTML = '<li class="aviso">Não foi possível carregar as variantes.</li>';
    }
}

async function buscarLocais(id) {
    const lista = document.getElementById('locais');
    try {
        const resposta = await fetch(API + '/pokemon/' + id + '/encounters');
        const locais = await resposta.json();

        lista.innerHTML = '';
        if (locais.length === 0) {
            lista.innerHTML = '<li class="aviso">Sem registros de localização.</li>';
            return;
        }
        const total = Math.min(3, locais.length);
        for (let i = 0; i < total; i++) {

            let chance = 0;
            for (let j = 0; j < locais[i].version_details.length; j++) {
                if (locais[i].version_details[j].max_chance > chance) chance = locais[i].version_details[j].max_chance;
            }
            const raridade = chance >= 30 ? 'comum' : 'raro';
            const item = document.createElement('li');
            item.className = 'local';
            item.innerHTML = nomeBonito(locais[i].location_area.name.replace('-area', '')) +
                ' <span class="badge ' + raridade + '">' + (chance >= 30 ? 'Comum' : 'Raro') + '</span>';
            lista.appendChild(item);
        }
    } catch (erro) {
        lista.innerHTML = '<li class="aviso">Não foi possível carregar os locais.</li>';
    }
}

function iniciarLogin() {
    const form = document.getElementById('form-login');
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const senha = document.getElementById('senha').value;
        const lista = pegar('usuarios', []);

        for (let i = 0; i < lista.length; i++) {
            if (lista[i].email === email && lista[i].senha === senha) {
                guardar('logado', email);
                window.location.href = 'index.html';
                return;
            }
        }
        mostrarMensagem(form, 'E-mail ou senha incorretos.', 'erro');
    });
}

function iniciarCadastro() {
    const form = document.getElementById('form-cadastro');
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const senha = document.getElementById('senha').value;
        const lista = pegar('usuarios', []);

        if (senha.length < 6) {
            mostrarMensagem(form, 'A senha precisa ter pelo menos 6 caracteres.', 'erro');
            return;
        }
        for (let i = 0; i < lista.length; i++) {
            if (lista[i].email === email) {
                mostrarMensagem(form, 'Este e-mail já está cadastrado.', 'erro');
                return;
            }
        }

        lista.push({ nome: nome, email: email, senha: senha, criadoEm: new Date().toISOString() });
        guardar('usuarios', lista);
        guardar('logado', email);
        window.location.href = 'index.html';
    });
}

function iniciarRecuperar() {
    const form = document.getElementById('form-recuperar');
    const blocoSenha = document.getElementById('bloco-nova-senha');
    let emailEncontrado = null;

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        const lista = pegar('usuarios', []);

        if (emailEncontrado === null) {

            const email = document.getElementById('email').value.trim().toLowerCase();
            let achou = false;
            for (let i = 0; i < lista.length; i++) {
                if (lista[i].email === email) achou = true;
            }
            if (!achou) {
                mostrarMensagem(form, 'E-mail não encontrado.', 'erro');
                return;
            }
            emailEncontrado = email;
            blocoSenha.hidden = false;
            document.getElementById('senha').required = true;
            form.querySelector('button[type="submit"]').textContent = 'SALVAR NOVA SENHA';
            mostrarMensagem(form, 'E-mail encontrado. Digite a nova senha.', 'ok');
        } else {

            const senha = document.getElementById('senha').value;
            if (senha.length < 6) {
                mostrarMensagem(form, 'A senha precisa ter pelo menos 6 caracteres.', 'erro');
                return;
            }
            for (let i = 0; i < lista.length; i++) {
                if (lista[i].email === emailEncontrado) lista[i].senha = senha;
            }
            guardar('usuarios', lista);
            mostrarMensagem(form, 'Senha alterada! Voltando para o login...', 'ok');
            setTimeout(function () { window.location.href = 'login.html'; }, 1200);
        }
    });
}

function iniciarOlhos() {
    const botoes = document.querySelectorAll('[data-olho]');
    botoes.forEach(function (botao) {
        botao.addEventListener('click', function () {
            const campo = document.getElementById(botao.dataset.olho);
            if (campo.type === 'password') {
                campo.type = 'text';
                if (botao.classList.contains('btn-olho')) botao.textContent = 'Ocultar';
            } else {
                campo.type = 'password';
                if (botao.classList.contains('btn-olho')) botao.textContent = 'Mostrar';
            }
        });
    });
}

function atualizarNumerosPerfil() {
    const tiposVistos = [];
    for (let i = 0; i < estado.vistos.length; i++) {
        for (let j = 0; j < estado.vistos[i].tipos.length; j++) {
            if (!tiposVistos.includes(estado.vistos[i].tipos[j])) tiposVistos.push(estado.vistos[i].tipos[j]);
        }
    }
    document.getElementById('num-favoritos').textContent = estado.favoritos.length;
    document.getElementById('num-vistos').textContent = estado.vistos.length;
    document.getElementById('num-tipos').textContent = tiposVistos.length;
}

function iniciarPerfil() {
    const form = document.getElementById('form-perfil');
    const usuario = estado.usuario || { nome: 'Visitante', email: '', criadoEm: new Date().toISOString() };

    function mostrarDados() {
        document.getElementById('nome-treinador').textContent = usuario.nome;
        document.getElementById('email-treinador').textContent = usuario.email || 'Modo visitante';
        document.getElementById('desde-treinador').textContent = 'Treinador desde ' + new Date(usuario.criadoEm).getFullYear();
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('email').value = usuario.email;
    }
    mostrarDados();

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        if (estado.usuario === null) {
            mostrarMensagem(form, 'Faça login para editar o perfil.', 'erro');
            return;
        }
        const novaSenha = document.getElementById('senha').value;
        if (novaSenha !== '' && novaSenha.length < 6) {
            mostrarMensagem(form, 'A nova senha precisa ter pelo menos 6 caracteres.', 'erro');
            return;
        }

        const lista = pegar('usuarios', []);
        for (let i = 0; i < lista.length; i++) {
            if (lista[i].email === usuario.email) {
                lista[i].nome = document.getElementById('nome').value.trim() || lista[i].nome;
                if (novaSenha !== '') lista[i].senha = novaSenha;
                usuario.nome = lista[i].nome;
            }
        }
        guardar('usuarios', lista);
        document.getElementById('senha').value = '';
        mostrarDados();
        mostrarMensagem(form, 'Alterações salvas!', 'ok');
    });

    document.getElementById('btn-sair-perfil').addEventListener('click', sair);
    iniciarLista(true);
}

const EXIGIR_LOGIN = true;

function iniciar() {
    carregarUsuario();

    const paginasPublicas = ['login', 'cadastro', 'recuperar'];
    const ehPublica = paginasPublicas.includes(estado.pagina);

    if (EXIGIR_LOGIN && estado.usuario === null && !ehPublica) {
        window.location.href = 'login.html';
        return;
    }

    if (estado.usuario !== null && (estado.pagina === 'login' || estado.pagina === 'cadastro')) {
        window.location.href = 'index.html';
        return;
    }

    iniciarMenu();
    iniciarOlhos();

    if (estado.pagina === 'index') { iniciarCarrossel(); iniciarLista(false); }
    if (estado.pagina === 'favoritos') iniciarLista(true);
    if (estado.pagina === 'pokemon') iniciarDetalhe();
    if (estado.pagina === 'perfil') iniciarPerfil();
    if (estado.pagina === 'login') iniciarLogin();
    if (estado.pagina === 'cadastro') iniciarCadastro();
    if (estado.pagina === 'recuperar') iniciarRecuperar();
}

iniciar();