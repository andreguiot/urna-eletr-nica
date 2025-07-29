// O "maestro" que conecta a View e o Model.

class UrnaController {
    constructor(urna, view) {
        this.urna = urna;
        this.view = view;
        
        this.apiUrl = "https://script.google.com/macros/s/AKfycbwK3mbgjHBh5tqPL9rse1j7kLuklWYZymZe4cxUSVft8pfhXJXLX3FweoYeBTl0En6tIw/exec";

        this.keyboard = document.querySelector('#teclado');
        this.endButton = document.querySelector('#buttonEncerrarVotacao');

        this.keyboard.addEventListener('click', this.handleKeyboardClick.bind(this));
        this.endButton.addEventListener('click', this.handleEndVoteClick.bind(this));

        this.updateView();
    }

    sendVoteToCloud(turmaId, voto) {
        if (!this.apiUrl || this.apiUrl === "COLE_A_URL_DO_SEU_APP_DA_WEB_AQUI") {
            console.warn("API URL não configurada. O voto não será enviado para a nuvem.");
            return;
        }

        const data = {
            turma: turmaId,
            voto: voto
        };

        fetch(this.apiUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => console.log("Sucesso ao enviar para a nuvem (resposta inicial).", response))
        .catch(error => console.error('Erro ao enviar voto para a nuvem:', error));
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
                    const turmaId = this.urna.activeTurma.id;
                    this.urna.activeTurma.registrarVoto(enteredValue);
                    this.urna.eleicao.saveState();
                    this.sendVoteToCloud(turmaId, `Chapa ${enteredValue}`);
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
            const turmaId = this.urna.activeTurma.id;
            this.urna.activeTurma.registrarVotoBranco();
            this.urna.eleicao.saveState();
            this.sendVoteToCloud(turmaId, "Branco");
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

    /**
     * ATUALIZADO: Agora busca o resultado final e o passa para a view.
     */
    generatePDF() {
        const results = this.urna.eleicao.apurarResultadosGerais();
        const finalResult = this.urna.eleicao.apurarResultadoFinal();
        const reportContent = this.view.generateResultsPDFHTML(results, finalResult);

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
            // Não precisamos mais passar os resultados para a tela final
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
