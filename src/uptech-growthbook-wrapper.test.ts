import { UptechGrowthBookTypescriptWrapper } from './uptech-growthbook-wrapper';



describe("Uptech Growthbook Wrapper", () => {

    describe("isOn", () => {
        describe("when a feature value is present", () => {
          const instance = new UptechGrowthBookTypescriptWrapper('https://cdn.growthbook.io/api/features/dummy-api-key');
          beforeEach(() => {
            instance.initForTests({
              seeds: new Map<string, any>().set('some-feature-name', true),
            });
          });
  
          it("should return true", () => {
              expect(instance.isOn('some-feature-name')).toEqual(true);
          });
        });

        describe("when a feature value is not present", () => {
          const instance = new UptechGrowthBookTypescriptWrapper('https://cdn.growthbook.io/api/features/dummy-api-key');
          beforeEach(() => {
            instance.initForTests({
              seeds: new Map<string, any>().set('some-feature-name', true),
            });
          });
  
          it("should return true", () => {
              expect(instance.isOn('some-other-name')).toEqual(false);
          });
        });

        describe('when an override is present', () => {
          const instance = new UptechGrowthBookTypescriptWrapper('https://cdn.growthbook.io/api/features/dummy-api-key');
          beforeEach(() => {
            instance.initForTests({
              overrides: new Map<string, any>().set('some-feature-name', true),
            });
          });
  
          it('returns the overridden value', () => {
            expect(instance.isOn('some-feature-name')).toEqual(true);
          });
        });

        describe('when a feature env is present', () => {
          let instance;
          beforeEach(() => {
            instance = new UptechGrowthBookTypescriptWrapper(
              'https://cdn.growthbook.io/api/features/dummy-api-key',
              (key) => 'true'
            );
            instance.initForTests({
              seeds: new Map<string, any>().set('some-feature-name', false),
            });
          });

          it('returns the overridden value', () => {
            expect(instance.isOn('some-feature-name')).toEqual(true);
          });
        });
  
    });
  });
