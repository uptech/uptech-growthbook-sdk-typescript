import { UptechGrowthBookTypescriptWrapper } from './uptech-growthbook-wrapper';

describe("Uptech Growthbook Wrapper", () => {
  // A test we can use to do a full integration when testing
  it("successfully fetches a real feature from the real service", async () => {
    const instance = new UptechGrowthBookTypescriptWrapper('https://cdn.growthbook.io', 'sdk-rcGyvixKw6PHXQ24');
    await instance.init({ seeds: new Map<string, any>([["my-feature", false], ["my-value-feature", "bar"]]) })

    expect(instance.isOn("my-feature")).toEqual(true);
    expect(instance.value("my-value-feature")).toEqual("foo");
  });

  it("successfully fetches a real remote config value from the real service", async () => {
    const instance = new UptechGrowthBookTypescriptWrapper('https://cdn.growthbook.io', 'sdk-rcGyvixKw6PHXQ24');
    await instance.init({ seeds: new Map<string, any>([["my-feature", false], ["my-value-feature", "bar"]]) })

    expect(instance.value("my-value-feature")).toEqual("foo");
  });
});
