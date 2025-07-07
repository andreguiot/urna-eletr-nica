// Responsável por toda a manipulação do DOM (desenhar na tela).

class UrnaView {
    constructor() {
        this.contentDiv = document.querySelector('#view-content');
    }

    render(state, data = {}) {
        this.contentDiv.innerHTML = '';
        let html;

        switch (state) {
            case 'INITIAL':
                html = this.getStartScreen();
                break;
            case 'VOTING':
                if (data.chapa) {
                    html = this.getChapaScreen(data.chapa, data.error);
                } else {
                    html = this.getDigitInputScreen('DIGITE O NÚMERO DA SUA CHAPA:', 2, data.error);
                }
                break;
            case 'CONFIRMED':
                html = this.getFeedbackScreen(data.message);
                break;
            case 'FINISHED':
                html = this.getFinishedScreen(data.results);
                break;
        }
        this.contentDiv.innerHTML = html;
    }
    
    getStartScreen() {
        return `<div class="screen-start">
                    <p class="message-main">Aperte "Confirma" para iniciar a votação!</p>
                </div>`;
    }
    
    getDigitInputScreen(message, digitCount, error) {
        let boxes = Array(digitCount).fill('<div class="digit-box"></div>').join('');
        return `<div>
                    <p class="message-main">${message}</p>
                    <div class="digits-container">${boxes}</div>
                    <p class="message-error">${error || ''}</p>
                </div>`;
    }

    getChapaScreen(chapa, error) {
        return `<p class="message-secondary">Seu voto para:</p>
                <div class="chapa-display">
                    <div class="chapa-info">
                        <p><span>NÚMERO:</span> ${chapa.numero}</p>
                        <p><span>NOME:</span> ${chapa.nome}</p>
                    </div>
                    <div class="chapa-photo" style="background-image: url('${chapa.foto}')"></div>
                </div>
                <hr style="width:100%; margin-top: 1em; border-color: #ccc;">
                <p class="message-secondary" style="margin-top:1em;">Aperte CONFIRMA para registrar seu voto.</p>
                <p class="message-error">${error || ''}</p>`;
    }

    getFeedbackScreen(message) {
        return `<p class="message-main" style="font-size: 4em;">${message}</p>`;
    }
    
    getFinishedScreen(results) {
        let resultsHTML = results.resultados.map(r => `<p>${r.nome}: <strong>${r.votos} votos</strong></p>`).join('');
        let winnerHTML = '';

        if (results.empate) {
            winnerHTML = `<p class="winner">HOUVE UM EMPATE!</p>`;
        } else if (results.vencedora) {
            winnerHTML = `<p class="winner">CHAPA VENCEDORA: ${results.vencedora.nome}</p>`;
        } else {
            winnerHTML = `<p>Nenhum voto registrado.</p>`;
        }

        return `<div class="results-screen">
                    <h1>VOTAÇÃO ENCERRADA</h1>
                    ${resultsHTML}
                    <p>Votos em Branco: <strong>${results.votosBrancos}</strong></p>
                    <hr style="margin: 1em 0;">
                    ${winnerHTML}
                    <p style="text-align:center; margin-top: 2em; font-size: 1em;">Clique em Encerrar para reiniciar a votação.</p>
                </div>`;
    }

    updateDigits(digits) {
        const boxes = this.contentDiv.querySelectorAll('.digit-box');
        if (!boxes.length) return;
        boxes.forEach((box, i) => {
            box.textContent = digits[i] || '';
        });
    }
}
