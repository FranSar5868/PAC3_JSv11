function fetchCards() {
    const maxNumofPokemons = 1010;
    const numCards = 10;
    const cards = [];
    for (let i = 0; i < numCards; i++) {
      const pokemonId = Math.floor(Math.random() * maxNumofPokemons) + 1;
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
      cards.push(fetch(url).then((response) => response.json()));
    }
    return Promise.all(cards).then((results) => {
      localStorage.setItem("pokemonCards", JSON.stringify(results));
      return results;
    });
  }
  
  function drawCards(cards) {
    const out = document.querySelector("#cards");
    const temp = document.getElementById("template");
  
  
      cards.forEach((fact) => {
      const clonedTemplate = temp.content.cloneNode(true);
      let card = clonedTemplate.querySelector(".card");
      let name = clonedTemplate.querySelector(".name");
      let img = clonedTemplate.querySelector("img");
      let detalls = clonedTemplate.querySelector(".detalls");
      card.setAttribute("id", fact.id);
      name.textContent = fact.name;
      img.setAttribute("src", fact.sprites.front_default);
      detalls.setAttribute("href", `?PokeId=${fact.id}`);
      out.appendChild(clonedTemplate);
    });
  }
  
  function showCardDetails(pokemonCard) {
    const template = document.querySelector('#card-details-template');
    const clone = template.content.cloneNode(true);
  
    const title = clone.querySelector('.card-detail-title');
    title.textContent = pokemonCard.name;
  
    const image = clone.querySelector('.card-detail-image');
    image.src = pokemonCard.sprites.front_default;
    image.alt = pokemonCard.name;
  
    const imageBack = clone.querySelector('.card-detail-image-back');
    imageBack.src = pokemonCard.sprites.back_default;
    imageBack.alt = pokemonCard.name;
  
    const attackStat = clone.querySelector('.card-detail-stats .card-detail-stat:nth-child(1) .card-detail-stat-value');
    attackStat.textContent = pokemonCard.stats[1].base_stat;
  
    const defenseStat = clone.querySelector('.card-detail-stats .card-detail-stat:nth-child(2) .card-detail-stat-value');
    defenseStat.textContent = pokemonCard.stats[2].base_stat;
  
    const typeContainer = clone.querySelector('.card-detail-types');
    pokemonCard.types.forEach(type => {
      const typeElem = document.createElement('div');
      typeElem.classList.add('card-detail-type');
      typeElem.textContent = type.type.name;
      typeContainer.appendChild(typeElem);
    });
  
    const container = document.querySelector('#card-details-container');
    container.innerHTML = '';
    container.appendChild(clone);
  }
  
  function fetchAndReload() {
    // Clear the existing cards and local storage
    document.querySelector('#cards').innerHTML = '';
    localStorage.clear();
  
    // Fetch new cards and reload the page
    fetchCards().then(() => location.reload());
  }
    
  
    const cont = document.querySelector('#content');
    const back = document.querySelector('#back');
    const links = document.querySelectorAll('.link');
    const searchInput = document.getElementById("search");
    
  
   
  
  
    // ocultar l'enllaç per tornar enrera quan estem a la pàgina o ruta inicial (sense paràmetres a la url)
    back.style.display = "none";
  
  
    // consultar si hi ha algun paràmetre a la URL
    let params = new URLSearchParams(document.location.search);
    let PokeId = params.get("PokeId");
    if (PokeId) {
  
      
      // modificar el text del missatge
      cont.innerHTML = `El paràmetre de la url és <strong>${PokeId}</strong>`;
      // mostrar l'enllaç per tornar enrera
      back.style.display = "block";
      // mostrar els links només quan estem a la pàgina o ruta inicial (sense paràmetres a la url)
      links.forEach( link => link.style.display = "none" );
      // ocultar l'enllaç per buscar més pokemons
      buscar.style.display = "none";
      // ocultar l'enllaç per filtrar els pokemons
      search.style.display = "none";
      
      const pokemonCards = JSON.parse(localStorage.getItem("pokemonCards"));
      // find pokemon card with matching id
      const pokemonCard = pokemonCards.find(card => card.id === parseInt(PokeId));
      showCardDetails(pokemonCard);
      console.dir(pokemonCard);
  
    } else {
      
      
      // modificar el text del missatge
      cont.innerHTML = `No hi ha cap paràmetre a la URL`;
      // ocultar l'enllaç per tornar enrera
      back.style.display = "none";
      // mostrar els links només quan estem a la pàgina o ruta inicial (sense paràmetres a la url)
      links.forEach( link => link.style.display = "block" );
  
      const pokemonCards = JSON.parse(localStorage.getItem("pokemonCards"));
  
  
    
      
      
      
      drawCards(pokemonCards);
  
      const filterCards = (query) => {
        const filteredCards = pokemonCards.filter (card => card.name.toLowerCase().includes(query.toLowerCase()));
        document.querySelector('#cards').innerHTML = '';
        drawCards(filteredCards);
      }
    // const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value;
      filterCards(query);
    })
  
  
  
    }
  
    