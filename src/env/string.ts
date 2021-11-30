import { BaseType } from './btype';

export class StringT implements BaseType {

    value: string;

    constructor(value: string) {
        this.value = value;
    }

    inspect(): string {
        return this.value.toString();
    }
}