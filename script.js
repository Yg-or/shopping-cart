// função que cria o elemento da imagem do produto
function createProductImageElement(imageSource) {
    const img = document.createElement('img');
    img.className = 'item__image';
    img.src = imageSource;
    return img;
  }
  // função que calcula o valor final do carrinho
  function addValues() {
    let total = 0;
    total = 0;
    const lista = document.getElementsByClassName('cart__item');
    const value = document.getElementsByClassName('total-price')[0];
    if (lista.length === 0) {
      value.innerText = 'Carrinho Vazio';
    }
  
    for (let index = 0; index < lista.length; index += 1) {
      const valor = Number(lista[index].innerText.split('$')[1]);
      total += valor;
      value.innerText = `Valor total R$${total.toFixed(2)}`;
    }
  }
  // função para buscar as informações do produto
  async function getProductInformation(id) {
    return fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((objeto) => objeto);
  }
  // função para remover o produto do carrinho
  function cartItemClickListener(item) {
    const pai = document.getElementsByClassName('cart__items')[0];
    pai.removeChild(item);
  }
  // função para salvar o carrinho no localstorage
  function localSave() {
    const lista = document.getElementsByClassName('cart__item');
    if (lista.length > 0) {
      const produtosFinal = [];
      for (let index = 0; index < lista.length; index += 1) {
        produtosFinal.push(lista[index].id);
      }
      localStorage.setItem('produtos', JSON.stringify(produtosFinal));
    } else {
      localStorage.removeItem('produtos');
    }
  }
  // função que cria o elemento que será adicionado no carrinho
  function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.id = sku;
    li.innerHTML = `Produto: ${name} <br> Preço: R$${salePrice}`;
    li.addEventListener('click', () => { cartItemClickListener(li); localSave(); addValues(); });
    return li;
  }
  
  // função para carregar os itens do localStorage
  async function loadByLocalstorage(lista, index) {
    if (index >= lista.length) return null;
  
    const pai = document.getElementsByClassName('cart__items')[0];
    await getProductInformation(lista[index])
    .then((information) => {
      const filho = createCartItemElement(information);
      pai.appendChild(filho);
      loadByLocalstorage(lista, index + 1);
      addValues();
    });
  }
  // função para verificar se tem produtos salvos no localStorage
  async function localStorageVerify() {
    const produtos = await JSON.parse(localStorage.getItem('produtos'));
    setTimeout(() => {
      if (produtos) {
        loadByLocalstorage(produtos, 0);
      }
    }, 1000);
  }
  // função que adiciona o produto no carrinho
  async function addToCart(id) {
    const pai = document.getElementsByClassName('cart__items')[0];
    await getProductInformation(id)
      .then((information) => {
        const filho = createCartItemElement(information);
        pai.appendChild(filho);
      });
      localSave();
      addValues();
  }
  // função para criar qualquer elemento html
  function createCustomElement(element, className, innerText, id) {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    if (id) {
      e.addEventListener('click', () => { addToCart(id); });
    }
  
    return e;
  }
  // função que adiciona os produtos na lista geral ed produtos
  function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
    const section = document.createElement('section');
    section.className = 'item';
  
    section.appendChild(createCustomElement('span', 'item__sku', sku));
    section.appendChild(createCustomElement('span', 'item__title', name));
    section.appendChild(createProductImageElement(image));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  
    return section;
  }
  // função que busca a lista de produtos
  async function getProducts(pesquisa) {
    return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${pesquisa}`)
      .then((response) => response.json())
      .then((objeto) => objeto.results);
  }
  // função para criar os produtos
  async function createProducts(pesquisa = 'computador') {
    const pai = document.getElementsByClassName('items')[0];
    pai.innerHTML = '';
    const son = document.createElement('p');
    son.className = 'loading';
    pai.appendChild(son);
    await getProducts(pesquisa)
      .then((produtos) => {
        for (let index = 0; index < produtos.length; index += 1) {
          const filho = createProductItemElement(produtos[index]);
          pai.appendChild(filho);
        }
      });
    pai.removeChild(son);
  }
  // função para criar o elemento html que exibe o valor final
  function createTotal() {
    const pai = document.getElementsByClassName('cart')[0];
    const filho = document.createElement('p');
    filho.className = 'total-price';
    filho.innerText = 'Carrinho Vazio';
    pai.appendChild(filho);
  }
  
  // função que limpa o carrinho e apaga os dados do localStorage
  function clearAll() {
    const lista = document.getElementsByClassName('cart__items')[0];
    lista.innerHTML = '';
    addValues();
    localSave();
  }
  // função para adicionar o listener no botao de limpar o carrinho
  function addClearListener() {
    const botao = document.getElementsByClassName('empty-cart')[0];
    botao.addEventListener('click', clearAll);
  }
  
  // função para capturar o produto desejado digitado na barra de pesquisa
  function alteraProdutos() {
    const input = document.getElementById('searchBar');
    if (input !== '') {
      createProducts(input.value);
    }
    input.value = '';
  }
  
  // função para adicionar o listener no botao de pesquisa
  function adicionaListener() {
    const botao = document.getElementById('searchButton');
    botao.addEventListener('click', alteraProdutos);
  }
  
  window.onload = () => {
    createProducts();
    localStorageVerify();
    createTotal();
    addClearListener();
    adicionaListener();
  };
  