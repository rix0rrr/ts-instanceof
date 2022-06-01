/**
 * The symbol we're going to use to tag onto the class, use an unlikely but stable name
 *
 * We must use `Symbol.for()` instead of `Symbol()` since there may be multiple copies
 * of this library.
 */
const TYPE_TAGGING_SYMBOL = Symbol.for('$ts-instanceof:name');

/**
 * The type of a function that will assert that x is of type A
 */
export type TypePredicate<A> = (x: unknown, ...requiredMembers: Array<keyof A>) => x is A;

/**
 * Customization options for the makeInstanceOf function
 */
export interface MakeInstanceOfOptions {
  /**
   * A name to associate with this type.
   *
   * Will be derived from the constructor name if missing.
   */
  readonly typeName?: string;
}

/**
 * Tag the given class (constructor) with a type field and return a predicate that will test for that type
 *
 * @param constructor The class or constructor to annotate
 * @param namespace The namespace we will use to distinguish different libraries (recommended: NPM package name).
 * @param options Options for the makeInstanceOf operation
 */
export function makeInstanceOf<A>(constructor: new (...args: any[]) => A, namespace: string, options: MakeInstanceOfOptions = {}): TypePredicate<A> {
  const fqn = `${namespace}:${options.typeName ?? constructor.name}`;

  if (constructor.prototype[TYPE_TAGGING_SYMBOL]) {
    throw new Error(`${constructor.name} has already been tagged with a type name before: ${constructor.prototype[TYPE_TAGGING_SYMBOL]}`);
  }

  Object.defineProperty(constructor.prototype, TYPE_TAGGING_SYMBOL, {
    value: fqn,
    configurable: false,
    enumerable: false,
    writable: false,
  });

  return (x: any, ...requiredMembers: Array<keyof A>): x is A => {
    if (!x || typeof x !== 'object' || x[TYPE_TAGGING_SYMBOL] !== fqn) { return false; }
    if (!(requiredMembers ?? []).every(m => !!x[m])) { return false; }
    return true;
  };
}