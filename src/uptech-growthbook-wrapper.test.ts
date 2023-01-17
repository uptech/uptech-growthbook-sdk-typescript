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

        describe('when the attribute is added after init', () => {
          const instance = new UptechGrowthBookTypescriptWrapper('https://cdn.growthbook.io/api/features/dummy-api-key');
          describe('and the major in the attribute is greater than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                'rules': [{
                  'condition': {
                    'version': {'$gt': '1.0.0'}
                  },
                  'force': true
                }],
              });
              instance.setAttributes(new Map<string, any>().set('version', '2.0.1'));
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
                });
                instance.setAttributes(new Map<string, any>().set('version', '1.1.0'));
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
              });
              instance.setAttributes(new Map<string, any>().set('version', '1.0.9'));
            });

          it('returns true', () => {
            expect(instance.isOn('some-feature-name')).toEqual(true);
          });
        });

          describe('and the major in the attribute is less than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                'rules': [{
                  'condition': {
                    'version': {'$gt': '1.0.0'}
                  },
                  'force': true
                }],
              });
              instance.setAttributes(new Map<string, any>().set('version', '0.0.9'));
            });
  
            it('returns false', () => {
              expect(instance.isOn('some-feature')).toEqual(false);
            });
          });

          describe('and the minor in the attribute is less than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                'rules': [{
                  'condition': {
                    'version': {'$gt': '1.1.0'}
                  },
                  'force': true
                }],
              });
              instance.setAttributes(new Map<string, any>().set('version', '1.0.9'));
            });
  
            it('returns false', () => {
              expect(instance.isOn('some-feature')).toEqual(false);
            });
          });

          describe('and the patch in the attribute is less than the rules', () => {
            beforeEach(() => {
              instance.initForTests({
                seeds: new Map<string, any>().set('some-feature-name', false),
                'rules': [{
                  'condition': {
                    'version': {'$gt': '1.0.2'}
                  },
                  'force': true
                }],
              });
              instance.setAttributes(new Map<string, any>().set('version', '1.0.1'));
            });
  
            it('returns false', () => {
              expect(instance.isOn('some-feature')).toEqual(false);
            });
          });
        });
    });

    describe('value', () => {
      const instance = new UptechGrowthBookTypescriptWrapper('https://cdn.growthbook.io/api/features/dummy-api-key');
      const features = new Map<string, any>();
        features.set('string-value-feature', 'value')
        features.set('int-value-feature', 1)
        features.set('bool-value-feature', true)
      describe('when no value is found for the feature', () => {
        
        beforeEach(() => {
          instance.initForTests({seeds: features});
        });

        it('returns null', () => {
          expect(instance.value('some-other-feature')).toEqual(null);
        });
      });

      describe('when a feature value is present', () => {
        beforeEach(() => {
          instance.initForTests({seeds: features});
        });

        it('returns the feature value', () => {
          expect(
              instance.value('string-value-feature')).toEqual('value');
          expect(instance.value('int-value-feature')).toEqual(1);
          expect(instance.value('bool-value-feature')).toEqual(true);
        });
      });

      describe('when an override is present', () => {
        beforeEach(() => {
          instance.initForTests({overrides: features});
        });

        it('returns the overridden value', () => {
          expect(
            instance.value('string-value-feature')).toEqual('value');
        expect(instance.value('int-value-feature')).toEqual(1);
        expect(instance.value('bool-value-feature')).toEqual(true);
        });
      });
    });

});
