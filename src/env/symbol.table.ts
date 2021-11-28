import { BaseType } from './btype';

export class SymbolTable {
    
    store: { [key: string]: BaseType };
    outer: SymbolTable | null;
  
    constructor(outer: SymbolTable | null = null) {
      this.outer = outer;
      this.store = {};
    }
  
    get(name: string): BaseType | undefined {
      const value = this.store[name];
  
      if (!value && this.outer) {
        return this.outer.get(name);
      }
  
      return value;
    }
  
    set(name: string, value: BaseType): BaseType {
      this.store[name] = value;
      return value;
    }
}