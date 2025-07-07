// O ponto de entrada que inicializa a aplicação.

document.addEventListener('DOMContentLoaded', () => {
    const eleicao = new Eleicao(chapasData);
    const urna = new Urna(eleicao);
    const view = new UrnaView();
    new UrnaController(urna, view);

    console.log('Aplicação Urna Eletrônica por Chapas (MVC) iniciada!');
});
