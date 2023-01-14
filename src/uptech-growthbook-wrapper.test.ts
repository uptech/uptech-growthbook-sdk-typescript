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

        describe('when the attribute is added on init', () => {
          const instance = new UptechGrowthBookTypescriptWrapper('https://cdn.growthbook.io/api/features/dummy-api-key');
          describe('and the major in the attribute is greater than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                rules: [{
                  'condition': {
                    'version': {'$gt': '1.0.0'}
                  },
                  'force': true
                }],
                attributes: new Map<string, any>().set('version', '1.0.1'),
              });
            });
            it('returns true', () => {
              expect(instance.isOn('some-feature-name')).toEqual(true);
            });
          });

          describe('and the minor in the attribute is greater than the rules', () => {
              beforeEach(() => {
                instance.initForTests({
                  seeds: new Map<string, any>().set('some-feature-name', false),
                  rules: [{
                    'condition': {
                      'version': {'$gt': '1.0.1'}
                    },
                    'force': true
                  }],
                  attributes: new Map<string, any>().set('version', '1.1.0'),
                });
              });
  
            it('returns true', () => {
              expect(instance.isOn('some-feature-name')).toEqual(true);
            });
          });

          describe('and the patch in the attribute is greater than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                rules: [{
                  'condition': {
                    'version': {'$gt': '1.0.1'}
                  },
                  'force': true
                }],
                attributes: new Map<string, any>().set('version', '1.0.9'),
              });
            });

          it('returns true', () => {
            expect(instance.isOn('some-feature-name')).toEqual(true);
          });
        });

          describe('and the major in the attribute is less than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                attributes: new Map<string, any>().set('version', '0.0.9'),
                'rules': [{
                  'condition': {
                    'version': {'$gt': '1.0.0'}
                  },
                  'force': true
                }],
              });
            });
  
            it('returns false', () => {
              expect(instance.isOn('some-feature')).toEqual(false);
            });
          });

          describe('and the minor in the attribute is less than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                attributes: new Map<string, any>().set('version', '1.0.9'),
                'rules': [{
                  'condition': {
                    'version': {'$gt': '1.1.0'}
                  },
                  'force': true
                }],
              });
            });
  
            it('returns false', () => {
              expect(instance.isOn('some-feature')).toEqual(false);
            });
          });

          describe('and the patch in the attribute is less than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                attributes: new Map<string, any>().set('version', '1.0.1'),
                'rules': [{
                  'condition': {
                    'version': {'$gt': '1.0.2'}
                  },
                  'force': true
                }],
              });
            });
  
            it('returns false', () => {
              expect(instance.isOn('some-feature')).toEqual(false);
            });
          });
        });
    });
  });
