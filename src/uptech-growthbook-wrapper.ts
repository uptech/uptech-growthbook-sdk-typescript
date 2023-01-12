import { FeatureDefinition, GrowthBook } from "@growthbook/growthbook";

export class UptechGrowthBookTypescriptWrapper {
    constructor(apiUrl: string) {
        this.url = apiUrl;
    }
    private client: GrowthBook;
    private readonly url: string;

    public async init(seeds?: any): Promise<void> {
        this.client = this.createClient(seeds);
        const growthbookResult = await fetch(this.url)
        const growthbook = await growthbookResult.json();
        this.client.setFeatures(growthbook.features);
    }

    public initForTests(seeds: any): void {
        this.client = this.createClient(seeds);
    }

    /// Check if a feature is on/off
    public isOn(featureId: string): boolean {
      return this.client.feature(featureId).on ?? false;
    }

    private createClient(seeds: Record<string, any>): GrowthBook {
        return new GrowthBook({
            enabled: true,
            qaMode: false,
            trackingCallback: (gbExperiment, gbExperimentResult) => {},
            features: this.seedsToGBFeatures(seeds),
        });
    }
    private seedsToGBFeatures(seeds: Record<string, any>): Record<string, FeatureDefinition> {
        const features = {};
        for (const key in seeds) {
            features[key] = { defaultValue: seeds[key] };
        }
        return features;
    }
}
