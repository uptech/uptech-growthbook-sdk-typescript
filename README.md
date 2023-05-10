## Uptech GrowthBook SDK Wrapper

This project is a thin wrapper around the [GrowthBook SDK](https://github.com/growthbook/growthbook) so that we
can use the [GrowthBook][] service to manage feature toggles while also being
able to manage toggle states properly within automated test suites.

## Install

```
npm i @uptechworks/uptech-growthbook-sdk-typescript
```

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
of the `UptechGrowthBookTypescriptWrapper`. _Note:_ This is what needs the `apiKeyUrl` that
should come from your environment config and **not** be hard coded in your app.
This might look as follows maybe in a file called, `src/togls.ts`. It is
really up to you how you do this. This is just a suggestion.

```javascript
class Togls extends UptechGrowthBookTypescriptWrapper {
  // In GrowthBook dashboard > SDK Endpoints url: https://cdn.growthbook.io/api/features/dev_Y1WwxOm9sDnIsO1DLvwJk76z3ribr3VoiTsaOs?project=prj_29g61lbb6s8290
  // Include the entire url
  static instance: Togls = new Togls("your-api-key-url");
}
```

Once you have the `Togls` class you have two options for initializing the
library. One you can do in `main.ts` as follows.

```javascript
import express from "express";
const app = express();
const port = 8080; // default port to listen

// ...

app.listen(port, () => {
  Togls.instance.init({
    seeds: new Map([["example-toggle-higher-fee", false]]),
  });
});

// ...
```

In the above examples we provide `seeds` which are values that are used to
evaulate the toggles prior to it having fetched the toggles from the remote
server. In the happy path this window of time is extremely small to the point
where you won't even notice these values. However, in the case that user
launched the app and the network connection is not working or the GrowthBook
service was down then the toggles would evaluate to the value specified in the
`seeds`.

### Adding overrides

If you want to overrides, you have two options. First, you can add them to the init call:

```javascript
// ...

app.listen(port, () => {
  Togls.instance.init({
    seeds: new Map([["example-toggle-higher-fee", false]]),
    overrides: new Map([["example-toggle-higher-fee", true]]),
  });
});

// ...
```

Alternatively, you can add override values to your `.env` file for specific features in Growthbook. With this method, overrides do not need to be passed into the init method. To ensure that your overrides perform as intended, please use `UPPER_CASE_SNAKE_CASE` with `TOGL_` appended to the beginning
Example: `example-toggle-higher-fee` becomes `TOGL_EXAMPLE_TOGGLE_HIGHER_FEE`

### Adding attributes

If you want to add attributes at itialization, you can add values into the `attributes` key in the init function. This is useful if, for instance, you are only allowing certain versions of your app to access a feature.

```javascript
// ...

app.listen( port, () => {
    const version = getVersionNumber(); // this is a method you create and provide the logic for
    Togls.instance.init({
		  seeds:  new Map([['example-toggle-higher-fee', false]]),
      overrides:  new Map([['example-toggle-higher-fee', true]]),
      attributes: attributes: new Map([['version', version]]),
	});
});

// ...
```

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

### Evaluate Feature value

```javascript
import { Togls } from 'yourproject/togls.ts';

sampleApplyFee(amount: number): number {
  // Note: feature value can be of any type
  const featureValue = Togls.instance.value('example-toggle-higher-fee');
  if (featureValue != 0) {
    return amount + 20;
  } else {
    return amount + 10;
  }
}
```

### Set attributes

Additional attributes can be set after initialization. This is a common use case in which an id attribute is set after user login (useful for canary testing).

```javascript
import { Togls } from 'yourproject/togls.ts';
sampleLogIn(): void {
  const userId = await login(); // Fake method that logs in user and gets user id
  Togls.instance.setAttributes(new Map([['id', userId]]));
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
              .initForTests({
                seeds:  new Map([['example-toggle-higher-fee', false]]),
              });
        });

       it('returns amount with fee of 10 added', () {
          const res = sampleApplyFee(2);
          expect(res).toEqual(12);
        });
      });

      describe('when example-toggle-higher-fee is on', () {
        beforeEach(() {
          Togls.instance.initForTests({
            seeds:  new Map([['example-toggle-higher-fee', true]]),
          });
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
