document.addEventListener('DOMContentLoaded', async function() {
    const carDetails = document.getElementById('carDetailSection');
    
    // Função para obter o ID da URL
    function getURLParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id')
        };
    }

    // Função para buscar os detalhes do carro
    async function fetchCarDetails() {
        const { id } = getURLParams();

        if (!id) {
            carDetails.innerHTML = '<p>Carro não encontrado.</p>';
            return;
        }

        try {
            // Buscar o carro pelo ID
            const response = await fetch(`http://localhost:3000/carros/${id}`);
            const car = await response.json();

            if (!car) {
                carDetails.innerHTML = '<p>Carro não encontrado.</p>';
                return;
            }

            // Preencher os dados do carro nos elementos HTML
            document.getElementById('carName').textContent = car.Nome;
            document.getElementById('carDescription').textContent = car.Descricao;
            document.getElementById('carYear').textContent = car.Ano;
            document.getElementById('carPrice').textContent = `R$ ${parseFloat(car.Preco).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}`;
            document.getElementById('carColor').textContent = car.Cor;
            document.getElementById('carMileage').textContent = `${car.Quilometragem} km`;

            // A imagem do carro (verificar se existe URL de imagem)
            const imagemUrl = car.ImagemUrl && car.ImagemUrl.startsWith("http") ? car.ImagemUrl : '../CabralCars_Frontend/assets/images/default.jpg';
            document.getElementById('carImage').src = imagemUrl;
        } catch (error) {
            console.error('Erro ao buscar os detalhes do carro:', error);
            carDetails.innerHTML = '<p>Erro ao carregar os detalhes do carro.</p>';
        }
    }

    // Chamar a função para carregar os detalhes do carro ao carregar a página
    fetchCarDetails();
});
