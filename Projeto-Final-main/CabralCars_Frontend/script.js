// Função para adicionar carro
document.getElementById('carForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para adicionar um carro.');
        window.location.href = 'login.html';
        return;
    }

    const nome = document.getElementById('nome').value;
    const modeloID = document.getElementById('modeloID').value;
    const ano = document.getElementById('ano').value;
    const preco = document.getElementById('preco').value;
    const cor = document.getElementById('cor').value;
    const quilometragem = document.getElementById('quilometragem').value;

    const response = await fetch('http://localhost:3000/carros', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            Nome: nome,
            ModeloID: modeloID,
            Ano: ano,
            Preco: preco,
            Cor: cor,
            Quilometragem: quilometragem
        })
    });

    const data = await response.json();
    alert(data.message);
    loadCars();
});

// Função para carregar carros
async function loadCars() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para visualizar os carros.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('http://localhost:3000/carros', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const cars = await response.json();
    const carList = document.getElementById('carList');
    carList.innerHTML = '';

    cars.forEach(car => {
        const li = document.createElement('li');
        li.textContent = `ID: ${car.ID}, Nome: ${car.Nome}, Modelo ID: ${car.ModeloID}, Ano: ${car.Ano}, Preço: ${car.Preco}, Cor: ${car.Cor}, Quilometragem: ${car.Quilometragem}`;
        carList.appendChild(li);
    });
}

// Função para adicionar cliente
document.getElementById('clientForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para adicionar um cliente.');
        window.location.href = 'login.html';
        return;
    }

    const nome = document.getElementById('clientNome').value;
    const cpf = document.getElementById('clientCPF').value;
    const endereco = document.getElementById('clientEndereco').value;
    const telefone = document.getElementById('clientTelefone').value;
    const email = document.getElementById('clientEmail').value;

    const response = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            Nome: nome,
            CPF: cpf,
            Endereco: endereco,
            Telefone: telefone,
            Email: email
        })
    });

    const data = await response.json();
    alert(data.message);
    loadClients();
});

// Função para carregar clientes
async function loadClients() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para visualizar os clientes.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('http://localhost:3000/clientes', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const clients = await response.json();
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = '';

    clients.forEach(client => {
        const li = document.createElement('li');
        li.textContent = `ID: ${client.ID}, Nome: ${client.Nome}, CPF: ${client.CPF}`;
        clientList.appendChild(li);
    });
}

// Função para adicionar vendedor
document.getElementById('sellerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para adicionar um vendedor.');
        window.location.href = 'login.html';
        return;
    }

    const nome = document.getElementById('sellerNome').value;
    const cpf = document.getElementById('sellerCPF').value;
    const endereco = document.getElementById('sellerEndereco').value;
    const telefone = document.getElementById('sellerTelefone').value;
    const email = document.getElementById('sellerEmail').value;

    const response = await fetch('http://localhost:3000/vendedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            Nome: nome,
            CPF: cpf,
            Endereco: endereco,
            Telefone: telefone,
            Email: email
        })
    });

    const data = await response.json();
    alert(data.message);
    loadSellers();
});

// Função para carregar vendedores
async function loadSellers() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para visualizar os vendedores.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('http://localhost:3000/vendedores', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const sellers = await response.json();
    const sellerList = document.getElementById('sellerList');
    sellerList.innerHTML = '';

    sellers.forEach(seller => {
        const li = document.createElement('li');
        li.textContent = `ID: ${seller.ID}, Nome: ${seller.Nome}, CPF: ${seller.CPF}`;
        sellerList.appendChild(li);
    });
}

// Função para registrar venda
document.getElementById('saleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para registrar uma venda.');
        window.location.href = 'login.html';
        return;
    }

    const carroID = document.getElementById('saleCarroID').value;
    const clienteID = document.getElementById('saleClienteID').value;
    const vendedorID = document.getElementById('saleVendedorID').value;
    const dataVenda = document.getElementById('saleData').value;
    const precoVenda = document.getElementById('salePreco').value;
    const tipoPagamento = document.getElementById('saleTipoPagamento').value;
    const numParcelas = document.getElementById('saleNumParcelas').value;

    const response = await fetch('http://localhost:3000/vendas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            CarroID: carroID,
            ClienteID: clienteID,
            VendedorID: vendedorID,
            DataVenda: dataVenda,
            PrecoVenda: precoVenda,
            TipoPagamento: tipoPagamento,
            NumParcelas: numParcelas
        })
    });

    const data = await response.json();
    alert(data.message);
    loadSales();
});

// Função para carregar vendas
async function loadSales() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para visualizar as vendas.');
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch('http://localhost:3000/vendas', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const sales = await response.json();
    const saleList = document.getElementById('saleList');
    saleList.innerHTML = '';

    sales.forEach(sale => {
        const li = document.createElement('li');
        li.textContent = `ID: ${sale.ID}, Carro ID: ${sale.CarroID}, Cliente ID: ${sale.ClienteID}, Vendedor ID: ${sale.VendedorID}, Data: ${sale.DataVenda}, Preço: ${sale.PrecoVenda}, Tipo: ${sale.TipoPagamento}`;
        saleList.appendChild(li);
    });
}

// Carregar dados ao iniciar
loadCars();
loadClients();
loadSellers();
loadSales();
