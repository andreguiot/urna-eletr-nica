// O "maestro" que conecta a View e o Model.

class UrnaController {
    constructor(urna, view) {
        this.urna = urna;
        this.view = view;

        this.keyboard = document.querySelector('#teclado');
        this.endButton = document.querySelector('#buttonEncerrarVotacao');

        this.keyboard.addEventListener('click', this.handleKeyboardClick.bind(this));
        this.endButton.addEventListener('click', this.handleEndVoteClick.bind(this));

        this.updateView();
    }

    handleKeyboardClick(event) {
        if (this.urna.state === 'FINISHED') return;

        const target = event.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const value = target.dataset.value;

        if (value) {
            const maxDigits = 2; // Sempre 2 dígitos para as chapas
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
                this.urna.state = 'VOTING';
                break;
            case 'VOTING':
                const chapa = this.urna.eleicao.findChapaByNumero(enteredValue);
                if (chapa) {
                    this.urna.eleicao.registrarVoto(enteredValue);
                    this.flashMessage('VOTO CONFIRMADO');
                    return; // Evita limpar os dígitos e atualizar a view desnecessariamente
                } else if (enteredValue === '') {
                    error = 'Digite o número da chapa.';
                } else {
                    error = 'Número de chapa inválido!';
                }
                break;
        }

        this.urna.currentDigits = [];
        this.updateView(error);
    }
    
    handleWhiteVote() {
        if (this.urna.state === 'VOTING') {
            this.urna.eleicao.registrarVotoBranco();
            this.flashMessage('VOTO EM BRANCO');
        }
    }
    
    handleEndVoteClick() {
        if (this.urna.state === 'FINISHED') {
            // Se já terminou, o botão agora reinicia a votação
            this.urna.reset();
            this.updateView();
        } else {
            this.urna.state = 'FINISHED';
            this.updateView();
        }
    }

    updateView(error = null) {
        const state = this.urna.state;
        const data = { error };

        switch(state) {
            case 'VOTING':
                const number = this.urna.currentDigits.join('');
                if (number) {
                    data.chapa = this.urna.eleicao.findChapaByNumero(number);
                }
                break;
            case 'FINISHED':
                data.results = this.urna.eleicao.apurarResultados();
                break;
        }

        this.view.render(state, data);
        if (state === 'VOTING') {
            this.view.updateDigits(this.urna.currentDigits);
        }
    }
    
    flashMessage(message) {
        this.view.render('CONFIRMED', { message });
        setTimeout(() => {
            this.urna.currentDigits = [];
            this.updateView();
        }, 1500);
    }
}
