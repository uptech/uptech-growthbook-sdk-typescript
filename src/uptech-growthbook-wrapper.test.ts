import { UptechGrowthBookTypescriptWrapper } from "./uptech-growthbook-wrapper";

describe("Uptech Growthbook Wrapper", () => {
    describe("isAwesome", () => {
        it("should return true", () => {
            const wrapper = new UptechGrowthBookTypescriptWrapper()
            expect(wrapper.isAwesome).toEqual(true);
          });
    });
  });
