document.getElementById('carForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeCarro').value;
    const modeloID = document.getElementById('modeloID').value;
    const descricao = document.getElementById('descricao').value;
    const ano = document.getElementById('ano').value;
    const preco = document.getElementById('preco').value;
    const cor = document.getElementById('cor').value;
    const quilometragem = document.getElementById('quilometragem').value;
    const ImagemUrl = document.getElementById('ImagemUrl').value;

    // Validação dos campos
    if (!nome || !modeloID || !descricao || !ano || !preco || !cor || !quilometragem || !ImagemUrl) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        // Obter o token do localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Você precisa estar logado para adicionar um carro!');
            window.location.href = '../login-usuario/login-usuario.html'; // Redireciona para a página de login se o token não estiver presente
            return;
        }

        // Enviando dados para o servidor via POST (ajustar URL conforme necessário)
        const response = await fetch('http://localhost:3000/carros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` // Adicionando o token no cabeçalho da requisição
            },
            body: JSON.stringify({
                Nome: nome,
                ModeloID: modeloID,
                Descricao: descricao,
                Ano: ano,
                Preco: preco,
                Cor: cor,
                Quilometragem: quilometragem,
                ImagemUrl: ImagemUrl
            })
        });

        // A resposta do servidor
        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Mensagem de sucesso

            // Adicionar carro à lista (exemplo de exibição na tela)
            const carListItem = document.createElement("li");
            carListItem.textContent = `Carro: ${nome}, Modelo: ${modeloID}, Ano: ${ano}, Descrição: ${descricao}, Preço: ${preco}, Cor: ${cor}, Quilometragem: ${quilometragem} km, Imagem URL: ${ImagemUrl}`;
            document.getElementById("carList").appendChild(carListItem);

            // Limpar o formulário após o envio
            document.getElementById("carForm").reset();
            document.getElementById("imagePreview").style.display = 'none'; // Ocultar a pré-visualização

        } else {
            alert("Erro ao cadastrar o carro: " + data.message);
        }
    } catch (error) {
        console.error('Erro ao adicionar o carro:', error);
        alert("Ocorreu um erro ao adicionar o carro.");
    }
});

// Função para cancelar (limpar o formulário)
document.getElementById('cancelar').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('carForm').reset(); // Limpa o formulário
    document.getElementById("imagePreview").style.display = 'none'; // Oculta a pré-visualização da imagem
});

// Função para pré-visualizar a imagem
document.getElementById('ImagemUrl').addEventListener('input', (e) => {
    const imageUrl = e.target.value;
    const imagePreview = document.getElementById('imagePreview');

    if (imageUrl) {
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block'; // Exibe a imagem
    } else {
        imagePreview.style.display = 'none'; // Oculta a imagem se o campo estiver vazio
    }
});
