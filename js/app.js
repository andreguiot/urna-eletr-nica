// O ponto de entrada que inicializa a aplicação.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cria a instância da Eleicao com os dados das chapas e das turmas.
    const eleicao = new Eleicao(chapasData, turmasValidas);
    
    // 2. Cria a instância principal da Urna, que gerencia o estado.
    const urna = new Urna(eleicao);
    
    // 3. Cria a instância da View.
    const view = new UrnaView();
    
    // 4. Conecta tudo no Controller.
    new UrnaController(urna, view);

    console.log('Aplicação Urna Eletrônica por Turmas (MVC) iniciada!');
});
