import cross_fetch from 'cross-fetch'
import {
  FeatureDefinition,
  GrowthBook,
  setPolyfills,
} from '@growthbook/growthbook'

setPolyfills({ fetch: cross_fetch });

export interface InitParameters {
  seeds?: Map<string, any>,
  overrides?: Map<string, any>,
  attributes?: Map<string, any>,
  rules?: Array<Record<string, any>>,
}

export class UptechGrowthBookTypescriptWrapper {
  constructor(apiHost: string, clientKey: string, getEnv: (key: string) => string | undefined = (key) => process.env[key]) {
    this.apiHost = apiHost;
    this.clientKey = clientKey;
    this.getEnv = getEnv;
  }
  private client: GrowthBook;
  private readonly apiHost: string;
  private readonly clientKey: string;
  private overrides: Map<string, any> = new Map();
  private attributes: Map<string, any> = new Map();
  private getEnv: (key: string) => string;

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
    await this.client.loadFeatures();
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
    await this.client.refreshFeatures()
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
      apiHost: this.apiHost,
      clientKey: this.clientKey,
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
