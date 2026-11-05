// CLASSE VEICULO
// Cria classe de veículo com verificação de placa
export class Veiculo {

    #placa;
    #marcaModelo;

    constructor(placa, marcaModelo) {

        if (!this.consistePlaca(placa)) {
            throw new Error("Placa inválida!");
        }

        this.#placa = placa;
        this.#marcaModelo = marcaModelo;
    }

    get placa() {
        return this.#placa;
    }

    get marcaModelo() {
        return this.#marcaModelo;
    }

    consistePlaca(placa) {

        // Formato de placa:
        // 3 letras maiúsculas + 4 números
        const regExp = /^[A-Z]{3}[0-9]{4}$/;

        return regExp.test(placa);
    }
}