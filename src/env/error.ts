import { BaseType } from './btype';

export class ErrorT implements BaseType {

    error: string;

    constructor(error: string) {
        this.error = error;
    }

    inspect(): string {
        return `Erro: ${this.error}`;
    }

}