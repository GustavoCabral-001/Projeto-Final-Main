// Adicionando o listener no formulário
document.getElementById('formLogin').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Login bem-sucedido!');
            // Armazenando o token JWT no localStorage
            localStorage.setItem('token', data.token);
            window.location.href = '../../index.html'; // Redireciona para a página inicial
        } else {
            alert('Erro no login: ' + data.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao realizar o login. Tente novamente mais tarde.');
    }
});
