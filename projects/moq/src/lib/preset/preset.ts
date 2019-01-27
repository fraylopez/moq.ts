import { ExpectedExpressions, ExpectedNamedMethodExpression } from "./expected-expressions/expected-expressions";
import { ExpressionMatcher } from "./expression-matchers/expression-matcher";
import { Expressions } from "./expressions";
import { ISetupInvoke } from "./moq";

/**
 * @hidden
 */
export class Preset<T> {
    private setups: [ExpectedExpressions<T>, ISetupInvoke<T>][] = [];

    constructor(private expressionMatcher: ExpressionMatcher = new ExpressionMatcher()) {

    }

    public add(key: ExpectedExpressions<T>, setup: ISetupInvoke<T>): void {
        this.setups.unshift([key, setup]);
    }

    public get(expression: Expressions): ISetupInvoke<T> {
        for (const [key, value] of this.setups) {
            if (this.expressionMatcher.matched(expression, key) === true && value.playable()) {
                return value;
            }
        }

        return undefined;
    }

    public hasNamedMethod(name: PropertyKey): boolean {
        for (const [key] of this.setups) {
            if (key instanceof ExpectedNamedMethodExpression && (key as ExpectedNamedMethodExpression).name === name) {
                return true;
            }
        }

        return false;
    }

    public hasSetupFor(expression: Expressions): boolean {
        throw new Error("Not Implemented");
    }
}
