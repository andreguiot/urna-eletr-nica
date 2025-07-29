// Contém a lógica de negócio pura, agora com persistência de dados.

/**
 * Representa uma única chapa. É um objeto de dados simples.
 */
class Chapa {
    constructor(nome, numero, foto) {
        this.nome = nome;
        this.numero = numero;
        this.foto = foto;
        Object.freeze(this); // Torna o objeto imutável
    }
}

/**
 * Representa uma única turma e gerencia a contagem de votos para ela.
 */
class Turma {
    constructor(id) {
        this.id = id;
        this.votos = new Map(); // Estrutura: { 'numeroChapa' => contagem }
        this.votosBrancos = 0;
    }

    // Inicializa os contadores de voto para as chapas existentes.
    inicializarContadores(chapas) {
        chapas.forEach(chapa => {
            this.votos.set(chapa.numero, 0);
        });
    }

    registrarVoto(numeroChapa) {
        if (this.votos.has(numeroChapa)) {
            const contagemAtual = this.votos.get(numeroChapa);
            this.votos.set(numeroChapa, contagemAtual + 1);
        }
    }

    registrarVotoBranco() {
        this.votosBrancos++;
    }
    
    getTotalVotos() {
        let total = this.votosBrancos;
        this.votos.forEach(contagem => {
            total += contagem;
        });
        return total;
    }
}


/**
 * Gerencia a eleição como um todo, incluindo todas as turmas e chapas.
 */
class Eleicao {
    constructor(chapasData, turmasValidas) {
        this.chapas = new Map();
        this.turmas = new Map(); // Estrutura: { 'idTurma' => objeto Turma }
        this.turmasValidas = turmasValidas; // Armazena a lista de turmas válidas
        
        this._loadChapas(chapasData);
        this.loadState(); // Tenta carregar o estado salvo ao iniciar
    }

    _loadChapas(data) {
        for (const numero in data) {
            const dadosChapa = data[numero];
            const chapa = new Chapa(dadosChapa.nome, dadosChapa.numero, dadosChapa.foto);
            this.chapas.set(numero, chapa);
        }
    }

    _loadTurmasFromScratch() {
        this.turmasValidas.forEach(idTurma => {
            const turma = new Turma(idTurma);
            turma.inicializarContadores(this.chapas.values());
            this.turmas.set(idTurma, turma);
        });
        console.log(`${this.turmas.size} turmas carregadas do zero.`);
    }

    findChapaByNumero(numero) {
        return this.chapas.get(numero);
    }

    isTurmaValida(idTurma) {
        return this.turmas.has(idTurma);
    }

    getTurma(idTurma) {
        return this.turmas.get(idTurma);
    }
    
    apurarResultadosGerais() {
        const resultados = [];
        this.turmas.forEach(turma => {
            resultados.push({
                id: turma.id,
                votosChapa10: turma.votos.get('10'),
                votosChapa20: turma.votos.get('20'),
                votosBrancos: turma.votosBrancos,
                total: turma.getTotalVotos()
            });
        });
        return resultados;
    }

    /**
     * ATUALIZADO: Apura o resultado final de toda a eleição.
     */
    apurarResultadoFinal() {
        const totais = {
            votosChapa10: 0,
            votosChapa20: 0,
            votosBrancos: 0,
            votosTotais: 0,
            vencedor: ''
        };

        this.turmas.forEach(turma => {
            totais.votosChapa10 += turma.votos.get('10');
            totais.votosChapa20 += turma.votos.get('20');
            totais.votosBrancos += turma.votosBrancos;
        });

        totais.votosTotais = totais.votosChapa10 + totais.votosChapa20 + totais.votosBrancos;

        if (totais.votosChapa10 > totais.votosChapa20) {
            totais.vencedor = 'CHAPA AMARELA (10)';
        } else if (totais.votosChapa20 > totais.votosChapa10) {
            totais.vencedor = 'CHAPA AZUL (20)';
        } else {
            totais.vencedor = 'EMPATE TÉCNICO';
        }

        return totais;
    }

    saveState() {
        const turmasArray = Array.from(this.turmas.entries()).map(([id, turma]) => {
            return [id, {
                id: turma.id,
                votos: Array.from(turma.votos.entries()),
                votosBrancos: turma.votosBrancos
            }];
        });

        const stateToSave = {
            turmas: turmasArray
        };

        try {
            localStorage.setItem('eleicaoState', JSON.stringify(stateToSave));
            console.log('Estado da eleição salvo com sucesso!');
        } catch (e) {
            console.error('Erro ao salvar o estado da eleição:', e);
        }
    }

    loadState() {
        try {
            const savedStateJSON = localStorage.getItem('eleicaoState');
            if (savedStateJSON) {
                const savedState = JSON.parse(savedStateJSON);
                
                this.turmas = new Map(
                    savedState.turmas.map(([id, turmaData]) => {
                        const turma = new Turma(id);
                        turma.votos = new Map(turmaData.votos);
                        turma.votosBrancos = turmaData.votosBrancos;
                        return [id, turma];
                    })
                );
                console.log('Estado da eleição carregado do localStorage.');
            } else {
                this._loadTurmasFromScratch();
            }
        } catch (e) {
            console.error('Erro ao carregar o estado da eleição:', e);
            this._loadTurmasFromScratch();
        }
    }
}
