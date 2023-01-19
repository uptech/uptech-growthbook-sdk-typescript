import { FeatureDefinition, GrowthBook } from "@growthbook/growthbook";
import fetch from 'cross-fetch';

interface InitParameters {
  seeds?: Map<string, any>,
  overrides?: Map<string, any>,
  attributes?: Map<string, any>,
  rules?: Array<Record<string, any>>,
}

export class UptechGrowthBookTypescriptWrapper {
  constructor(apiUrl: string, getEnv: (key: string) => string | undefined = (key) => process.env[key]) {
    this.url = apiUrl;
    this.getEnv = getEnv;
  }
  private client: GrowthBook;
  private readonly url: string;
  private overrides: Map<string, any> = new Map();
  private attributes: Map<string, any> = new Map();
  getEnv: (key: string) => string;

  public async init(
    { seeds, overrides, attributes }: InitParameters
  ): Promise<void> {
    this.overrides.clear();
    if (overrides != null) {
      this.overrides = overrides;
    }
    this.attributes.clear();
    if (attributes != null) {
      this.attributes = attributes;
    }
    this.client = this.createClient(seeds);
    await this.refresh();
  }

  public initForTests({ seeds, overrides, attributes, rules }: InitParameters
  ): void {
    this.overrides.clear();
    if (overrides != null) {
      this.overrides = overrides;
    }
    this.attributes.clear();
    if (attributes != null) {
      this.attributes = attributes;
    }
    this.client = this.createClient(seeds, rules);
  }

  /// Force a refresh of toggles from the server
  public async refresh(): Promise<void> {
    try {
      const growthbookResult = await fetch(this.url)
      const growthbook = await growthbookResult.json();
      this.client.setFeatures(growthbook.features);
    } catch (e) {
      console.log({
        message: 'Error while fetching features from GrowthBook',
        e
      });
    }
  }

  public setAttributes(attributes: Map<string, any>): void {
    this.client.setAttributes(this.getGBAttributes(attributes));
  }

  /// Check if a feature is on/off
  public isOn(featureId: string): boolean {
    const hasOverride = this.overrides.has(featureId);

    if (hasOverride) {
      const value = this.overrides.get(featureId);

      return Boolean(value);
    } else {
      const overrideKey = this.getOverrideKeyById(featureId);
      const featureOverride = this.getEnv(overrideKey);
      if (featureOverride != null && featureOverride != undefined) {
        return featureOverride == 'false' ? false : true;
      }
      return this.client.feature(featureId).on ?? false;
    }
  }

  /// Return the value of a feature.
  /// If the feature does not have a value configured, returns null.
  public value(featureId: string): any {
    const hasOverride = this.overrides.has(featureId);

    if (hasOverride) {
      return this.overrides.get(featureId);
    }

    return this.client.getFeatureValue(featureId, null);
  }

  private getOverrideKeyById(featureId: string): string {
    const togl = 'TOGL_'
    return togl + featureId.toLocaleUpperCase().replace(/-/g, '_')
  }

  private createClient(seeds: Map<string, any>, rules?: Array<Record<string, any>>): GrowthBook {
    return new GrowthBook({
      enabled: true,
      qaMode: false,
      trackingCallback: (gbExperiment, gbExperimentResult) => { },
      attributes: this.getGBAttributes(this.attributes),
      features: this.seedsToGBFeatures(seeds, rules),
    });
  }
  private seedsToGBFeatures(seeds: Map<string, any>, rules?: Array<Record<string, any>>): Record<string, FeatureDefinition> {
    if (seeds == null) {
      return {};
    }
    const features = {};
    seeds.forEach((value, key) => {
      features[key] = rules ? { defaultValue: value, rules } : { defaultValue: value };
    })
    return features;
  }

  private getGBAttributes(attributes: Map<string, any>): Record<string, any> {
    if (attributes == null) {
      return {};
    }
    const features = {};
    attributes.forEach((value, key) => {
      features[key] = value;
    })
    return features;
  }
}
