import { BaseType } from './btype';

export class IntegerT implements BaseType {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    inspect(): string {
        return this.value.toFixed(0);
    }
}