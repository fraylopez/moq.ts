import { Tracker } from "../tracker";
import { nameof } from "../nameof";
import { GetTrap } from "./get.trap";
import { GetPropertyExpression } from "../expressions";
import { PropertiesValueStorage } from "./properties-value.storage";
import { PresetExpressionResult } from "./preset-expression.result";
import { SpyFunctionProvider } from "./spy-function.provider";
import { Preset } from "../preset/preset";

describe("Get trap", () => {

    let preset: Preset<any>;
    let tracker: Tracker;
    let storage: PropertiesValueStorage;
    let presetExpressionResult: PresetExpressionResult;
    let spyFunctionProvider: SpyFunctionProvider;

    function trackerFactory(): Tracker {
        return <Tracker>jasmine.createSpyObj<Tracker>("tracker", [
            nameof<Tracker>("add"),
            nameof<Tracker>("get")
        ]);
    }

    function spyFunctionProviderFactory(): SpyFunctionProvider {
        return <SpyFunctionProvider>jasmine.createSpyObj("spyFunctionProvider", [
            nameof<Tracker>("get")
        ]);
    }

    function presetExpressionResultFactory(): PresetExpressionResult {
        return <PresetExpressionResult>jasmine.createSpyObj("preset expression result", [
            nameof<PresetExpressionResult>("invoke"),
        ]);
    }

    function propertyValuesStorage(): PropertiesValueStorage {
        return <PropertiesValueStorage>jasmine.createSpyObj("property values storage", [
            nameof<PropertiesValueStorage>("has"),
            nameof<PropertiesValueStorage>("get")
        ]);
    }

    function presetFactory(): Preset<any> {
        return <Preset<any>>jasmine.createSpyObj("preset", [
            nameof<Preset<any>>("add"),
            nameof<Preset<any>>("get"),
            nameof<Preset<any>>("hasNamedMethod"),
            nameof<Preset<any>>("hasSetupFor")
        ]);
    }

    function interceptorFactory(): GetTrap {
        tracker = trackerFactory();
        storage = propertyValuesStorage();
        preset = presetFactory();
        presetExpressionResult = presetExpressionResultFactory();
        spyFunctionProvider = spyFunctionProviderFactory();
        return new GetTrap(storage, tracker, presetExpressionResult, preset, spyFunctionProvider);
    }

    it("Tracks get property call", () => {
        const propertyName = "property name";

        const interceptor = interceptorFactory();
        interceptor.intercept(propertyName);

        expect(tracker.add).toHaveBeenCalledWith(new GetPropertyExpression(propertyName));
    });

    it("Returns value from property values storage", () => {
        const arg = "argument";
        const propertyName = "property name";

        const interceptor = interceptorFactory();
        (storage.has as jasmine.Spy).withArgs(propertyName).and.returnValue(true);
        (storage.get as jasmine.Spy).withArgs(propertyName).and.returnValue(arg);

        const actual = interceptor.intercept(propertyName);

        expect(actual).toBe(arg);
    });

    it("Returns value from property read configuration", () => {
        const arg = "argument";
        const propertyName = "property name";

        const interceptor = interceptorFactory();
        (storage.has as jasmine.Spy).withArgs(propertyName).and.returnValue(false);
        (preset.hasSetupFor as jasmine.Spy).withArgs(new GetPropertyExpression(propertyName)).and.returnValue(true);
        (presetExpressionResult.invoke as jasmine.Spy).withArgs(new GetPropertyExpression(propertyName)).and.returnValue(arg);

        const actual = interceptor.intercept(propertyName);

        expect(actual).toBe(arg);
    });

    it("Returns spy function from invoke method configuration", () => {
        const propertyName = "property name";
        const spy = () => undefined;

        const interceptor = interceptorFactory();
        (storage.has as jasmine.Spy).withArgs(propertyName).and.returnValue(false);
        (preset.hasSetupFor as jasmine.Spy).withArgs(new GetPropertyExpression(propertyName)).and.returnValue(false);
        (preset.hasNamedMethod as jasmine.Spy).withArgs(propertyName).and.returnValue(true);
        (spyFunctionProvider.get as jasmine.Spy).and.returnValue(spy);

        const actual = interceptor.intercept(propertyName);

        expect(actual).toBe(spy);
    });

    it("Returns spy function from prototype", () => {
        class Prototype {
            public method() {
                throw new Error("Not Implemented");
            }
        }

        const propertyName = nameof<Prototype>("method");
        const spy = () => undefined;

        const interceptor = interceptorFactory();
        (storage.has as jasmine.Spy).withArgs(propertyName).and.returnValue(false);
        (preset.hasSetupFor as jasmine.Spy).withArgs(new GetPropertyExpression(propertyName)).and.returnValue(false);
        (preset.hasNamedMethod as jasmine.Spy).withArgs(propertyName).and.returnValue(false);
        (spyFunctionProvider.get as jasmine.Spy).and.returnValue(spy);

        interceptor.prototypeof(Prototype.prototype);
        const actual = interceptor.intercept(propertyName);

        expect(actual).toBe(spy);
    });

    it("Returns undefined when prototype has property with type other then Function", () => {
        class Prototype {
            public method = "value";
        }

        const propertyName = nameof<Prototype>("method");
        const spy = () => undefined;

        const interceptor = interceptorFactory();
        (storage.has as jasmine.Spy).withArgs(propertyName).and.returnValue(false);
        (preset.hasSetupFor as jasmine.Spy).withArgs(new GetPropertyExpression(propertyName)).and.returnValue(false);
        (preset.hasNamedMethod as jasmine.Spy).withArgs(propertyName).and.returnValue(false);
        (spyFunctionProvider.get as jasmine.Spy).and.returnValue(spy);

        interceptor.prototypeof(new Prototype());
        const actual = interceptor.intercept(propertyName);

        expect(actual).toBeUndefined();
    });

    it("Returns undefined when prototype does not have method", () => {
        class Prototype {
        }

        const propertyName = "property name";
        const spy = () => undefined;

        const interceptor = interceptorFactory();
        (storage.has as jasmine.Spy).withArgs(propertyName).and.returnValue(false);
        (preset.hasSetupFor as jasmine.Spy).withArgs(new GetPropertyExpression(propertyName)).and.returnValue(false);
        (preset.hasNamedMethod as jasmine.Spy).withArgs(propertyName).and.returnValue(false);
        (spyFunctionProvider.get as jasmine.Spy).and.returnValue(spy);

        interceptor.prototypeof(Prototype.prototype);
        const actual = interceptor.intercept(propertyName);

        expect(actual).toBeUndefined();
    });
});
