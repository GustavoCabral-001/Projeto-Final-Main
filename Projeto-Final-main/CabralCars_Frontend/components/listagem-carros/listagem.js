// Função para buscar e exibir os carros do servidor
async function fetchCars(filters = {}) {
    try {
        const response = await fetch('http://localhost:3000/carros');
        const cars = await response.json();

        // Filtrar os carros com base nos filtros aplicados
        const filteredCars = cars.filter(car => {
            let matches = true;

            if (filters.nome && !car.Nome.toLowerCase().includes(filters.nome.toLowerCase())) {
                matches = false;
            }

            if (filters.preco && car.Preco > filters.preco) {
                matches = false;
            }

            if (filters.cor && !car.Cor.toLowerCase().includes(filters.cor.toLowerCase())) {
                matches = false;
            }

            if (filters.ano && car.Ano !== filters.ano) {
                matches = false;
            }

            return matches;
        });

        const carList = document.getElementById('carList');
        carList.innerHTML = ''; // Limpar a lista antes de adicionar novos itens

        filteredCars.forEach(car => {

            console.log(car)
            const carItem = document.createElement('section');
            carItem.classList.add('wraper-carros');

            // Verificar se a URL da imagem está presente; caso contrário, usa a imagem padrão
            const imageUrl = car.ImagemUrl && car.ImagemUrl.startsWith("http") ? car.ImagemUrl : '../CabralCars_Frontend/assets/images/default.jpg';

            carItem.innerHTML = `
                <div style="background-image: url(${imageUrl});" class="img-car"></div>
                <div class="tipo-car">
                    <h3>${car.Nome}</h3>
                    <p><strong>Descrição:</strong> ${car.Descricao}</p>
                    <p><strong>Ano:</strong> ${car.Ano}</p>
                    <p><strong>Preço:</strong> R$ ${car.Preco}</p>
                    <p><strong>Cor:</strong> ${car.Cor}</p>
                    <p><strong>Quilometragem:</strong> ${car.Quilometragem} km</p>
                    <div class="detalhes"><a href="../../components/mais-detalhes/mais-detalhes.html?id=${car.ID}">Mais detalhes</a></div>
                </div>
            `;

            carList.appendChild(carItem);
        });
    } catch (error) {
        console.error('Erro ao buscar carros:', error);
    }
}

// Função para aplicar os filtros
function aplicarFiltros() {
    const nomeFiltro = document.getElementById('nomeCarroFiltro').value;
    const precoFiltro = document.getElementById('precoFiltro').value;
    const corFiltro = document.getElementById('corFiltro').value;
    const anoFiltro = document.getElementById('anoFiltro').value;

    const filters = {
        nome: nomeFiltro,
        preco: precoFiltro ? parseFloat(precoFiltro) : null,
        cor: corFiltro,
        ano: anoFiltro ? parseInt(anoFiltro) : null
    };

    // Buscar os carros aplicando os filtros
    fetchCars(filters);
}

// Carregar os carros quando a página estiver pronta
document.addEventListener('DOMContentLoaded', () => {
    fetchCars(); // Carregar todos os carros inicialmente

    // Adicionar um ouvinte de evento para aplicar os filtros
    const filtrosButton = document.querySelector('.filtros button');
    filtrosButton.addEventListener('click', aplicarFiltros);
});