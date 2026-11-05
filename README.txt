# Sistema de Estacionamento

Sistema de gerenciamento de estacionamento desenvolvido em **JavaScript**, 
como parte de um projeto acadêmico da disciplina de desenvolvimento de sistemas.

O sistema permite cadastrar clientes, associar veículos, controlar entradas 
e saídas do estacionamento, calcular valores e gerar relatórios administrativos.

## Tecnologias utilizadas

* JavaScript
* Node.js
* ECMAScript Modules (ES Modules)
* Git
* GitHub

## Estrutura do projeto

```text
/
├── Clientes.js
├── Veiculo.js
├── Estacionamento.js
├── teste.js
└── README.md
```

### `Clientes.js`

Contém as classes responsáveis pela representação dos clientes do estacionamento.

Principais classes:

* `Cliente`
* `ClienteAvulso`
* `ClienteFrequente`
* `ClienteCadastrado`
* `Estudante`
* `Professor`
* `Empresa`

A classe `Cliente` funciona como classe base para os demais tipos de clientes.

### `Veiculo.js`

Contém a classe `Veiculo`, responsável pela representação dos veículos.

Cada veículo possui:

* Placa
* Marca/modelo

A placa é validada através de uma expressão regular no momento da criação do objeto.

### `Estacionamento.js`

Contém as classes e funcionalidades relacionadas ao estacionamento.

Principais responsabilidades:

* Controle das vagas
* Cadastro de clientes
* Associação entre clientes e veículos
* Registro de entrada
* Registro de saída
* Controle de veículos estacionados
* Cálculo de valores
* Histórico de estacionamentos
* Geração de relatórios

Também possui a classe `RegistroEstacionamento`, responsável por armazenar as informações de cada permanência no estacionamento.

### `teste.js`

Arquivo utilizado para executar e testar as funcionalidades desenvolvidas.

São realizados testes envolvendo:

* Cadastro de clientes
* Cadastro de veículos
* Entrada de veículos
* Bloqueio de cliente inadimplente
* Saída de veículos
* Cálculo de valores
* Relatórios

---

## Modelo de clientes

O sistema possui diferentes tipos de clientes.

### Cliente

Classe base que contém as informações comuns aos clientes.

Atributos:

* `id`
* `nome`

Também possui o método:

```javascript
obterPercentualDesconto()
```

que pode ser sobrescrito pelas classes derivadas.

### Cliente Avulso

Representa um cliente que utiliza o estacionamento sem possuir cadastro prévio.

O cliente avulso é identificado exclusivamente pela **placa do veículo**.

### Cliente Cadastrado

Classe base para clientes que possuem cadastro no estacionamento.

Possui:

* Identificação
* Nome
* Veículos cadastrados
* Status de ativo/inativo
* Saldo

Também possui funcionalidades para adicionar veículos e verificar se o cliente pode entrar no estacionamento.

### Estudante

Especialização de `ClienteCadastrado`.

Possui:

* Matrícula
* Limite de um veículo cadastrado

### Professor

Especialização de `ClienteCadastrado`.

Possui:

* Registro funcional
* Limite de dois veículos cadastrados

O sistema também verifica se o professor já possui um veículo estacionado.

### Empresa

Especialização de `ClienteCadastrado`.

Possui:

* CNPJ
* Veículos associados

---

## Modelo de veículos

Cada veículo é representado pela classe `Veiculo`.

Exemplo:

```javascript
const carro = new Veiculo.Veiculo(
    "ABC1234",
    "Toyota Corolla"
);
```

A placa deve seguir o formato:

```text
ABC1234
```

O sistema valida automaticamente a placa durante a criação do veículo.

---

## Módulos ES

O projeto utiliza **ES Modules**.

Os módulos são importados utilizando o padrão `namespace import`:

```javascript
import * as Clientes from './Clientes.js';
import * as Veiculo from './Veiculo.js';
import * as Estacionamento from './Estacionamento.js';
```

Dessa forma, as classes são acessadas através do nome do módulo.

Por exemplo:

```javascript
const professor =
    new Clientes.Professor(
        1,
        "Carlos Silva",
        "RFC1234",
        100
    );
```

E para veículos:

```javascript
const carro =
    new Veiculo.Veiculo(
        "ABC1234",
        "Corolla"
    );
```

---

## Controle de vagas

O estacionamento possui capacidade definida de:

```text
9.000 vagas
```

As vagas ocupadas são armazenadas utilizando uma estrutura `Map`, associando o número da vaga à placa do veículo.

Exemplo conceitual:

```text
Vaga 10 → ABC1234
Vaga 20 → CDC5678
Vaga 30 → GHC3456
```

Isso permite verificar rapidamente se determinada vaga está ocupada.

---

## Registro de estacionamento

Cada entrada gera um objeto `RegistroEstacionamento`.

O registro armazena informações como:

* ID do registro
* Veículo
* Número da vaga
* Data e hora de entrada
* Data e hora de saída
* Valor pago

Os registros ativos ficam separados do histórico.

### Registros ativos

Representam os veículos que estão atualmente dentro do estacionamento.

### Histórico

Armazena os registros depois que o veículo deixa o estacionamento.

---

## Entrada de veículos

Para registrar uma entrada, é necessário informar o veículo e a vaga:

```javascript
est.registrarEntrada(veiculo, 10);
```

O sistema verifica:

1. Se o veículo é válido.
2. Se a vaga está dentro do limite permitido.
3. Se a vaga está livre.
4. Se o veículo já está estacionado.
5. Se o cliente possui autorização para entrar.

Após a autorização, a vaga é marcada como ocupada e um novo registro é criado.

---

## Saída de veículos

A saída é localizada através da placa:

```javascript
const registro =
    est.registrarSaida("ABC1234");
```

Durante a saída, o sistema:

1. Localiza o registro ativo.
2. Registra a data e hora de saída.
3. Calcula o valor correspondente.
4. Registra o pagamento.
5. Libera a vaga.
6. Remove o veículo dos registros ativos.
7. Adiciona o registro ao histórico.

---

## Relatórios

O sistema possui funcionalidades para auxiliar o gerenciamento do estacionamento.

### Relatório de ocupação

Retorna:

* Capacidade total
* Número de vagas ocupadas
* Número de vagas livres

Exemplo:

```javascript
est.gerarRelatorioOcupacao();
```

### Arrecadação total

Calcula o total arrecadado pelos registros finalizados:

```javascript
est.gerarRelatorioArrecadacaoTotal();
```

### Arrecadação por perfil

Permite visualizar a arrecadação separada por tipo de cliente:

```javascript
est.gerarRelatorioArrecadacaoPorPerfil();
```

Exemplo de resultado:

```text
{
    Avulso: 20,
    Professor: 0,
    Estudante: 10,
    Empresa: 50
}
```

### Clientes inadimplentes

Permite consultar clientes cadastrados que possuem saldo negativo:

```javascript
est.listarClientesInadimplentes();
```

---

## Execução

Para executar o projeto, é necessário possuir o **Node.js** instalado.

No terminal, dentro da pasta do projeto, execute:

```bash
node teste.js
```

O arquivo `teste.js` executará os testes e exibirá os resultados no terminal.

---

## Exemplo de execução

O arquivo de testes cria diferentes clientes:

```text
Professor
Estudante
Empresa
Cliente Avulso
```

Em seguida, são cadastrados os veículos e realizadas operações de entrada e saída.

Também são testadas situações de bloqueio, como a tentativa de entrada de uma empresa com saldo negativo.

---

## Objetivo do projeto

O projeto tem como objetivo aplicar conceitos de **Programação Orientada a Objetos (POO)** e organização modular em JavaScript.

Entre os principais conceitos utilizados estão:

* Classes
* Herança
* Encapsulamento
* Polimorfismo
* Classes abstratas/base
* Getters e setters
* Módulos ES
* `Map`
* `Set`
* Arrays
* Validação de dados
* Tratamento de exceções
* Manipulação de datas
* Estruturas de controle

## Autor

Projeto desenvolvido como atividade acadêmica do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.
