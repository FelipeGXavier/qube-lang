import { BaseType } from './btype';

type BuiltinFunction = (...args: BaseType[]) => BaseType;

export class BuiltinT implements BaseType {

    func: BuiltinFunction;

    constructor(func: BuiltinFunction) {
        this.func = func;
    }

    inspect(): string {
        return "builtin function";
    }
}
