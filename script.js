
const lugares = [
    {
        id: "encontro-rios",
        nome: "Encontro dos Rios",
        categoria: "natureza",
        etiqueta: "Natureza",
        local: "Barra do Corda, MA",
        descricao: "Conheça a paisagem formada pelos rios Corda e Mearim e sua relação com a cidade.",
        detalhes: "Os rios Corda e Mearim fazem parte da paisagem e da identidade de Barra do Corda.",
        imagem: "bdc/WhatsApp Image 2026-10-17 at 21.04.01.jpeg"
    },
    {
        id: "igreja-matriz",
        nome: "Igreja Matriz",
        categoria: "historia",
        etiqueta: "História",
        local: "Barra do Corda, MA",
        descricao: "Um espaço de fé e memória para moradores e visitantes.",
        detalhes: "Registre aqui a história, a arquitetura e a importância da igreja.",
        imagem: "bdc/WhatsApp Image 2026-10-18 at 00.01.41.jpeg"
    },
    {
        id: "praca-melo-uchoa",
        nome: "Praça Melo Uchôa",
        categoria: "cultura",
        etiqueta: "Cultura",
        local: "Barra do Corda, MA",
        descricao: "Um espaço público de convivência e cotidiano da cidade.",
        detalhes: "Registre a história, a localização e os eventos realizados na praça.",
        imagem: "bdc/WhatsApp Image 2026-10-18 at 00.27.02.jpeg"
    },
    {
        id: "igreja-calvario",
        nome: "Igreja do Calvário",
        categoria: "historia",
        etiqueta: "História",
        local: "Barra do Corda, MA",
        descricao: "Um lugar para conhecer aspectos da história religiosa local.",
        detalhes: "Acrescente informações verificadas sobre a história e a arquitetura da igreja.",
        imagem: "bdc/WhatsApp Image 2026-10-25 at 00.06.32.jpeg"
    },
    {
        id: "beira-rio",
        nome: "Beira-Rio",
        categoria: "natureza",
        etiqueta: "Natureza",
        local: "Barra do Corda, MA",
        descricao: "Valorize a paisagem dos rios e os espaços próximos às suas margens.",
        detalhes: "Registre os acessos e os cuidados necessários para preservar o ambiente.",
        imagem: "bdc/WhatsApp Image 2026-10-18 at 00.35.55.jpeg"
    },
    {
        id: "cachoeira-fumaca",
        nome: "Cachoeira da Fumaça",
        categoria: "natureza",
        etiqueta: "Natureza",
        local: "Região de Barra do Corda",
        descricao: "Descubra paisagens naturais da região.",
        detalhes: "Confirme a localização e as condições de acesso antes da visita.",
        imagem: "bdc/WhatsApp Image 2026-10-25 at 00.11.10.jpeg"
    },
    {
        id: "cachoeira-grande",
        nome: "Cachoeira Grande",
        categoria: "natureza",
        etiqueta: "Natureza",
        local: "Região de Barra do Corda",
        descricao: "Conheça as paisagens naturais e as informações de acesso.",
        detalhes: "Confirme o nome local, a localização e as condições de visitação.",
        imagem: "bdc/WhatsApp Image 2026-10-25 at 00.45.07 (1).jpeg"
    },
    {
        id: "balneario-guajajara",
        nome: "Balneário Guajajara",
        categoria: "cultura",
        etiqueta: "Cultura",
        local: "Região de Barra do Corda",
        descricao: "Um espaço para registrar informações e fotografias locais.",
        detalhes: "Confirme o endereço, as regras de entrada e o funcionamento.",
        imagem: "bdc/WhatsApp Image 2026-10-25 at 00.45.07.jpeg"
    },
    {
        id: "igreja-santa-gianna",
        nome: "Igreja Santa Gianna",
        categoria: "cultura",
        etiqueta: "Cultura",
        local: "Região de Barra do Corda",
        descricao: "Um espaço religioso que faz parte da vivência da comunidade.",
        detalhes: "Consulte fontes locais para confirmar o endereço e os horários das celebrações.",
        imagem: "bdc/WhatsApp Image 2026-10-25 at 00.45.06.jpeg"
    },
    {
        id: "vila-beira-rio",
        nome: "Vila Beira Rio",
        categoria: "culinaria",
        etiqueta: "Culinária",
        local: "Região de Barra do Corda",
        descricao: "Explore os estabelecimentos e os sabores da culinária local.",
        detalhes: "Adicione informações verificadas sobre restaurantes, pratos, preços e localização.",
        imagem: "bdc/WhatsApp Image 2026-10-25 at 00.55.18.jpeg"
    }
];

const grade = document.getElementById("gradeDestinos");
const pesquisa = document.getElementById("pesquisa");
const filtros = document.querySelectorAll(".filtro");
const contador = document.getElementById("contador");
const semResultados = document.getElementById("semResultados");
const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modalTitulo");
const modalTexto = document.getElementById("modalTexto");
const aviso = document.getElementById("aviso");

let filtroAtual = "todos";
let termoPesquisa = "";
let avisoTemporizador;

function lerFavoritos() {
    try {
        const dados = JSON.parse(
            localStorage.getItem("memoriaVivaFavoritos") || "[]"
        );
        return new Set(Array.isArray(dados) ? dados : []);
    } catch {
        return new Set();
    }
}

const favoritos = lerFavoritos();

function salvarFavoritos() {
    try {
        localStorage.setItem(
            "memoriaVivaFavoritos",
            JSON.stringify([...favoritos])
        );
    } catch {
        mostrarAviso("Não foi possível salvar os favoritos neste navegador.");
    }
}

function normalizar(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function mostrarAviso(mensagem) {
    if (!aviso) return;

    aviso.textContent = mensagem;
    aviso.classList.add("visivel");

    clearTimeout(avisoTemporizador);

    avisoTemporizador = setTimeout(() => {
        aviso.classList.remove("visivel");
    }, 2500);
}

function criarCartao(lugar, indice) {
    const favorito = favoritos.has(lugar.id);
    const nome = escaparHTML(lugar.nome);
    const categoria = escaparHTML(lugar.etiqueta);
    const local = escaparHTML(lugar.local);
    const descricao = escaparHTML(lugar.descricao);

    const imagem = lugar.imagem
        ? `
            <img src="${escaparHTML(lugar.imagem)}"
                 alt="${nome}" loading="lazy">
            <div class="imagem-placeholder" hidden>
                <span>📷</span>
                <strong>${nome}</strong>
                <small>Adicione uma fotografia na pasta bdc</small>
            </div>
        `
        : `
            <div class="imagem-placeholder">
                <span>📷</span>
                <strong>${nome}</strong>
                <small>Adicione uma fotografia na pasta bdc</small>
            </div>
        `;

    return `
        <article class="cartao" style="animation-delay:${indice * 45}ms">
            <div class="cartao-foto">
                ${imagem}

                <span class="selo">${categoria}</span>

                <button
                    class="favoritar ${favorito ? "ativo" : ""}"
                    data-favoritar="${escaparHTML(lugar.id)}"
                    aria-label="${favorito ? "Remover dos" : "Adicionar aos"} favoritos: ${nome}"
                    aria-pressed="${favorito}"
                    type="button"
                >${favorito ? "♥" : "♡"}</button>
            </div>

            <div class="cartao-conteudo">
                <span class="localizacao">📍 ${local}</span>
                <h3>${nome}</h3>
                <p>${descricao}</p>

                <button class="botao-detalhes"
                    data-detalhes="${escaparHTML(lugar.id)}"
                    type="button">
                    Descobrir lugar <span>→</span>
                </button>
            </div>
        </article>
    `;
}

function obterLugaresVisiveis() {
    return lugares.filter(lugar => {
        const texto = normalizar([
            lugar.nome,
            lugar.categoria,
            lugar.etiqueta,
            lugar.local,
            lugar.descricao
        ].join(" "));

        const combinaPesquisa = texto.includes(normalizar(termoPesquisa));

        const combinaCategoria =
            filtroAtual === "todos" ||
            (filtroAtual === "favoritos"
                ? favoritos.has(lugar.id)
                : normalizar(lugar.categoria) === normalizar(filtroAtual));

        return combinaPesquisa && combinaCategoria;
    });
}

function renderizarLugares() {
    if (!grade) return;

    const encontrados = obterLugaresVisiveis();

    grade.innerHTML = encontrados
        .map((lugar, indice) => criarCartao(lugar, indice))
        .join("");

    grade.querySelectorAll(".cartao-foto img").forEach(img => {
        img.addEventListener("error", () => {
            img.hidden = true;
            const placeholder = img.nextElementSibling;
            if (placeholder) placeholder.hidden = false;
        }, { once: true });
    });

    if (contador) {
        contador.textContent =
            `${encontrados.length} ${encontrados.length === 1 ? "lugar" : "lugares"}`;
    }

    if (semResultados) semResultados.hidden = encontrados.length !== 0;
    grade.hidden = encontrados.length === 0;
}

function selecionarFiltro(filtro) {
    filtroAtual = filtro;

    filtros.forEach(botao => {
        const ativo = normalizar(botao.dataset.filtro) === normalizar(filtro);
        botao.classList.toggle("ativo", ativo);
        botao.setAttribute("aria-pressed", String(ativo));
    });

    renderizarLugares();
}

filtros.forEach(botao => {
    botao.addEventListener("click", () => {
        selecionarFiltro(botao.dataset.filtro);
    });
});

if (pesquisa) {
    pesquisa.addEventListener("input", () => {
        termoPesquisa = pesquisa.value;
        renderizarLugares();
    });
}

document.getElementById("limparPesquisa")?.addEventListener("click", () => {
    if (pesquisa) pesquisa.value = "";
    termoPesquisa = "";
    renderizarLugares();
    pesquisa?.focus();
});

document.getElementById("limparFiltros")?.addEventListener("click", () => {
    if (pesquisa) pesquisa.value = "";
    termoPesquisa = "";
    selecionarFiltro("todos");
    pesquisa?.focus();
});

document.getElementById("mostrarTodos")?.addEventListener("click", () => {
    if (pesquisa) pesquisa.value = "";
    termoPesquisa = "";
    selecionarFiltro("todos");
    document.getElementById("destinos")?.scrollIntoView({
        behavior: "smooth"
    });
});

grade?.addEventListener("click", evento => {
    const botaoFavorito = evento.target.closest("[data-favoritar]");
    const botaoDetalhes = evento.target.closest("[data-detalhes]");

    if (botaoFavorito) {
        const id = botaoFavorito.dataset.favoritar;
        const lugar = lugares.find(item => item.id === id);

        if (!lugar) return;

        if (favoritos.has(id)) {
            favoritos.delete(id);
            mostrarAviso(`${lugar.nome} removido dos favoritos.`);
        } else {
            favoritos.add(id);
            mostrarAviso(`${lugar.nome} adicionado aos favoritos.`);
        }

        salvarFavoritos();
        renderizarLugares();
        return;
    }

    if (botaoDetalhes) {
        const lugar = lugares.find(
            item => item.id === botaoDetalhes.dataset.detalhes
        );

        if (!lugar || !modal || !modalTitulo || !modalTexto) return;

        modalTitulo.textContent = lugar.nome;
        modalTexto.textContent = lugar.detalhes;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        document.getElementById("fecharModal")?.focus();
    }
});

function fecharModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
}

document.getElementById("fecharModal")?.addEventListener("click", fecharModal);
document.getElementById("confirmarModal")?.addEventListener("click", fecharModal);

modal?.querySelectorAll("[data-fechar-modal]").forEach(elemento => {
    elemento.addEventListener("click", fecharModal);
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && modal && !modal.hidden) {
        fecharModal();
    }
});

const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

renderizarLugares();

