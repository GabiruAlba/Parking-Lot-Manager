import * as Clientes from './Clientes.js';
import * as Veiculo from './Veiculo.js';

// REGISTRO DE ESTACIONAMENTO
// Cria classe responsável pelo registro de entrada e saída
export class RegistroEstacionamento {
    #id;
    #veiculo;
    #vaga;
    #dataHoraEntrada;
    #dataHoraSaida;
    #valorDevido;
    #valorPago;
    #tipoCliente;
    #descontoIdentificador;
    #valorDesconto;

    constructor(id, veiculo, vaga, tipoCliente) {
        this.#id = id;
        this.#veiculo = veiculo;
        this.#vaga = vaga;
        this.#dataHoraEntrada = new Date();
        this.#dataHoraSaida = null;
        this.#valorDevido = 0;
        this.#valorPago = 0;
        this.#tipoCliente = tipoCliente;
        this.#descontoIdentificador = "nenhum";
        this.#valorDesconto = 0;
    }

    get id() {
        return this.#id;
    }

    get veiculo() {
        return this.#veiculo;
    }

    get vaga() {
        return this.#vaga;
    }

    get dataHoraEntrada() {
        return this.#dataHoraEntrada;
    }

    get dataHoraSaida() {
        return this.#dataHoraSaida;
    }

    get valorDevido() {
        return this.#valorDevido;
    }

    get valorPago() {
        return this.#valorPago;
    }

    get tipoCliente() {
        return this.#tipoCliente;
    }

    get descontoIdentificador() {
        return this.#descontoIdentificador;
    }

    get valorDesconto() {
        return this.#valorDesconto;
    }

    registrarSaida() {
        this.#dataHoraSaida = new Date();
    }

    definirValorDevido(valor) {
        this.#valorDevido = valor;
    }

    definirValorPago(valor) {
        this.#valorPago = valor;
    }

    definirDesconto(identificador, valor) {
        this.#descontoIdentificador = identificador;
        this.#valorDesconto = valor;
    }

    calcularTempoPermanencia() {
        const fim = this.#dataHoraSaida || new Date();

        const diferenca =
            fim.getTime() - this.#dataHoraEntrada.getTime();

        const horas = Math.ceil(diferenca / (1000 * 60 * 60));

        return Math.max(1, horas);
    }

    cruzouMeiaNoite() {
        if (!this.#dataHoraSaida) {
            return false;
        }

        return (
            this.#dataHoraEntrada.getDate() !==
            this.#dataHoraSaida.getDate()
            ||
            this.#dataHoraEntrada.getMonth() !==
            this.#dataHoraSaida.getMonth()
            ||
            this.#dataHoraEntrada.getFullYear() !==
            this.#dataHoraSaida.getFullYear()
        );
    }
}


// ESTACIONAMENTO
// Cria classe responsável pela gerência do estacionamento
export class Estacionamento {

    static CAPACIDADE = 9000;

    // Valores provisórios
    static VALOR_HORA_AVULSO = 10.00;
    static VALOR_DIARIA_AVULSO = 60.00;
    static VALOR_ENTRADA_ESTUDANTE = 10.00;
    static MULTA_EMPRESA_POR_DIA = 20.00;

    #vagasOcupadas;
    #clientes;
    #registrosAtivos;
    #historicoRegistros;
    #proximoIdRegistro;
    #placasBloqueadas;


    constructor() {
        this.#vagasOcupadas = new Map();

        this.#clientes = [];

        // placa -> RegistroEstacionamento
        this.#registrosAtivos = new Map();

        this.#historicoRegistros = [];

        this.#proximoIdRegistro = 1;

        // Placas de avulsos que se recusaram a pagar
        this.#placasBloqueadas = new Set();
    }

    // CLIENTES
    cadastrarCliente(cliente) {

        if (!(cliente instanceof Clientes.Cliente)) {
            throw new Error("Cliente inválido!");
        }

        if (this.#clientes.includes(cliente)) {
            throw new Error("Cliente já cadastrado!");
        }

        this.#clientes.push(cliente);
    }


    get clientes() {
        return this.#clientes;
    }


    buscarClientePorPlaca(placa) {

        for (const cliente of this.#clientes) {

            if (!(cliente instanceof Clientes.ClienteCadastrado)) {
                continue;
            }

            const veiculoEncontrado =
                cliente.veiculos.find(
                    veiculo => veiculo.placa === placa
                );

            if (veiculoEncontrado) {
                return cliente;
            }
        }

        return null;
    }


    // ENTRADA

    registrarEntrada(veiculo, vaga) {

        // Verifica veículo
        if (!(veiculo instanceof Veiculo.Veiculo)) {
            throw new Error("Veículo inválido!");
        }


        // Verifica vaga
        if (
            !Number.isInteger(vaga) ||
            vaga < 1 ||
            vaga > Estacionamento.CAPACIDADE
        ) {
            throw new Error("Número de vaga inválido!");
        }


        // Verifica se a vaga está ocupada
        if (this.#vagasOcupadas.has(vaga)) {
            throw new Error("Essa vaga já está ocupada!");
        }


        const placa = veiculo.placa;


        // Verifica se já está estacionado
        if (this.#registrosAtivos.has(placa)) {
            throw new Error(
                "Esse veículo já está estacionado!"
            );
        }


        // Verifica se a placa está bloqueada
        if (this.#placasBloqueadas.has(placa)) {
            throw new Error(
                "Veículo bloqueado. Entrada não autorizada!"
            );
        }

        // Procura cliente cadastrado
        const cliente = this.buscarClientePorPlaca(placa);
    

        // Cliente Cadastrado
        if (cliente) {

            // Cliente inativo
            if (!cliente.ativo) {
                throw new Error(
                    "Cliente inativo. Entrada não autorizada!"
                );
            }

            // Estudante
            if (cliente instanceof Clientes.Estudante) {

                // Estudante não pode ter saldo negativo
                if (cliente.saldo < 0) {
                    throw new Error(
                        "Estudante possui saldo negativo!"
                    );
                }
            }

            // Professor
            if (cliente instanceof Clientes.Professor) {

                // Professor só pode ter um veículo
                // estacionado simultaneamente
                if (
                    cliente.possuiVeiculoEstacionado(
                        this.#registrosAtivos
                    )
                ) {
                    throw new Error(
                        "Professor já possui um veículo estacionado!"
                    );
                }
            }

            // Empresa
            if (cliente instanceof Clientes.Empresa) {

                // Empresa só é bloqueada se estiver
                // inadimplente
                if (!cliente.podeEntrar()) {
                    throw new Error(
                        "Empresa inadimplente. Entrada bloqueada!"
                    );
                }
            }

            // Cria registro
            const registro =
                new RegistroEstacionamento(
                    this.#proximoIdRegistro++,
                    veiculo,
                    vaga,
                    this.obterTipoCliente(cliente)
                );


            this.#registrosAtivos.set(
                placa,
                registro
            );

            this.#vagasOcupadas.set(
                vaga,
                placa
            );


            return registro;
        }

        // Cliente Avulso
        const registro =
            new RegistroEstacionamento(
                this.#proximoIdRegistro++,
                veiculo,
                vaga,
                "Avulso"
            );


        this.#registrosAtivos.set(
            placa,
            registro
        );

        this.#vagasOcupadas.set(
            vaga,
            placa
        );


        return registro;
    }

    // SAÍDA
    registrarSaida(placa) {

        const registro =
            this.#registrosAtivos.get(placa);


        if (!registro) {
            throw new Error(
                "Veículo não está estacionado!"
            );
        }


        const cliente =
            this.buscarClientePorPlaca(placa);


        registro.registrarSaida();


        let valor = 0;
        let desconto = 0;
        let identificadorDesconto = "nenhum";

        // Cliente Avulso
        if (!cliente) {

            valor =
                this.calcularValorAvulso(registro);


            // Verifica se ganhou desconto
            if (this.ehClienteFrequente(placa)) {

                desconto = valor * 0.20;

                valor -= desconto;

                identificadorDesconto =
                    "ClienteFrequente";
            }
        }

        // Professor
        else if (cliente instanceof Clientes.Professor) {

            // Professor não paga
            valor = 0;
        }

        // Estudante
        else if (cliente instanceof Clientes.Estudante) {

            valor =
                Estacionamento.VALOR_ENTRADA_ESTUDANTE;

            // Pode ficar negativo na saída
            cliente.saldo -= valor;
        }

        // Empresa
        else if (cliente instanceof Clientes.Empresa) {

            valor =
                this.calcularValorEmpresa(registro);

            cliente.saldo -= valor;
        }


        // Guarda informações do desconto
        registro.definirDesconto(
            identificadorDesconto,
            desconto
        );


        registro.definirValorDevido(valor);

        registro.definirValorPago(valor);


        // Libera a vaga
        this.#vagasOcupadas.delete(
            registro.vaga
        );


        // Remove dos registros ativos
        this.#registrosAtivos.delete(
            placa
        );


        // Guarda no histórico
        this.#historicoRegistros.push(
            registro
        );


        return registro;
    }

    //CALCULAR VALORES
    
    // Valor Avulso
    calcularValorAvulso(registro) {

        const horas =
            registro.calcularTempoPermanencia();


        // Se passou de 6 horas,
        // cobra diária
        if (horas > 6) {

            const dias =
                this.calcularDias(
                    registro.dataHoraEntrada,
                    registro.dataHoraSaida
                );

            return (
                dias *
                Estacionamento.VALOR_DIARIA_AVULSO
            );
        }


        // Até 6 horas:
        // cobrança por hora
        return (
            horas *
            Estacionamento.VALOR_HORA_AVULSO
        );
    }

    // Valor Empresa
    calcularValorEmpresa(registro) {

        const dias =
            this.calcularDias(
                registro.dataHoraEntrada,
                registro.dataHoraSaida
            );


        return dias * Estacionamento.VALOR_DIARIA_AVULSO;
    }

    // Cliente Frequente
    ehClienteFrequente(placa) {

        const agora = new Date();


        const cincoDiasAtras =
            new Date(
                agora.getTime() -
                5 * 24 * 60 * 60 * 1000
            );


        const quantidade =
            this.#historicoRegistros.filter(
                registro =>
                    registro.veiculo.placa === placa &&
                    registro.dataHoraSaida &&
                    registro.dataHoraSaida >= cincoDiasAtras &&
                    registro.dataHoraSaida <= agora
            ).length;


        // O cliente se torna frequente
        // após utilizar 3 vezes nos últimos 5 dias
        return quantidade >= 2;
    }

    // RECUSA DE PAGAMENTO

    registrarRecusaPagamento(placa) {

        const registro =
            this.#registrosAtivos.get(placa);


        if (!registro) {
            throw new Error(
                "Veículo não está estacionado!"
            );
        }


        const cliente =
            this.buscarClientePorPlaca(placa);


        // Essa regra vale somente para avulsos
        if (cliente) {
            throw new Error(
                "A recusa de pagamento é uma regra para clientes avulsos."
            );
        }


        // Coloca na lista de bloqueados
        this.#placasBloqueadas.add(placa);


        // Mesmo sem pagar, o veículo pode sair
        registro.registrarSaida();


        registro.definirValorPago(0);


        registro.definirDesconto(
            "nenhum",
            0
        );


        // Calcula o valor que ficou devido
        const valor =
            this.calcularValorAvulso(registro);

        registro.definirValorDevido(valor);


        // Libera a vaga
        this.#vagasOcupadas.delete(
            registro.vaga
        );


        // Remove dos ativos
        this.#registrosAtivos.delete(
            placa
        );


        // Salva histórico
        this.#historicoRegistros.push(
            registro
        );


        return registro;
    }

    // CALCULAR DIAS

    calcularDias(inicio, fim) {

        const diferenca =
            fim.getTime() - inicio.getTime();


        const dias =
            Math.ceil(
                diferenca /
                (1000 * 60 * 60 * 24)
            );


        return Math.max(1, dias);
    }

    // TIPO DO CLIENTE

    obterTipoCliente(cliente) {

        if (cliente instanceof Clientes.Professor) {
            return "Professor";
        }

        if (cliente instanceof Clientes.Estudante) {
            return "Estudante";
        }

        if (cliente instanceof Clientes.Empresa) {
            return "Empresa";
        }

        if (cliente instanceof Clientes.ClienteAvulso) {
            return "Avulso";
        }

        return "Desconhecido";
    }

    // RELATÓRIO DE OCUPAÇÃO

    gerarRelatorioOcupacao() {

        return {
            capacidade: Estacionamento.CAPACIDADE,

            ocupadas:
                this.#vagasOcupadas.size,

            livres:
                Estacionamento.CAPACIDADE -
                this.#vagasOcupadas.size
        };
    }

    // ARRECADAÇÃO TOTAL

    gerarRelatorioArrecadacaoTotal() {

        return this.#historicoRegistros.reduce(
            (total, registro) =>
                total + registro.valorPago,
            0
        );
    }

    // ARRECADAÇÃO POR PERFIL

    gerarRelatorioArrecadacaoPorPerfil() {

        const resultado = {
            Avulso: 0,
            Professor: 0,
            Estudante: 0,
            Empresa: 0
        };


        for (const registro of this.#historicoRegistros) {

            if (
                resultado[registro.tipoCliente]
                !== undefined
            ) {
                resultado[registro.tipoCliente] +=
                    registro.valorPago;
            }
        }


        return resultado;
    }

    // CLIENTES INADIMPLENTES

    listarClientesInadimplentes() {

        return this.#clientes.filter(
            cliente =>
                cliente instanceof Clientes.ClienteCadastrado &&
                cliente.saldo < 0
        );
    }

    // VEÍCULOS DE CLIENTE ESTACIONADOS

    obterVeiculosEstacionados(cliente) {

        if (
            !(cliente instanceof Clientes.ClienteCadastrado)
        ) {
            throw new Error(
                "Cliente inválido!"
            );
        }


        return cliente.veiculos.filter(
            veiculo =>
                this.#registrosAtivos.has(
                    veiculo.placa
                )
        );
    }

    // HISTÓRICO DE CLIENTE

    obterHistoricoCliente(
        cliente,
        dataInicio = null,
        dataFim = null
    ) {

        if (
            !(cliente instanceof Clientes.ClienteCadastrado)
        ) {
            throw new Error(
                "Cliente inválido!"
            );
        }


        return this.#historicoRegistros.filter(
            registro => {

                const pertence =
                    cliente.veiculos.some(
                        veiculo =>
                            veiculo.placa ===
                            registro.veiculo.placa
                    );


                if (!pertence) {
                    return false;
                }


                if (
                    dataInicio &&
                    registro.dataHoraEntrada < dataInicio
                ) {
                    return false;
                }


                if (
                    dataFim &&
                    registro.dataHoraEntrada > dataFim
                ) {
                    return false;
                }


                return true;
            }
        );
    }

    // HISTÓRICO DE AVULSOS

    obterHistoricoAvulsos(
        dataInicio = null,
        dataFim = null
    ) {

        return this.#historicoRegistros.filter(
            registro => {

                if (
                    registro.tipoCliente !== "Avulso"
                ) {
                    return false;
                }


                if (
                    dataInicio &&
                    registro.dataHoraEntrada < dataInicio
                ) {
                    return false;
                }


                if (
                    dataFim &&
                    registro.dataHoraEntrada > dataFim
                ) {
                    return false;
                }


                return true;
            }
        );
    }

    // CLIENTES BLOQUEADOS

    listarBloqueados() {

        return [...this.#placasBloqueadas];
    }

    // 10 MAIS FREQUENTES
    
    obter10ClientesMaisFrequentes(
        ano = new Date().getFullYear()
    ) {

        const contagem = new Map();


        for (const registro of this.#historicoRegistros) {

            if (
                registro.dataHoraEntrada.getFullYear()
                !== ano
            ) {
                continue;
            }


            const cliente =
                this.buscarClientePorPlaca(
                    registro.veiculo.placa
                );


            let identificador;


            if (cliente) {
                identificador = cliente.id;
            } else {
                identificador =
                    registro.veiculo.placa;
            }


            if (!contagem.has(identificador)) {
                contagem.set(
                    identificador,
                    0
                );
            }


            contagem.set(
                identificador,
                contagem.get(identificador) + 1
            );
        }


        return [...contagem.entries()]
            .sort(
                (a, b) => b[1] - a[1]
            )
            .slice(0, 10);
    }
}