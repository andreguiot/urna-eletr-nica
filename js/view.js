// Responsável por toda a manipulação do DOM (desenhar na tela).

class UrnaView {
    constructor() {
        this.contentDiv = document.querySelector('#view-content');
    }

    render(state, data = {}) {
        this.contentDiv.innerHTML = '';
        let html;

        let headerHTML = '';
        if (data.activeTurma) {
            headerHTML = `<p class="active-class-header">TURMA: ${data.activeTurma.id}</p>`;
        }

        switch (state) {
            case 'INITIAL':
                html = this.getStartScreen();
                break;
            case 'SELECT_CLASS':
                html = this.getDigitInputScreen('DIGITE O CÓDIGO DA TURMA:', 3, data.error);
                break;
            case 'VOTING':
                if (data.chapa) {
                    html = this.getChapaScreen(data.chapa);
                } else {
                    html = this.getDigitInputScreen('DIGITE O NÚMERO DA SUA CHAPA:', 2, data.error);
                }
                break;
            case 'CONFIRMED':
                html = this.getFeedbackScreen(data.message);
                break;
            case 'FINISHED':
                html = this.getFinishedScreen(data.generalResults);
                break;
            default:
                html = `<p>Erro: Estado desconhecido.</p>`;
        }
        this.contentDiv.innerHTML = headerHTML + html;
    }
    
    getStartScreen() {
        return `<div class="screen-start">
                    <p class="message-main">Aperte "Confirma" para iniciar a votação!</p>
                </div>`;
    }
    
    getDigitInputScreen(message, digitCount, error) {
        let boxes = Array(digitCount).fill('<div class="digit-box"></div>').join('');
        return `<div class="input-screen">
                    <p class="message-main">${message}</p>
                    <div class="digits-container">${boxes}</div>
                    <p class="message-error">${error || ''}</p>
                </div>`;
    }

    getChapaScreen(chapa) {
        return `<div class="chapa-screen">
                    <p class="message-secondary">Seu voto para:</p>
                    <div class="chapa-display">
                        <div class="chapa-info">
                            <p><span>NÚMERO:</span> ${chapa.numero}</p>
                            <p><span>NOME:</span> ${chapa.nome}</p>
                        </div>
                        <div class.chapa-photo" style="background-image: url('${chapa.foto}')"></div>
                    </div>
                    <hr style="width:100%; margin-top: 1em; border-color: #ccc;">
                    <p class="message-secondary" style="margin-top:1em;">Aperte CONFIRMA para registrar seu voto.</p>
                    <p class="message-secondary" style="font-size: 1em;">Aperte CORRIGE para voltar à seleção de turma.</p>
                </div>`;
    }

    getFeedbackScreen(message) {
        return `<p class="message-main feedback-screen">${message}</p>`;
    }
    
    getFinishedScreen(results) {
        let tableRows = results.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.votosChapa10}</td>
                <td>${r.votosChapa20}</td>
                <td>${r.votosBrancos}</td>
                <td><strong>${r.total}</strong></td>
            </tr>
        `).join('');

        return `<div class="results-screen">
                    <h1>RESULTADO GERAL</h1>
                    <div class="results-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Turma</th>
                                    <th>Chapa 10</th>
                                    <th>Chapa 20</th>
                                    <th>Brancos</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    <p class="message-secondary">Clique em Encerrar para gerar o PDF.</p>
                </div>`;
    }

    updateDigits(digits, count) {
        const boxes = this.contentDiv.querySelectorAll('.digit-box');
        if (!boxes.length || boxes.length !== count) return; 
        boxes.forEach((box, i) => {
            box.textContent = digits[i] || '';
        });
    }

    generateResultsPDFHTML(results) {
        let tableRows = results.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.votosChapa10}</td>
                <td>${r.votosChapa20}</td>
                <td>${r.votosBrancos}</td>
                <td>${r.total}</td>
            </tr>
        `).join('');

        const dataAtual = new Date().toLocaleString('pt-BR');

        return `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <header style="text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 20px;">
                    <h2>Relatório de Votação - Grêmio Estudantil</h2>
                    <p>Gerado em: ${dataAtual}</p>
                </header>
                <main>
                    <h3>Resultado Consolidado por Turma</h3>
                    <table style="width: 100%; border-collapse: collapse; text-align: center;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 8px; border: 1px solid #ddd;">Turma</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">Votos Chapa Amarela (10)</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">Votos Chapa Azul (20)</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">Votos Brancos</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">Total de Votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </main>
            </div>
        `;
    }
}
