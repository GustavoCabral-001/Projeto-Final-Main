CREATE DATABASE vendaCarros;
USE vendaCarros;

-- Criação da tabela Marcas para normalização
CREATE TABLE Marcas (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) UNIQUE
);

-- Criação da tabela Modelos para normalização
CREATE TABLE Modelos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    MarcaID INT,
    Nome VARCHAR(255),
    FOREIGN KEY (MarcaID) REFERENCES Marcas(ID)
);

-- Criação da tabela Carros, agora com uma coluna Nome
CREATE TABLE Carros (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) UNIQUE NOT NULL,
    ModeloID INT,
    Ano INT,
    Preco DECIMAL(10, 2),
    Cor VARCHAR(50),
    Quilometragem INT,
    ImagemUrl VARCHAR(100),
    Status VARCHAR(20) DEFAULT 'disponível',
    FOREIGN KEY (ModeloID) REFERENCES Modelos(ID)

);

-- Criação da tabela Clientes
CREATE TABLE Clientes (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255),
    CPF VARCHAR(14) UNIQUE NOT NULL,
    Endereco VARCHAR(255),
    Telefone VARCHAR(20),
    Email VARCHAR(255) UNIQUE
);

-- Criação da tabela Vendedores
CREATE TABLE Vendedores (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255),
    CPF VARCHAR(14) UNIQUE NOT NULL,
    Endereco VARCHAR(255),
    Telefone VARCHAR(20),
    Email VARCHAR(255) UNIQUE
);

-- Criação da tabela Vendas
CREATE TABLE Vendas (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CarroID INT,
    ClienteID INT,
    VendedorID INT,
    DataVenda DATE,
    PrecoVenda DECIMAL(10, 2),
    TipoPagamento ENUM('à vista', 'parcelado'),
    NumParcelas INT DEFAULT 1,
    FOREIGN KEY (CarroID) REFERENCES Carros(ID),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ID),
    FOREIGN KEY (VendedorID) REFERENCES Vendedores(ID)
);

-- Criação da tabela Pagamentos
CREATE TABLE Pagamentos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    VendaID INT,
    DataPagamento DATE,
    ValorPago DECIMAL(10, 2),
    FOREIGN KEY (VendaID) REFERENCES Vendas(ID)
);

-- Inserção de dados nas tabelas Marcas e Modelos
INSERT INTO Marcas (Nome) VALUES ('Fiat'), ('Chevrolet'), ('Volkswagen'), ('Ford'), ('Toyota'), ('Honda');
INSERT INTO Modelos (MarcaID, Nome) VALUES 
(1, 'Uno'), 
(2, 'Onix'), 
(3, 'Gol'), 
(4, 'Fiesta'), 
(5, 'Corolla'), 
(6, 'Civic');

-- Inserção de dados na tabela Carros com a coluna Nome preenchida
INSERT INTO Carros (Nome, ModeloID, Ano, Preco, Cor, Quilometragem) VALUES 
('Fiat Uno 2020', 1, 2020, 35000.00, 'Vermelho', 50000),
('Chevrolet Onix 2021', 2, 2021, 45000.00, 'Preto', 30000),
('Volkswagen Gol 2019', 3, 2019, 28000.00, 'Branco', 40000),
('Ford Fiesta 2018', 4, 2018, 32000.00, 'Azul', 60000),
('Toyota Corolla 2022', 5, 2022, 78000.00, 'Cinza', 10000),
('Honda Civic 2020', 6, 2020, 72000.00, 'Prata', 15000);

-- Inserção de dados na tabela Clientes
INSERT INTO Clientes (Nome, CPF, Endereco, Telefone, Email) VALUES 
('João Silva', '123.456.789-00', 'Rua Exemplo, 100', '(83) 90000-0000', 'joao@example.com'),
('Carlos Pereira', '222.333.444-55', 'Rua Exemplo 2, 250', '(83) 92222-2222', 'carlos@example.com'),
('Ana Souza', '555.666.777-88', 'Rua Exemplo 3, 300', '(83) 93333-3333', 'ana@example.com'),
('Lucas Lima', '888.999.000-11', 'Rua Exemplo 4, 150', '(83) 94444-4444', 'lucas@example.com');

-- Inserção de dados na tabela Vendedores
INSERT INTO Vendedores (Nome, CPF, Endereco, Telefone, Email) VALUES 
('Maria Souza', '987.654.321-00', 'Avenida Exemplo, 200', '(83) 98888-8888', 'maria@example.com'),
('Pedro Alves', '444.555.666-77', 'Rua Exemplo 3, 400', '(83) 94444-4444', 'pedro@example.com'),
('Roberto Mendes', '111.222.333-44', 'Avenida Exemplo 5, 500', '(83) 95555-5555', 'roberto@example.com'),
('Laura Oliveira', '666.777.888-99', 'Rua Exemplo 6, 600', '(83) 96666-6666', 'laura@example.com');

-- Inserção de dados na tabela Vendas
INSERT INTO Vendas (CarroID, ClienteID, VendedorID, DataVenda, PrecoVenda, TipoPagamento, NumParcelas) VALUES 
(1, 1, 1, '2024-06-18', 33000.00, 'parcelado', 12),
(2, 2, 2, '2024-06-19', 43000.00, 'à vista', 1),
(3, 3, 3, '2024-07-15', 26000.00, 'parcelado', 6),
(4, 4, 4, '2024-08-10', 30000.00, 'à vista', 1);

-- Inserção de dados na tabela Pagamentos
INSERT INTO Pagamentos (VendaID, DataPagamento, ValorPago) VALUES 
(1, '2024-07-01', 2750.00), 
(1, '2024-08-01', 2750.00),
(3, '2024-08-01', 4333.33), 
(3, '2024-09-01', 4333.33);

-- Consultas adicionais

-- 1. Listar clientes com o maior valor total de compras
SELECT 
    C.Nome,
    SUM(V.PrecoVenda) AS TotalGasto
FROM 
    Clientes C
JOIN Vendas V ON C.ID = V.ClienteID
GROUP BY C.ID
ORDER BY TotalGasto DESC;

-- 2. Listar os vendedores com maior faturamento total de vendas
SELECT 
    Vendedores.Nome,
    SUM(Vendas.PrecoVenda) AS TotalVendas
FROM 
    Vendedores
JOIN Vendas ON Vendedores.ID = Vendas.VendedorID
GROUP BY Vendedores.ID
ORDER BY TotalVendas DESC;

-- 3. Consultar o valor médio das vendas parceladas
SELECT 
    AVG(PrecoVenda) AS MediaParceladas
FROM 
    Vendas
WHERE TipoPagamento = 'parcelado';

-- 4. Consultar a porcentagem de carros vendidos por marca
SELECT 
    M.Nome AS Marca,
    COUNT(C.ID) * 100.0 / (SELECT COUNT(*) FROM Carros) AS PercentualVendas
FROM 
    Marcas M
JOIN Modelos Mo ON M.ID = Mo.MarcaID
JOIN Carros C ON C.ModeloID = Mo.ID
JOIN Vendas V ON C.ID = V.CarroID
GROUP BY M.Nome;

-- 5. Relatório de vendas mensais com faturamento total
SELECT 
    MONTH(V.DataVenda) AS Mes,
    COUNT(V.ID) AS TotalVendas,
    SUM(V.PrecoVenda) AS FaturamentoTotal
FROM 
    Vendas V
GROUP BY Mes
ORDER BY Mes;
