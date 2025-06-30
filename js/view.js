/**
 * A View é responsável por toda a manipulação do DOM.
 */
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
            case 'SELECT_YEAR':
                html = this.getDigitInputScreen('Digite o ano:', 1, data.error);
                break;
            case 'SELECT_CLASS':
                html = this.getDigitInputScreen('Digite a turma:', 3, data.error);
                break;
            case 'VOTING':
                if (data.candidate) {
                    html = this.getCandidateScreen(data.candidate, data.error);
                } else {
                    html = this.getDigitInputScreen('Digite o número do seu candidato:', 3, data.error);
                }
                break;
            case 'CONFIRMED':
                html = this.getFeedbackScreen(data.message);
                break;
            case 'AUTO_ELECTED':
                html = this.getAutoElectedScreen(data.turma);
                break;
            case 'FINISHED':
                html = this.getFinishedScreen(data.turma);
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

    getCandidateScreen(candidate, error) {
        return `<p class="message-secondary">Seu voto para:</p>
                <div class="candidate-display">
                    <div class="candidate-info">
                        <p><span>NÚMERO:</span> ${candidate.numero}</p>
                        <p><span>NOME:</span> ${candidate.nome}</p>
                    </div>
                    <div class="candidate-photo" style="background-image: url('images/${candidate.foto}')"></div>
                </div>
                <p class="message-error">${error || ''}</p>`;
    }

    getFeedbackScreen(message) {
        return `<p class="message-main">${message}</p>`;
    }
    
    getAutoElectedScreen(turma) {
        let candidates = turma.candidatos;
        let message = 'Não há candidatos para esta turma.';
        if (candidates.length > 0) {
            const names = candidates.map(c => c.nome).join(' e ');
            message = `Candidatos eleitos automaticamente: <br> ${names}`;
        }
        return `<p class="message-main">${message}</p>
                <p class="message-secondary">A votação para a turma ${turma.id} está encerrada.</p>`;
    }
    
    getFinishedScreen(turma) {
        return `<p class="message-main">VOTAÇÃO ENCERRADA</p>
                <p class="message-secondary">Turma ${turma.id}. Clique em Encerrar novamente para gerar o relatório.</p>`;
    }

    updateDigits(digits, count) {
        const boxes = this.contentDiv.querySelectorAll('.digit-box');
        if (!boxes.length) return;
        boxes.forEach((box, i) => {
            box.textContent = digits[i] || '';
        });
    }
    
    generateResultsHTML(results, turma) {
        let winnersHTML = results.vencedores.map(w => `<li>${w.nome} (${w.votos} votos)</li>`).join('');
        let candidatesHTML = results.candidatosComVotos.map(c => `<li>${c.nome} (${c.numero}): ${c.votos} votos</li>`).join('');

        return `<div style="padding: 20px; font-family: sans-serif;">
                    <h1>Resultado da Eleição</h1>
                    <p><strong>Turma:</strong> ${turma.id} | <strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    <hr>
                    <h2>Vencedores</h2>
                    <ul>${winnersHTML || '<li>Nenhum vencedor apurado.</li>'}</ul>
                    <hr>
                    <h2>Contagem Geral</h2>
                    <ul>${candidatesHTML}</ul>
                    <p><strong>Votos em Branco:</strong> ${results.votosBrancos}</p>
                    <p><strong>Total de Votos Válidos:</strong> ${results.totalVotosValidos}</p>
                </div>`;
    }
}
