import { Mock } from "../lib/mock";
import { It } from "../lib/expected-expressions/expression-predicates";
import { MockBehavior } from "../lib/interceptor-callbacks/interceptor-callbacks";

describe("Mimics preset", () => {
    it("Mimics property read interaction", () => {
        const value = 0;

        class Origin {
            public property: number = value;
        }

        const mock = new Mock<Origin>()
            .setBehaviorStrategy(MockBehavior.Loose)
            .setup(instance => instance.property)
            .mimics(new Origin())
            .object();

        const actual = mock.property;
        expect(actual).toBe(value);
    });

    it("Mimics property read interaction with readonly property", () => {
        const value = 0;

        class Origin {
            public get property() {
                return value;
            }
        }

        const mock = new Mock<Origin>()
            .setBehaviorStrategy(MockBehavior.Loose)
            .setup(instance => instance.property)
            .mimics(new Origin());

        const actual = mock.object().property;
        expect(actual).toBe(value);
        mock.verify(instance => instance.property);
    });

    it("Mimics property set interaction", () => {
        const value = 0;

        class Origin {
            public property: number;
        }

        const origin = new Origin();
        const mock = new Mock<Origin>()
            .setBehaviorStrategy(MockBehavior.Loose)
            .setup(instance => {
                instance.property = It.IsAny();
            })
            .mimics(origin);

        const actual = mock.object().property = value;
        expect(actual).toBe(value);
        expect(origin.property).toBe(value);
        expect(mock.object().property).toBe(value);
        mock.verify(instance => instance.property = 0);
    });

    it("Mimics instance method interaction", () => {
        const value = 2;

        class Origin {
            private property = value;

            public method(input: number): number {
                return input * this.property;
            }
        }

        const origin = new Origin();
        const mock = new Mock<Origin>()
            .setBehaviorStrategy(MockBehavior.Loose)
            .setup(instance => instance.method(2))
            .mimics(origin);

        const actual = mock.object().method(2);
        expect(actual).toBe(4);
        mock.verify(instance => instance.method);
        mock.verify(instance => instance.method(2));
    });

    it("Mimics method interaction", () => {
        const value = 2;

        function origin(input: number): number {
            return input * value;
        }

        const mock = new Mock<typeof origin>()
            .setBehaviorStrategy(MockBehavior.Loose)
            .setup(instance => instance(2))
            .mimics(origin);

        const actual = mock.object()(2);
        expect(actual).toBe(4);
        mock.verify(instance => instance(2));
    });

    it("Mimics all interactions with instance method", () => {
        const value = 2;

        class Origin {
            private property = value;

            public method(input: number): number {
                return input * this.property;
            }
        }

        const origin = new Origin();
        const mock = new Mock<Origin>()
            .setBehaviorStrategy(MockBehavior.Loose)
            .setup(() => It.IsAny())
            .mimics(origin);

        const actual = mock.object().method(2);
        expect(actual).toBe(4);
        mock.verify(instance => instance.method(2));
    });

    it("Mimics all interactions with property read", () => {
        const value = 2;

        class Origin {
            public property = value;
        }

        const origin = new Origin();
        const mock = new Mock<Origin>()
            .setBehaviorStrategy(MockBehavior.Loose)
            .setup(() => It.IsAny())
            .mimics(origin);

        const actual = mock.object().property;
        expect(actual).toBe(2);
    });

    it("Mimics all interactions with property set", () => {
        const value = 2;

        class Origin {
            public property = value;
        }

        const origin = new Origin();
        const mock = new Mock<Origin>()
            .setBehaviorStrategy(MockBehavior.Loose)
            .setup(() => It.IsAny())
            .mimics(origin);

        const actual = mock.object().property = 4;
        expect(actual).toBe(4);
        expect(origin.property).toBe(4);
        mock.verify(instance => instance.property = 4);
    });
});
