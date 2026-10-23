
const WHATSAPP = "5500000000000"; // Troque pelo seu número com DDI e DDD.

const produtos = [
  {
    id: 1,
    nome: "Bombom de Brigadeiro",
    categoria: "bombons",
    descricao: "Casquinha de chocolate com recheio cremoso de brigadeiro.",
    preco: 4.50,
    imagem: "https://images.unsplash.com/photo-1548907040-4d42faa2b5e2?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    nome: "Bombom de Morango",
    categoria: "bombons",
    descricao: "Chocolate delicado com recheio de morango.",
    preco: 5.00,
    imagem: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    nome: "Bombom de Coco",
    categoria: "bombons",
    descricao: "Uma combinação deliciosa de chocolate e coco.",
    preco: 4.50,
    imagem: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    nome: "Bolo no Pote de Chocolate",
    categoria: "bolos",
    descricao: "Camadas de bolo fofinho com brigadeiro cremoso.",
    preco: 12.00,
    imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    nome: "Bolo no Pote de Morango",
    categoria: "bolos",
    descricao: "Bolo macio, creme suave e sabor de morango.",
    preco: 13.00,
    imagem: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    nome: "Bolo no Pote de Ninho",
    categoria: "bolos",
    descricao: "Bolo com creme de leite em pó, doce e irresistível.",
    preco: 13.00,
    imagem: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=700&q=80"
  }
];

const carrinho = {};

const listaProdutos = document.getElementById("lista-produtos");
const contador = document.getElementById("contador");
const aviso = document.getElementById("aviso");

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function renderizarProdutos(categoria = "todos") {
  const filtrados = produtos.filter(produto =>
    categoria === "todos" || produto.categoria === categoria
  );

  listaProdutos.innerHTML = filtrados.map(produto => `
    <article class="produto">
      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/700x450/fbe8ed/56352f?text=Doce+delicioso'"
      >

      <div class="produto-conteudo">
        <span class="categoria">
          ${produto.categoria === "bombons" ? "Bombons artesanais" : "Bolos no pote"}
        </span>

        <h3>${produto.nome}</h3>
        <p class="descricao">${produto.descricao}</p>

        <div class="produto-rodape">
          <span class="preco">${formatarPreco(produto.preco)}</span>
          <button class="adicionar" data-id="${produto.id}">
            + Adicionar
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function mostrarAviso(mensagem) {
  aviso.textContent = mensagem;
  aviso.classList.add("visivel");

  clearTimeout(mostrarAviso.timer);
  mostrarAviso.timer = setTimeout(() => {
    aviso.classList.remove("visivel");
  }, 2500);
}

function atualizarCarrinho() {
  const quantidade = Object.values(carrinho)
    .reduce((total, item) => total + item.quantidade, 0);

  contador.textContent = quantidade;
}

listaProdutos.addEventListener("click", evento => {
  const botao = evento.target.closest(".adicionar");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const produto = produtos.find(item => item.id === id);

  if (!produto) return;

  if (!carrinho[id]) {
    carrinho[id] = { ...produto, quantidade: 0 };
  }

  carrinho[id].quantidade++;
  atualizarCarrinho();

  mostrarAviso(`${produto.nome} adicionado ao carrinho! ♡`);
});

document.querySelectorAll(".filtro").forEach(botao => {
  botao.addEventListener("click", () => {
    document.querySelectorAll(".filtro").forEach(item => {
      item.classList.remove("ativo");
    });

    botao.classList.add("ativo");
    renderizarProdutos(botao.dataset.categoria);
  });
});

function prepararPedido() {
  const itens = Object.values(carrinho);

  if (itens.length === 0) {
    mostrarAviso("Escolha pelo menos um doce antes de pedir! ♡");
    return;
  }

  const linhas = itens.map(item =>
    `${item.quantidade}x ${item.nome} - ${formatarPreco(item.preco * item.quantidade)}`
  );

  const total = itens.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  const mensagem = [
    "Olá! Vim pelo site Pedaços de Doçura 🍫",
    "",
    "Gostaria de fazer este pedido:",
    ...linhas,
    "",
    `Total dos produtos: ${formatarPreco(total)}`,
    "",
    "Por favor, me informe a disponibilidade, a entrega e as formas de pagamento."
  ].join("\n");

  if (WHATSAPP === "86995320958") {
    mostrarAviso("Configure seu número do WhatsApp no arquivo script.js.");
    return;
  }

  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("abrir-carrinho")
  .addEventListener("click", prepararPedido);

document.getElementById("pedido-geral")
  .addEventListener("click", evento => {
    if (Object.keys(carrinho).length > 0) {
      evento.preventDefault();
      prepararPedido();
    } else if (WHATSAPP === "86995320958") {
      evento.preventDefault();
      mostrarAviso("Configure seu número do WhatsApp no arquivo script.js.");
    } else {
      evento.currentTarget.href =
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          "Olá! Quero conhecer o cardápio da Pedaços de Doçura! 🍫"
        )}`;
    }
  });

document.getElementById("ano").textContent = new Date().getFullYear();

renderizarProdutos();
atualizarCarrinho();
