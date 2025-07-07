/**
 * A classe que gerencia o estado geral da urna (a máquina de estados).
 */
class Urna {
    constructor(eleicao) {
        this.eleicao = eleicao;
        
        // A máquina de estados agora inclui a seleção de turma
        this.state = 'INITIAL'; // INITIAL, SELECT_CLASS, VOTING, FINISHED
        
        this.activeTurma = null; // Guarda a instância da turma que está votando
        this.currentDigits = [];
    }

    // Seleciona uma turma para iniciar a votação
    selectTurma(idTurma) {
        if (this.eleicao.isTurmaValida(idTurma)) {
            this.activeTurma = this.eleicao.getTurma(idTurma);
            this.state = 'VOTING';
            console.log(`Turma ${idTurma} selecionada.`);
            return true;
        }
        console.error(`Tentativa de selecionar turma inválida: ${idTurma}`);
        return false;
    }
    
    // Libera a turma ativa, para que uma nova possa ser selecionada
    releaseTurma() {
        console.log(`Turma ${this.activeTurma.id} liberada.`);
        this.activeTurma = null;
        this.state = 'SELECT_CLASS';
    }

    reset() {
        this.state = 'INITIAL';
        this.activeTurma = null;
        this.currentDigits = [];
        // A lógica para resetar os votos de fato ficaria dentro da classe Eleicao,
        // se necessário, para não perdermos os dados sem querer.
        console.log("Urna reiniciada para o estado inicial.");
    }
}
