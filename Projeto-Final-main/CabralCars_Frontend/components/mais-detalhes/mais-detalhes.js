document.addEventListener('DOMContentLoaded', async function () {
    const carDetails = document.getElementById('carDetailSection');

    // Função para obter o ID da URL
    function getURLParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id'),
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
            // Obter o token do localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Você precisa estar logado para visualizar os detalhes do carro!');
                window.location.href = '../login-usuario/login-usuario.html'; // Redireciona para a página de login se o token não estiver presente
                return;
            }

            // Buscar o carro pelo ID com o token de autenticação
            const response = await fetch(`http://localhost:3000/carros/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}` // Adicionando o token diretamente no cabeçalho
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }

            const car = await response.json();

            if (!car || Object.keys(car).length === 0) {
                carDetails.innerHTML = '<p>Carro não encontrado.</p>';
                return;
            }

            // Preencher os dados do carro nos elementos HTML
            document.getElementById('carName').textContent = car.Nome || 'Não especificado';
            document.getElementById('carDescription').textContent = car.Descricao || 'Sem descrição disponível.';
            document.getElementById('carYear').textContent = car.Ano || 'Ano não especificado';
            document.getElementById('carPrice').textContent = car.Preco
                ? `R$ ${parseFloat(car.Preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                  })}`
                : 'Preço não especificado';
            document.getElementById('carColor').textContent = car.Cor || 'Cor não especificada';
            document.getElementById('carMileage').textContent = car.Quilometragem
                ? `${car.Quilometragem} km`
                : 'Quilometragem não especificada';

            // A imagem do carro (verificar se existe URL de imagem)
            const imagemUrl =
                car.ImagemUrl && car.ImagemUrl.startsWith('http')
                    ? car.ImagemUrl
                    : '../CabralCars_Frontend/assets/images/default.jpg';
            document.getElementById('carImage').src = imagemUrl;
        } catch (error) {
            console.error('Erro ao buscar os detalhes do carro:', error);
            carDetails.innerHTML = '<p>Erro ao carregar os detalhes do carro.</p>';
        }
    }

    // Chamar a função para carregar os detalhes do carro ao carregar a página
    fetchCarDetails();
});
