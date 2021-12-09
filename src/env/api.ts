import { BuiltinT } from "./builtin";
import { BaseType } from './btype';
import { NullT } from './null';

export const builtins: { [key: string]: BuiltinT } = {
    console: new BuiltinT(
        (...args: BaseType[]): NullT => {
            const inspected = args.map((arg) => arg.inspect());
            console.log(...inspected);
            return new NullT();
        }
    ),

}