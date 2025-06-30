// js/model.js

/**
 * Representa um único candidato.
 * É um objeto de dados simples (Data Object).
 */
class Candidato {
    constructor(nome, numero, sexo, foto) {
        this.nome = nome;
        this.numero = numero;
        this.sexo = sexo;
        this.foto = foto;
        Object.freeze(this); // Torna o objeto imutável após a criação
    }
}

/**
 * Representa uma turma e gerencia toda a lógica de sua própria eleição.
 */
class Turma {
    constructor(id, ano) {
        this.id = id;
        this.ano = ano;
        this.candidatos = [];
        this.votos = new Map(); // Estrutura ideal para contar votos: { 'numeroCandidato' => contagem }
        this.votosBrancos = 0;
    }

    /**
     * Adiciona um objeto Candidato à lista da turma.
     * @param {Candidato} candidato
     */
    addCandidato(candidato) {
        this.candidatos.push(candidato);
    }

    /**
     * Encontra um candidato na turma pelo seu número.
     * @param {string} numero
     * @returns {Candidato | undefined}
     */
    findCandidatoByNumero(numero) {
        return this.candidatos.find(c => c.numero === numero);
    }

    /**
     * Registra um voto para um candidato.
     * @param {string} numero
     */
    registrarVoto(numero) {
        const contagemAtual = this.votos.get(numero) || 0;
        this.votos.set(numero, contagemAtual + 1);
        console.log(`Voto para o número ${numero} na turma ${this.id}. Total: ${this.votos.get(numero)}`);
    }

    /**
     * Registra um voto em branco.
     */
    registrarVotoBranco() {
        this.votosBrancos++;
    }

    /**
     * Verifica se a eleição para esta turma deve ser automática.
     * @returns {boolean}
     */
    isAutoElected() {
        if (this.candidatos.length === 0) return true;
        
        const men = this.candidatos.filter(c => c.sexo === 'M');
        const women = this.candidatos.filter(c => c.sexo === 'F');

        // Se houver 1 homem e 1 mulher (ou menos de cada), são eleitos automaticamente
        return men.length <= 1 && women.length <= 1;
    }

    /**
     * Apura os resultados da votação para esta turma.
     * @returns {object} Um objeto com os resultados detalhados.
     */
    apurarResultados() {
        const resultadosCandidatos = this.candidatos.map(c => ({
            ...c,
            votos: this.votos.get(c.numero) || 0,
        }));

        const mulheres = resultadosCandidatos.filter(c => c.sexo === 'F').sort((a, b) => b.votos - a.votos);
        const homens = resultadosCandidatos.filter(c => c.sexo === 'M').sort((a, b) => b.votos - a.votos);
        
        let vencedores = [];
        
        if (mulheres.length > 0) vencedores.push(mulheres[0]);
        if (homens.length > 0) vencedores.push(homens[0]);

        // Cenário de desempate ou falta de um sexo: elege os dois mais votados do sexo com mais candidatos
        if (vencedores.length < 2) {
            if (homens.length === 0 && mulheres.length > 1) {
                 vencedores = [mulheres[0], mulheres[1]];
            } else if (mulheres.length === 0 && homens.length > 1) {
                 vencedores = [homens[0], homens[1]];
            }
        }
        
        const totalVotosValidos = Array.from(this.votos.values()).reduce((sum, count) => sum + count, 0);

        return {
            votosBrancos: this.votosBrancos,
            totalVotosValidos: totalVotosValidos,
            candidatosComVotos: resultadosCandidatos,
            vencedores: vencedores,
        };
    }
}
