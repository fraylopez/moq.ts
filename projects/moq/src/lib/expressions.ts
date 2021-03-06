export abstract class PropertyExpression {
    protected constructor(public name: PropertyKey) {

    }
}

/**
 * This class represents an expression tree node for invocation of a named function.
 * It provides access to the name of function and list of parameters.
 * @example
 * ```typescript
 *
 * const name = 'member_name';
 * const arg = 'argument';
 * const reflector = new ExpectedExpressionReflector();
 * const actual = reflector.reflect(instance => instance[name](arg));
 *
 * const expected = new ExpectedNamedMethodExpression(name, [arg]);
 * expect(actual).toEqual(expected);
 * ```
 */
export class NamedMethodExpression extends PropertyExpression {
    constructor(name: PropertyKey,
                public args: any[]) {
        super(name);
    }
}

/**
 * This class represents an expression tree node for invocation of a function.
 * It provides access to the list of parameters.
 * @example
 * ```typescript
 *
 * const arg = 'argument';
 * const reflector = new ExpectedExpressionReflector();
 * const actual = reflector.reflect<any>(instance => instance(arg));
 *
 * const expected = new ExpectedMethodExpression([arg]);
 * expect(actual).toEqual(expected);
 * ```
 */
export class MethodExpression {
    constructor(public args: any[]) {
    }
}

/**
 * This class represents an expression tree node for property accessing.
 * It provides access to the name of property.
 * @example
 * ```typescript
 *
 * const name = 'member_name';
 * const reflector = new ExpectedExpressionReflector();
 * const actual = reflector.reflect(instance => instance[name]);

 * const expected = new ExpectedGetPropertyExpression(name);
 * expect(actual).toEqual(expected);
 * ```
 */
export class GetPropertyExpression extends PropertyExpression {
    constructor(name: PropertyKey) {
        super(name);
    }
}

/**
 * This class represents an expression tree node for property write.
 * It provides access to the name of property and the value.
 * @example
 * ```typescript
 *
 * const name = 'member_name';
 * const arg = 'argument';
 * const reflector = new ExpectedExpressionReflector();
 * const actual = reflector.reflect(instance => {instance[name] = arg});
 *
 * const expected = new ExpectedSetPropertyExpression(name, arg);
 * expect(actual).toEqual(expected);
 * ```
 */
export class SetPropertyExpression extends PropertyExpression {
    constructor(name: PropertyKey,
                public value: any) {
        super(name);
    }
}

export type Expressions = MethodExpression | GetPropertyExpression | SetPropertyExpression | NamedMethodExpression;
