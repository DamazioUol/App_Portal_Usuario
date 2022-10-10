export class Paginacao<T>{
    /**
     *
     */
    constructor(
        public itens: T[],
        public pagina: number,
        public paginaQuantidade: number,
        public total: number,
    ) {
    }
}