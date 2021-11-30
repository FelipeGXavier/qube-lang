import { BaseType } from './btype';

export class ReturnT implements BaseType {
    value: BaseType;

    constructor(value: BaseType) {
        this.value = value;
    }

    inspect(): string {
        return this.value.inspect();
    }
}