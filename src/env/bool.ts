import { BaseType } from './btype';

export class BoolT implements BaseType {

    private value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    inspect(): string {
        return this.value.toString();
    }
    
}