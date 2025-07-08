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
        let error = null;

        if (value) {
            const maxDigits = this.getMaxDigitsForState();
            if (this.urna.currentDigits.length < maxDigits) {
                this.urna.currentDigits.push(value);
            }
        } else if (action === 'corrige') {
            this.handleCorrection();
        } else if (action === 'confirma') {
            const result = this.handleConfirm();
            if (result && result.flash) {
                return;
            }
            error = result ? result.error : null;
        } else if (action === 'branco') {
            this.handleWhiteVote();
            return;
        }
        
        this.updateView({ error });
    }
    
    handleCorrection() {
        if (this.urna.state === 'VOTING' && this.urna.currentDigits.length === 0) {
            this.urna.releaseTurma();
        } else {
            this.urna.currentDigits = [];
        }
    }

    handleConfirm() {
        const enteredValue = this.urna.currentDigits.join('');
        let error = null;

        switch(this.urna.state) {
            case 'INITIAL':
                this.urna.state = 'SELECT_CLASS';
                break;
            case 'SELECT_CLASS':
                if (!this.urna.selectTurma(enteredValue)) {
                    error = 'Turma inválida!';
                }
                break;
            case 'VOTING':
                const chapa = this.urna.eleicao.findChapaByNumero(enteredValue);
                if (chapa) {
                    this.urna.activeTurma.registrarVoto(enteredValue);
                    this.urna.eleicao.saveState(); // <-- AQUI! SALVA O ESTADO
                    this.flashMessage('VOTO CONFIRMADO');
                    return { flash: true }; 
                } else {
                    error = 'Número de chapa inválido!';
                }
                break;
        }

        this.urna.currentDigits = [];
        return { error };
    }
    
    handleWhiteVote() {
        if (this.urna.state === 'VOTING') {
            this.urna.activeTurma.registrarVotoBranco();
            this.urna.eleicao.saveState(); // <-- AQUI! SALVA O ESTADO
            this.flashMessage('VOTO EM BRANCO');
        }
    }
    
    handleEndVoteClick() {
        if (this.urna.state === 'FINISHED') {
            this.generatePDF();
        } else {
            this.urna.state = 'FINISHED';
            this.updateView();
        }
    }

    generatePDF() {
        const results = this.urna.eleicao.apurarResultadosGerais();
        const reportContent = this.view.generateResultsPDFHTML(results);

        const options = {
            margin:       1,
            filename:     `resultado_eleicao_gremio_${new Date().toISOString().slice(0,10)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(reportContent).set(options).save();
    }

    updateView(data = {}) {
        const state = this.urna.state;
        
        data.state = state;
        data.activeTurma = this.urna.activeTurma;

        if (state === 'VOTING') {
            const number = this.urna.currentDigits.join('');
            if (number) {
                data.chapa = this.urna.eleicao.findChapaByNumero(number);
            }
        } else if (state === 'FINISHED') {
            data.generalResults = this.urna.eleicao.apurarResultadosGerais();
        }

        this.view.render(state, data);
        
        if (state === 'SELECT_CLASS' || state === 'VOTING') {
            this.view.updateDigits(this.urna.currentDigits, this.getMaxDigitsForState());
        }
    }
    
    getMaxDigitsForState() {
        if (this.urna.state === 'SELECT_CLASS') return 3;
        if (this.urna.state === 'VOTING') return 2;
        return 0;
    }
    
    flashMessage(message) {
        this.view.render('CONFIRMED', { message, activeTurma: this.urna.activeTurma });
        setTimeout(() => {
            this.urna.currentDigits = [];
            this.updateView();
        }, 1500);
    }
}
