import { Tracker } from "../tracker";
import { GetPropertyExpression } from "../expressions";
import { PropertiesValueStorage } from "./properties-value.storage";
import { PresetExpressionResult } from "./preset-expression.result";
import { DefinedSetups } from "../defined-setups";
import { SpyFunctionProvider } from "./spy-function.provider";

/**
 * @hidden
 */
export class GetTrap {
    private _prototype: any;

    constructor(
        private propertiesValueStorage: PropertiesValueStorage,
        private tracker: Tracker,
        private presetExpressionResult: PresetExpressionResult,
        private definedSetups: DefinedSetups<any>,
        private spyFunctionProvider: SpyFunctionProvider) {

    }

    public intercept(property: PropertyKey): any {
        const expression = new GetPropertyExpression(property);

        this.tracker.add(expression);

        if (this.propertiesValueStorage.has(property)) {
            return this.propertiesValueStorage.get(property);
        }

        if (this.definedSetups.hasSetupFor(expression)) {
            return this.presetExpressionResult.invoke(expression);
        }

        if (this.definedSetups.hasNamedMethod(property)) {
            return this.spyFunctionProvider.get();
        }

        if (this._prototype && this._prototype[property] instanceof Function) {
            return this.spyFunctionProvider.get();
        }

        return undefined;
    }

    public prototypeof(prototype: any): void {
        this._prototype = prototype;
    }
}
