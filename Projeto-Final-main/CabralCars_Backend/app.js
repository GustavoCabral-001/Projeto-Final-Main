const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware para permitir requisições com JSON
app.use(express.json());
app.use(bodyParser.json());

app.use(cors()); // Habilitar CORS para todas as rotas

// Servir arquivos estáticos da pasta 'public/images'
app.use('/images', express.static('public/images'));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'root',
  database: 'vendaCarros'
});

// Conecta ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados.');
  }
});

// Função para gerar o token JWT
function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.ID, nome: usuario.Nome, email: usuario.Email },
    'secreta',
    { expiresIn: '1h' }
  );
}

// Middleware para verificar o token JWT (sem prefixo "Bearer")
function verificarToken(req, res, next) {
  const token = req.headers['authorization']; // Apenas o token direto

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, 'secreta', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    }
    req.usuario = decoded; // Adiciona o usuário decodificado ao request
    next();
  });
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']; // Apenas o token direto

  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secreta', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rotas de exemplo usando o token sem "Bearer"
// Rota para listar carros


// Rota de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
  }

  const sql = 'SELECT * FROM Clientes WHERE Email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Erro no banco de dados:', err);
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    if (results.length > 0) {
      const validPassword = await bcrypt.compare(senha, results[0].Senha);
      if (validPassword) {
        const token = jwt.sign({ id: results[0].ID, email: results[0].Email }, 'secreta', {
          expiresIn: '2h',
        });

        return res.status(200).json({
          success: true,
          message: 'Login realizado com sucesso.',
          token: token, // Retorna o token para o frontend
        });
      } else {
        return res.status(401).json({ success: false, message: 'Senha incorreta.' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado.' });
    }
  });
});
app.get('/clientes', (req, res) => {
  db.query('SELECT * FROM Clientes', (err, results) => {
      if (err) {
          console.error('Erro ao buscar clientes:', err);
          res.status(500).json({ message: 'Erro ao buscar clientes' });
      } else {
          res.status(200).json(results);
      }
  });
});


// 2. Rota de cadastro
app.post("/clientes", (req, res) => {
  const { nome, cpf, endereco, telefone, email, senha } = req.body;

  // Verificar se os campos foram preenchidos
  if (!nome || !cpf || !endereco || !telefone || !email || !senha) {
      return res.status(400).json({ success: false, message: "Preencha todos os campos!" });
  }

  // Criptografar a senha
  bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) {
          console.error("Erro ao criptografar a senha:", err);
          return res.status(500).json({ success: false, message: "Erro no servidor." });
      }

      const sql = "INSERT INTO Clientes (Nome, CPF, Endereco, Telefone, Email, senha) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(sql, [nome, cpf, endereco, telefone, email, hashedPassword], (err) => {
          if (err) {
              console.error("Erro ao inserir dados:", err);
              if (err.code === "ER_DUP_ENTRY") {
                  return res.status(400).json({ success: false, message: "CPF ou E-mail já cadastrado!" });
              }
              return res.status(500).json({ success: false, message: "Erro no servidor." });
          }

          res.status(200).json({ success: true, message: "Usuário cadastrado com sucesso!" });
      });
  });
});



// 3. Rota protegida - Apenas usuários autenticados podem acessar
app.get('/clientes', (req, res) => {
  db.query('SELECT * FROM Clientes', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao listar clientes" });
    }
    res.json(results);
  });
});

// Endpoint de logout
app.post("/logout", (req, res) => {
  // Para o logout, você só precisa excluir o token do lado do cliente.
  // O JWT não tem uma "sessão" no servidor para invalidar. Ou seja, a única forma de logout é o cliente apagar o token localmente.
  res.status(200).json({ success: true, message: "Logout realizado com sucesso!" });
});




// GET - Listar todos os clientes

app.get('/clientes', (req, res) => {
  db.query('SELECT * FROM Clientes', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST - Adicionar um novo cliente
app.post('/clientes', (req, res) => {
  const { Nome, CPF, Endereco, Telefone, Email } = req.body;
  const sql = 'INSERT INTO Clientes (Nome, CPF, Endereco, Telefone, Email) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [Nome, CPF, Endereco, Telefone, Email], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Cliente adicionado', id: result.insertId });
  });
});

// PUT - Atualizar um cliente existente
app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { Nome, CPF, Endereco, Telefone, Email } = req.body;
  const sql = 'UPDATE Clientes SET Nome = ?, CPF = ?, Endereco = ?, Telefone = ?, Email = ? WHERE ID = ?';
  db.query(sql, [Nome, CPF, Endereco, Telefone, Email, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Cliente atualizado' });
  });
});

// DELETE - Remover um cliente
app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Clientes WHERE ID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Cliente removido' });
  });
});

// 2. Rotas de Carros

// GET - Listar todos os carros com URLs completas das imagens
app.get('/carros', (req, res) => {
  db.query('SELECT * FROM Carros', (err, results) => {
    if (err) throw err;
    
    res.json(results);
  });
});

// POST - Adicionar um novo carro
app.post('/carros', (req, res) => {
  const { Nome, ModeloID, Descricao, Ano, Preco, Cor, Quilometragem, ImagemUrl } = req.body;

  // Verifica se já existe um carro com o mesmo nome
  const sqlCheckCarro = 'SELECT * FROM Carros WHERE Nome = ?';
  db.query(sqlCheckCarro, [Nome], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      return res.status(400).json({ message: 'Erro: Já existe um carro com esse nome.' });
    }

    // Insere o novo carro no banco de dados
    const sqlInsertCarro = 'INSERT INTO Carros (Nome, ModeloID,Descricao, Ano, Preco, Cor, Quilometragem, ImagemUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sqlInsertCarro, [Nome, ModeloID, Descricao, Ano, Preco, Cor, Quilometragem, ImagemUrl], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Carro adicionado', id: result.insertId });
    });
  });
});

// PUT - Atualizar um carro existente
app.put('/carros/:id', (req, res) => {
  const { id } = req.params;
  const { ModeloID, Descricao, Ano, Preco, Cor, Quilometragem, ImagemUrl } = req.body;
  const sql = 'UPDATE Carros SET ModeloID = ?, Descricao = ?, Ano = ?, Preco = ?, Cor = ?, Quilometragem = ?, ImagemUrl = ? WHERE ID = ?';
  db.query(sql, [ModeloID, Descricao, Ano, Preco, Cor, Quilometragem, ImagemUrl, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Carro atualizado' });
  });
});

// DELETE - Remover um carro
app.delete('/carros/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Carros WHERE ID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Carro removido' });
  });
});

// 3. Rotas de Vendedores

// GET - Listar todos os vendedores
app.get('/vendedores', (req, res) => {
  db.query('SELECT * FROM Vendedores', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST - Adicionar um novo vendedor
app.post('/vendedores', (req, res) => {
  const { Nome, CPF, Endereco, Telefone, Email } = req.body;
  const sql = 'INSERT INTO Vendedores (Nome, CPF, Endereco, Telefone, Email) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [Nome, CPF, Endereco, Telefone, Email], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Vendedor adicionado', id: result.insertId });
  });
});

// PUT - Atualizar um vendedor existente
app.put('/vendedores/:id', (req, res) => {
  const { id } = req.params;
  const { Nome, CPF, Endereco, Telefone, Email } = req.body;
  const sql = 'UPDATE Vendedores SET Nome = ?, CPF = ?, Endereco = ?, Telefone = ?, Email = ? WHERE ID = ?';
  db.query(sql, [Nome, CPF, Endereco, Telefone, Email, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Vendedor atualizado' });
  });
});

// DELETE - Remover um vendedor
app.delete('/vendedores/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Vendedores WHERE ID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Vendedor removido' });
  });
});

// 4. Rotas de Vendas

// GET - Listar todas as vendas
app.get('/vendas',(req, res) => {
  db.query('SELECT * FROM Vendas', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST - Registrar uma nova venda
app.post('/vendas', (req, res) => {
  const { CarroID, ClienteID, VendedorID, DataVenda, PrecoVenda, TipoPagamento, NumParcelas } = req.body;
  const sql = 'INSERT INTO Vendas (CarroID, ClienteID, VendedorID, DataVenda, PrecoVenda, TipoPagamento, NumParcelas) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [CarroID, ClienteID, VendedorID, DataVenda, PrecoVenda, TipoPagamento, NumParcelas], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Venda registrada', id: result.insertId });
  });
});
// PUT - Atualizar uma venda existente
app.put('/vendas/:id', (req, res) => {
  const { id } = req.params;
  const { CarroID, ClienteID, VendedorID, DataVenda, PrecoVenda, TipoPagamento, NumParcelas } = req.body;
  const sql = 'UPDATE Vendas SET CarroID = ?, ClienteID = ?, VendedorID = ?, DataVenda = ?, PrecoVenda = ?, TipoPagamento = ?, NumParcelas = ? WHERE ID = ?';
  db.query(sql, [CarroID, ClienteID, VendedorID, DataVenda, PrecoVenda, TipoPagamento, NumParcelas, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Venda atualizada' });
  });
});

// DELETE - Remover uma venda
app.delete('/vendas/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Vendas WHERE ID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json
({ message: 'Venda removida' });
  });
});

// GET - Buscar detalhes de um carro pelo ID
app.get('/carros/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Carros WHERE ID = ?';

  db.query(sql, [id], (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
          return res.status(404).json({ message: 'Carro não encontrado' });
      }

      res.json(result[0]); // Retornar o primeiro (e único) resultado
  });
});

// Configurar o servidor para escutar na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
