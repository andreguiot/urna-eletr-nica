// js/urna.js

/**
 * A classe principal que gerencia o estado geral da urna.
 * Funciona como o "Model" principal da aplicação.
 */
class Urna {
    constructor(candidatosData) {
        this.turmas = new Map(); // Estrutura: '111' => objeto Turma
        this._loadData(candidatosData);

        this.state = 'INITIAL'; // INITIAL, SELECT_YEAR, SELECT_CLASS, VOTING, FINISHED
        this.activeTurma = null;
        this.currentDigits = [];
    }

    /**
     * Carrega os dados brutos e os transforma em objetos Turma e Candidato.
     * @param {object} candidatosData
     */
    _loadData(candidatosData) {
        for (const ano in candidatosData) {
            for (const idTurma in candidatosData[ano]) {
                const turma = new Turma(idTurma, ano);
                const dadosCandidatos = candidatosData[ano][idTurma];

                for (const dadosCandidato of dadosCandidatos) {
                    const candidato = new Candidato(
                        dadosCandidato.nome,
                        dadosCandidato.numero,
                        dadosCandidato.sexo,
                        dadosCandidato.foto
                    );
                    turma.addCandidato(candidato);
                }
                this.turmas.set(idTurma, turma);
            }
        }
        console.log(`${this.turmas.size} turmas carregadas.`);
    }

    // A lógica de `handleConfirm`, `addDigit`, etc., viria aqui,
    // mas agora ela DELEGA as chamadas para o `this.activeTurma`.
    // Ex: this.activeTurma.registrarVoto(numero);
    // Para manter o exemplo claro, vamos focar na estrutura.
    // O controller.js vai preencher essa lógica de delegação.
    
    reset() {
        this.state = 'INITIAL';
        this.activeTurma = null;
        this.currentDigits = [];
        // Nota: Os votos são mantidos dentro de cada objeto Turma.
        // Se quisermos limpar os votos, teríamos que iterar por `this.turmas`
        // e chamar um método `turma.resetVotos()`.
    }

    selectTurma(idTurma) {
        if (this.turmas.has(idTurma)) {
            this.activeTurma = this.turmas.get(idTurma);
            this.state = this.activeTurma.isAutoElected() ? 'AUTO_ELECTED' : 'VOTING';
            return true;
        }
        return false;
    }
}
