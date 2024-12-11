document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar 3 carros
    async function carregarCarros() {
        try {
            // Fazendo a requisição para a API sem o token
            const response = await fetch('http://localhost:3000/carros', {
                method: 'GET',
            });

            const carros = await response.json(); // Converte a resposta em JSON

            // Selecionando a área onde os carros serão exibidos
            const carrosContainer = document.querySelector('.wraper-carros');
            carrosContainer.innerHTML = ''; // Limpar qualquer conteúdo anterior

            // Limitar os carros a apenas 3
            const carrosLimitados = carros.slice(0, 3);

            // Adicionando os carros ao HTML
            carrosLimitados.forEach(carro => {
                const carroDiv = document.createElement('section');
                carroDiv.classList.add('wraper-carros');
                carroDiv.innerHTML = `
                    <div style="background-image: url(${carro.ImagemUrl});" class="img-car"></div>
                    <div class="tipo-car">
                        <h3>${carro.Nome}</h3>
                        <p>${carro.Descricao}</p>
                        <p>Ano: ${carro.Ano}</p>
                    </div>
                    <div class="detalhes">
                        <a href="vendacarro.html?id=${carro.ID}">Mais detalhes</a>
                    </div>
                `;
                carrosContainer.appendChild(carroDiv);
            });
        } catch (error) {
            console.error('Erro ao carregar os carros:', error);
        }
    }

    // Carregar os 3 carros quando a página for carregada
    window.onload = carregarCarros;
});
