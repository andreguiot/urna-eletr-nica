// Contém a lógica de negócio pura, sem se preocupar com a tela.

/**
 * Representa uma única chapa. É um objeto de dados simples.
 */
class Chapa {
    constructor(nome, numero, foto) {
        this.nome = nome;
        this.numero = numero;
        this.foto = foto;
        Object.freeze(this); // Torna o objeto imutável
    }
}

/**
 * Gerencia toda a lógica da eleição.
 */
class Eleicao {
    constructor(data) {
        this.chapas = new Map();
        this.votos = new Map(); // Estrutura: { 'numeroChapa' => contagem }
        this.votosBrancos = 0;
        this._loadChapas(data);
    }

    _loadChapas(data) {
        for (const numero in data) {
            const dadosChapa = data[numero];
            const chapa = new Chapa(dadosChapa.nome, dadosChapa.numero, dadosChapa.foto);
            this.chapas.set(numero, chapa);
            this.votos.set(numero, 0); // Inicializa a contagem de votos para cada chapa
        }
        console.log("Chapas carregadas:", this.chapas);
    }

    findChapaByNumero(numero) {
        return this.chapas.get(numero);
    }

    registrarVoto(numero) {
        if (this.votos.has(numero)) {
            const contagemAtual = this.votos.get(numero);
            this.votos.set(numero, contagemAtual + 1);
            console.log(`Voto para a chapa ${numero}. Total: ${this.votos.get(numero)}`);
        }
    }

    registrarVotoBranco() {
        this.votosBrancos++;
        console.log(`Voto em branco. Total: ${this.votosBrancos}`);
    }

    apurarResultados() {
        let vencedora = null;
        let maxVotos = -1;
        let empate = false;

        const resultados = [];
        
        this.votos.forEach((contagem, numero) => {
            const chapa = this.chapas.get(numero);
            resultados.push({ nome: chapa.nome, votos: contagem });

            if (contagem > maxVotos) {
                maxVotos = contagem;
                vencedora = chapa;
                empate = false;
            } else if (contagem === maxVotos && maxVotos > 0) {
                empate = true;
            }
        });
        
        if (maxVotos === 0 && this.votosBrancos === 0) {
            vencedora = null;
        }

        return {
            votosBrancos: this.votosBrancos,
            resultados: resultados,
            vencedora: empate ? null : vencedora,
            empate: empate,
        };
    }
    
    reset() {
        this.votos.forEach((_, key) => this.votos.set(key, 0));
        this.votosBrancos = 0;
        console.log("Votação reiniciada.");
    }
}
