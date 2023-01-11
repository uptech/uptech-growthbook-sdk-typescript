import { UptechGrowthBookTypescriptWrapper } from './uptech-growthbook-wrapper';

class ToglTest extends UptechGrowthBookTypescriptWrapper {

  static instance: ToglTest = new ToglTest('https://cdn.growthbook.io/api/features/dummy-api-key');
}

describe("Uptech Growthbook Wrapper", () => {
    describe("isOn", () => {
        describe("when a feature value is present", () => {
          beforeEach(() => {
            ToglTest.instance.initForTests({
              'some-feature-name': true,
            });
          });
  
          it("should return true", () => {
              expect(ToglTest.instance.isOn('some-feature-name')).toEqual(true);
          });
        });

        describe("when a feature value is not present", () => {
          beforeEach(() => {
            ToglTest.instance.initForTests({
              'some-feature-name': true,
            });
          });
  
          it("should return true", () => {
              expect(ToglTest.instance.isOn('some-other-name')).toEqual(false);
          });
        });
    });
  });
