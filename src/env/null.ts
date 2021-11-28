import { BaseType } from './btype';

export class NullT implements BaseType {

    inspect(): string {
        return "null";
    }
}