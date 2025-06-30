// js/controller.js

class UrnaController {
    constructor(urna, view) {
        this.urna = urna; // Agora recebe a instância principal da Urna
        this.view = view;

        this.keyboard = document.querySelector('#teclado');
        this.endButton = document.querySelector('#buttonEncerrarVotacao');

        this.keyboard.addEventListener('click', this.handleKeyboardClick.bind(this));
        this.endButton.addEventListener('click', this.handleEndVoteClick.bind(this));

        this.updateView();
    }

    handleKeyboardClick(event) {
        if (this.urna.state === 'FINISHED' || this.urna.state === 'AUTO_ELECTED') return;

        const target = event.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const value = target.dataset.value;

        if (value) {
            // Lógica para adicionar dígito ao `urna.currentDigits`
            const maxDigits = this.getMaxDigits();
            if (this.urna.currentDigits.length < maxDigits) {
                this.urna.currentDigits.push(value);
            }
        } else if (action === 'corrige') {
            this.urna.currentDigits = [];
        } else if (action === 'confirma') {
            this.handleConfirm();
        } else if (action === 'branco') {
            this.handleWhiteVote();
        }
        
        this.updateView();
    }

    handleConfirm() {
        const enteredValue = this.urna.currentDigits.join('');
        let error = null;

        switch(this.urna.state) {
            case 'INITIAL':
                this.urna.state = 'SELECT_YEAR';
                break;
            case 'SELECT_YEAR':
                // A validação de ano seria mais complexa, checando se alguma turma existe naquele ano
                this.urna.currentYear = enteredValue;
                this.urna.state = 'SELECT_CLASS';
                break;
            case 'SELECT_CLASS':
                if (this.urna.selectTurma(enteredValue)) {
                    // O estado é atualizado dentro de `selectTurma`
                } else {
                    error = 'Turma inválida!';
                }
                break;
            case 'VOTING':
                const candidate = this.urna.activeTurma.findCandidatoByNumero(enteredValue);
                if (candidate) {
                    this.urna.activeTurma.registrarVoto(enteredValue);
                    this.flashMessage('VOTO CONFIRMADO');
                    return;
                } else {
                    error = 'Número inválido!';
                }
                break;
        }

        this.urna.currentDigits = [];
        this.updateView(error);
    }
    
    handleWhiteVote() {
        if (this.urna.state === 'VOTING') {
            this.urna.activeTurma.registrarVotoBranco();
            this.flashMessage('VOTO EM BRANCO');
        }
    }
    
    handleEndVoteClick() {
        if (this.urna.state === 'FINISHED') {
            this.generatePDF();
        } else {
            if (this.urna.activeTurma) {
                this.urna.state = 'FINISHED';
                this.updateView();
            } else {
                alert("Nenhuma turma ativa para encerrar.");
            }
        }
    }

    updateView(error = null) {
        const state = this.urna.state;
        const data = { error };

        // Prepara os dados que a View precisa para renderizar
        switch(state) {
            case 'VOTING':
                const number = this.urna.currentDigits.join('');
                if (number) {
                    data.candidate = this.urna.activeTurma.findCandidatoByNumero(number);
                }
                break;
            case 'AUTO_ELECTED':
            case 'FINISHED':
                data.turma = this.urna.activeTurma;
                break;
        }

        this.view.render(state, data);
        this.view.updateDigits(this.urna.currentDigits, this.getMaxDigits());
    }
    
    getMaxDigits() {
        if (this.urna.state === 'SELECT_YEAR') return 1;
        if (this.urna.state === 'SELECT_CLASS' || this.urna.state === 'VOTING') return 3;
        return 0;
    }
    
    flashMessage(message) {
        this.view.render('CONFIRMED', { message });
        setTimeout(() => {
            this.urna.currentDigits = [];
            this.updateView();
        }, 1500);
    }
    
    generatePDF() {
        // ... a lógica de gerar PDF usa `this.urna.activeTurma.apurarResultados()`
    }
}
