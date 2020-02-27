# AWS Global Infrastructure JSII

This is a proof of concept using the [jsii][1] to generate a polyglot
library... one that is loosely based on the Java
[aws-global-infrastructure][2] helper.

We'll see how this goes...

## Examples

__JavaScript__
``` javascript
let infra = new GlobalInfrastructure();
let result = infra.regions();
```

__Java__
``` java
import me.philcali.aws.global.infrastructure.GlobalInfrastructure;

var infra = new GlobalInfrastructure();
infra.regions();
```

__Python__
``` python
import GlobalInfrastructure from me.philcali.aws_global_infrastructure

infra = new GlobalInfrastructure()
infra.regions()
```

## Iteration

One quirk right now is figuring out how to translate into iterators.

``` javascript
let { GlobalInfrastructure } = require('./lib/index');
let infra = new GlobalInfrastructure();

async function* allRegions() {
  let nextToken = undefined;
  do {
    let result = await infra.regions(nextToken);
    nextToken = result.nextToken;
    for (let i = 0; i < result.regions.length; i++) {
      yield result.regions[i];
    }
  } while (typeof nextToken !== 'undefined');
}

async function iterate() {
  const regions = allRegions();
  for await (const region of regions) {
    console.log(region.id());
  }
}

iterate();
```

While this is totally possible, it's not an ideal way to iterate on
unbounded data, and I would prefer to disguise this requirement to
all languages... more thought needs to be given to it.

[1]: https://github.com/aws/jsii
[2]: https://github.com/philcali/aws-global-infrastructure
