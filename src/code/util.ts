import { BoolT } from '../env/bool';
import { NullT } from '../env/null';

export const H_TYPES = {
    TRUE:  new BoolT(true),
    FALSE: new BoolT(false),
    NIL: new NullT()
}