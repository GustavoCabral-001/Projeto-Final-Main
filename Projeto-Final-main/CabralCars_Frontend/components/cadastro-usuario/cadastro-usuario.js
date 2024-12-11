document.getElementById('formCadastro').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const endereco = document.getElementById('endereco').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome,
            cpf,
            endereco,
            telefone,
            email,
            senha
        })
    });

    const data = await response.json();

    if (data.success) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = '../login-usuario/login-usuario.html'; // Redireciona para a página de login
    } else {
        alert('Erro ao cadastrar: ' + data.message);
    }
});
