import { Tracker } from "../tracker";
import { GetPropertyExpression } from "../expressions";
import { PropertyValuesStorage } from "./property-values.storage";
import { PresetExpressionResult } from "./preset-expression.result";
import { DefinedSetups } from "../defined-setups";
import { SpyFunctionProvider } from "./spy-function.provider";

export class GetInterceptor {
    private _prototype: any;

    constructor(
        private propertyValuesStorage: PropertyValuesStorage,
        private tracker: Tracker,
        private presetExpressionResult: PresetExpressionResult,
        private definedSetups: DefinedSetups<any>,
        private spyFunctionProvider: SpyFunctionProvider) {

    }

    public intercept(p: PropertyKey): any {
        const expression = new GetPropertyExpression(p);

        this.tracker.add(expression);

        if (this.propertyValuesStorage.has(p)) {
            return this.propertyValuesStorage.get(p);
        }

        if (this.definedSetups.hasSetupFor(expression)) {
            return this.presetExpressionResult.invoke(expression);
        }

        if (this.definedSetups.hasNamedMethod(p)) {
            return this.spyFunctionProvider.get();
        }

        if (this._prototype && this._prototype[p] instanceof Function) {
            return this.spyFunctionProvider.get();
        }

        return undefined;
    }

    public prototypeof(prototype: any): void {
        this._prototype = prototype;
    }
}
