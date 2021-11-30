import { BaseType } from './btype';

export class FloaT implements BaseType {

    value: number;

    constructor(value: number) {
        this.value = value;
    }

    inspect(): string {
        return this.value.toFixed(2);
    }
}