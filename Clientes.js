import * as Veiculo from './Veiculo.js';

// CLASSE CLIENTE
// Cria superclasse de cliente e método de desconto
export class Cliente {

    #id;
    #nome;

    constructor(id, nome) {
        this.#id = id;
        this.#nome = nome;
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    obterPercentualDesconto() {
        return 0.0;
    }
}


// CLIENTE AVULSO
// Cria subclasse de cliente avulso
export class ClienteAvulso extends Cliente {

    #veiculo;

    constructor(placa, marcaModelo) {

        // Cliente avulso não possui CPF/CNPJ.
        // A placa identifica o cliente.
        super(placa, placa);

        this.#veiculo = new Veiculo(placa, marcaModelo);
    }

    get veiculo() {
        return this.#veiculo;
    }
}

// CLIENTE CADASTRADO
// Cria subclasse de cliente cadastrado
export class ClienteCadastrado extends Cliente {

    #veiculos;
    #ativo;
    #saldo;

    constructor(id, nome, saldo = 0) {

        super(id, nome);

        this.#veiculos = [];
        this.#ativo = true;
        this.#saldo = saldo;
    }

    get ativo() {
        return this.#ativo;
    }

    set ativo(status) {
        this.#ativo = status;
    }

    get saldo() {
        return this.#saldo;
    }

    set saldo(valor) {
        this.#saldo = valor;
    }

    adicionarVeiculo(novoVeiculo) {
        if (!(novoVeiculo instanceof Veiculo.Veiculo)) {
            throw new Error("Veículo inválido!");
        }

        this.#veiculos.push(novoVeiculo);
    }
    removerVeiculo(placa) {

        const indice = this.#veiculos.findIndex(
            veiculo => veiculo.placa === placa
        );

        if (indice === -1) {
            throw new Error(
                "Veículo não encontrado no cadastro!"
            );
        }

        this.#veiculos.splice(indice, 1);
    }

    get veiculos() {
        return this.#veiculos;
    }

    podeEntrar() {
        return this.#ativo && this.#saldo >= 0;
    }
}

// ESTUDANTE
// Cria subclasse de estudante em cliente cadastrado
export class Estudante extends ClienteCadastrado {

    #matricula;

    constructor(id, nome, matricula, saldo = 0) {

        super(id, nome, saldo);

        this.#matricula = matricula;
    }

    get matricula() {
        return this.#matricula;
    }

    adicionarVeiculo(novoVeiculo) {

        if (this.veiculos.length >= 1) {
            throw new Error(
                "Estudante só pode ter um veículo cadastrado!"
            );
        }

        super.adicionarVeiculo(novoVeiculo);
    }

    obterPercentualDesconto() {
        return 0.0;
    }
}

// PROFESSOR
// Cria subclasse de professor em cliente cadastrado
export class Professor extends ClienteCadastrado {

    #registroFuncional;

    constructor(id, nome, registroFuncional, saldo = 0) {

        super(id, nome, saldo);

        this.#registroFuncional = registroFuncional;
    }

    get registroFuncional() {
        return this.#registroFuncional;
    }

    adicionarVeiculo(novoVeiculo) {

        if (this.veiculos.length >= 2) {
            throw new Error(
                "Professor só pode ter dois veículos cadastrados!"
            );
        }

        super.adicionarVeiculo(novoVeiculo);
    }

    possuiVeiculoEstacionado(registrosAtivos) {

        return this.veiculos.some(
            veiculo => registrosAtivos.has(veiculo.placa)
        );
    }

    obterPercentualDesconto() {
        return 0.0;
    }
}

// EMPRESA
// Cria subclasse de empresa em cliente cadastrado
export class Empresa extends ClienteCadastrado {

    #cnpj;

    constructor(id, nome, cnpj, saldo = 0) {

        super(id, nome, saldo);

        this.#cnpj = cnpj;
    }

    get cnpj() {
        return this.#cnpj;
    }

    obterPercentualDesconto() {
        return 0.0;
    }
}
