## Uptech GrowthBook SDK Flutter Wrapper

This project is a thin wrapper around the [GrowthBook Flutter SDK](https://github.com/growthbook/growthbook) so that we
can use the [GrowthBook][] service to manage feature toggles while also being
able to manage toggle states properly within automated test suites.

## Development

Get dependencies

```
npm i
```

Run tests

```
npm test
```

## Setup

To set this up you need an account on [GrowthBook][] or to be hosting it
yourself.

Once you have an account and have setup your Project and the environments the
way you want. You need to get the read-only API key for each of the
environments and configure them in your app per environment.

Then you need to setup a singleton in your app to to house the shared instance
of the `UptechGrowthBookTypescriptWrapper`. *Note:* This is what needs the `apiKeyUrl` that
should come from your environment config and **not** be hard coded in your app.
This might look as follows maybe in a file called, `src/togls.ts`. It is
really up to you how you do this. This is just a suggestion.

```javascript
class Togls extends UptechGrowthBookTypescriptWrapper {
  static instance: Togls = new Togls(
        // In GrowthBook dashboard > SDK Endpoints url: https://cdn.growthbook.io/api/features/dev_Y1WwxOm9sDnIsO1DLvwJk76z3ribr3VoiTsaOs?project=prj_29g61lbb6s8290
        // Include the entire url above
        apiKeyUrl: 'your-api-key-url', 
  );
}
```

Once you have the `Togls` class you have two options for initializing the
library. One you can do in `main.ts` as follows.

```javascript
import express from "express";
const app = express();
const port = 8080; // default port to listen

// ...

app.listen( port, () => {
    Togls.instance.init(
		seeds: {
		  'example-toggle-higher-fee': false,
		},
	);
} );

// ...
```

In the above examples we provide `seeds` which are values that are used to
evaulate the toggles prior to it having fetched the toggles from the remote
server. In the happy path this window of time is extremely small to the point
where you won't even notice these values. However, in the case that user
launched the app and the network connection is not working or the GrowthBook
service was down then the toggles would evaluate to the value specified in the
`seeds`.

## Usage

Once you have it setup you are ready to start using it. The following examples
assume that you followed the suggestion above in terms of creating the
singleton. If you did something different you should still be able to use these
as rough examples of how to evaluate a feature and how to control toggles in
automated tests.


### Evaluate Feature

```javascript
import { Togls } from 'yourproject/togls.ts';

sampleApplyFee(amount: number): number {
  if (Togls.instance.isOn('example-toggle-higher-fee')) {
    return amount + 20;
  } else {
    return amount + 10;
  }
}
```
### Control toggles in automated tests

```javascript
import { sampleApplyFee } from 'yourproject/toggle_samples.ts';
import { Togls } from 'yourproject/togls.ts';

  describe('Toggle Samples', () {
    describe('sampleApplyFee', () {
      describe('when example-toggle-higher-fee is off', () {
        beforeEach(() {
          Togls.instance
              .initForTests(seeds: {'example-toggle-higher-fee': false});
        });

       it('returns amount with fee of 10 added', () {
          const res = sampleApplyFee(2);
          expect(res).toEqual(12);
        });
      });

      describe('when example-toggle-higher-fee is on', () {
        beforeEach(() {
          Togls.instance.initForTests(seeds: {'example-toggle-higher-fee': true});
        });

        it('returns amount with fee of 20 added', () {
          const res = sampleApplyFee(2);
          expect(res).toEqual(22);
        });
      });
    });
  });
```

[GrowthBook Javascript SDK]: https://github.com/growthbook/growthbook
[GrowthBook]: https://www.growthbook.io
