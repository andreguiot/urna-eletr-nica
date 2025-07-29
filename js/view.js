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
                html = this.getFinishedScreen();
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
                    <div class="chapa-photo" data-chapa-numero="${chapa.numero}"></div>
                </div>
                <hr style="width:100%; margin-top: 1em; border-color: #ccc;">
                <p class="message-secondary" style="margin-top:1em;">Aperte CONFIRMA para registrar seu voto.</p>
                <p class="message-secondary" style="font-size: 1em;">Aperte CORRIGE para voltar à seleção de turma.</p>
            </div>`;
}

    getFeedbackScreen(message) {
        return `<p class="message-main feedback-screen">${message}</p>`;
    }
    
    /**
     * ATUALIZADO: A tela de finalização agora é apenas uma mensagem.
     */
    getFinishedScreen() {
        return `<div class="finished-screen">
                    <p class="message-main">VOTAÇÃO ENCERRADA</p>
                    <p class="message-secondary" style="margin-top: 2em;">Clique no botão vermelho para gerar o relatório final em PDF.</p>
                </div>`;
    }

    updateDigits(digits, count) {
        const boxes = this.contentDiv.querySelectorAll('.digit-box');
        if (!boxes.length || boxes.length !== count) return; 
        boxes.forEach((box, i) => {
            box.textContent = digits[i] || '';
        });
    }

    /**
     * ATUALIZADO: Agora também recebe o resultado final para incluir no PDF.
     */
    generateResultsPDFHTML(results, finalResult) {
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

        const finalResultHTML = `
            <footer style="text-align: center; border-top: 2px solid #ccc; padding-top: 20px; margin-top: 30px;">
                <h3>Resultado Final da Eleição</h3>
                <p>Total de Votos Chapa Amarela (10): <strong>${finalResult.votosChapa10}</strong></p>
                <p>Total de Votos Chapa Azul (20): <strong>${finalResult.votosChapa20}</strong></p>
                <p>Total de Votos Brancos: <strong>${finalResult.votosBrancos}</strong></p>
                <h4 style="margin-top: 15px; padding: 10px; background-color: #f2f2f2; border-radius: 5px; font-size: 1.2em;">
                    VENCEDOR: ${finalResult.vencedor}
                </h4>
            </footer>
        `;

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
                ${finalResultHTML}
            </div>
        `;
    }
}
