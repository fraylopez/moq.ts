import { Preset } from "../preset";
import {
    Expressions,
    GetPropertyExpression,
    MethodExpression,
    NamedMethodExpression,
    SetPropertyExpression
} from "../expressions";
import { Tracker } from "../tracker";
import { IInterceptorCallbacksStrategy } from "./interceptor-callbacks";
/**
 * @hidden
 */
export class InterceptorCallbacksLooseStrategy<T> implements IInterceptorCallbacksStrategy {

    constructor(private definedSetups: Preset<T>,
                private tracker: Tracker) {

    }

    public intercepted(expression: Expressions): void {
        this.tracker.add(expression);
    }

    public invoke(expression: Expressions): any {
        const setup = this.definedSetups.get(expression);
        if (setup !== undefined) {
            if (expression instanceof MethodExpression) {
                return setup.invoke((<MethodExpression>expression).args);
            }
            if (expression instanceof NamedMethodExpression) {
                return setup.invoke((<NamedMethodExpression>expression).args);
            }
            if (expression instanceof SetPropertyExpression) {
                return setup.invoke([(<SetPropertyExpression>expression).value]);
            }

            return setup.invoke();
        }
        return undefined;
    }

    public hasNamedMethod(methodName: string, prototype: any): boolean {
        const getPropertyExpression = new GetPropertyExpression(methodName);
        const setup = this.definedSetups.get(getPropertyExpression);
        return setup !== undefined ? false : true;
    }
}
