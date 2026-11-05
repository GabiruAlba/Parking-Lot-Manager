import * as Clientes from './Clientes.js';
import * as Veiculo from './Veiculo.js';
import * as Estacionamento from './Estacionamento.js';

// TESTE DE EXECUÇÃO

try {

    const est = new Estacionamento.Estacionamento();

    const prof = new Clientes.Professor(
        1,
        "Carlos Silva",
        "RFC1234",
        100
    );

    const estu = new Clientes.Estudante(
        2,
        "Ana Souza",
        "RAC5678",
        10
    );

    const emp = new Clientes.Empresa(
        3,
        "ACME Corp",
        "12.345.678/0001-90",
        -50
    );


    est.cadastrarCliente(prof);
    est.cadastrarCliente(estu);
    est.cadastrarCliente(emp);


    const vProf = new Veiculo.Veiculo(
        "ABC1234",
        "Corolla"
    );

    const vEstu = new Veiculo.Veiculo(
        "CDC5678",
        "Onix"
    );

    const vEmp = new Veiculo.Veiculo(
        "EFC9012",
        "Uno"
    );

    const vAvulso = new Veiculo.Veiculo(
        "GHC3456",
        "Palio"
    );


    prof.adicionarVeiculo(vProf);
    estu.adicionarVeiculo(vEstu);
    emp.adicionarVeiculo(vEmp);


    console.log("--- TESTANDO ENTRADAS ---");

    est.registrarEntrada(vProf, 10);
    est.registrarEntrada(vEstu, 20);
    est.registrarEntrada(vAvulso, 30);

    console.log("Entradas registradas com sucesso!");


    try {

        est.registrarEntrada(vEmp, 40);

    } catch (e) {

        console.log(
            "Sucesso no teste de bloqueio de inadimplência:",
            e.message
        );
    }


    console.log("\n--- TESTANDO SAÍDAS ---");

    const s1 = est.registrarSaida("ABC1234");

    console.log(
        `Veículo ${s1.veiculo.placa} (Professor) saiu da vaga ${s1.vaga}. Valor pago: R$ ${s1.valorPago.toFixed(2)}. Saldo restante: R$ ${prof.saldo.toFixed(2)}`
    );


    const s2 = est.registrarSaida("GHC3456");

    console.log(
        `Veículo ${s2.veiculo.placa} (Avulso) saiu da vaga ${s2.vaga}. Valor pago: R$ ${s2.valorPago.toFixed(2)}`
    );


    console.log("\n--- RELATÓRIOS GERENCIAIS ---");

    console.log(
        "Ocupação:",
        est.gerarRelatorioOcupacao()
    );

    console.log(
        "Arrecadação Total: R$",
        est.gerarRelatorioArrecadacaoTotal().toFixed(2)
    );

    console.log(
        "Arrecadação por Perfil:",
        est.gerarRelatorioArrecadacaoPorPerfil()
    );

    console.log(
        "Clientes inadimplentes:",
        est.listarClientesInadimplentes()
    );


} catch (error) {

    console.error(
        "Erro inesperado na simulação:",
        error.message
    );
}