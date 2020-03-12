# AWS Global Infrastructure JSII

This is a proof of concept using the [jsii][1] to generate a polyglot
library... one that is loosely based on the Java
[aws-global-infrastructure][2] helper.

We'll see how this goes...

## Examples

__JavaScript__
``` javascript
let infra = new GlobalInfrastructure();
let regions = infra.regions();
let services = infra.services();
```

__Java__
``` java
import me.philcali.aws.global.infrastructure.GlobalInfrastructure;

var infra = new GlobalInfrastructure();
infra.regions();
infra.services();
```

__Python__
``` python
import GlobalInfrastructure from me.philcali.aws_global_infrastructure

infra = new GlobalInfrastructure()
infra.regions()
infra.services()
```

## Iteration

One quirk right now is figuring out how to translate into iterators.

``` javascript
let { GlobalInfrastructure } = require('./lib/index');
let infra = new GlobalInfrastructure();

async function* all(thunk) {
  let nextToken = undefined;
  do {
    let result = await thunk(nextToken);
    nextToken = result.nextToken;
    for (let i = 0; i < result.items.length; i++) {
      yield result.items[i];
    }
  } while (typeof nextToken !== 'undefined');
}

async function iterateOnRegions() {
  const regions = all(infra.regions.bind(infra));
  for await (const region of regions) {
    const services = all(region.services.bind(region));
    let serviceList = [];
    for await (const service of services) {
      serviceList.push(service);
    }
    console.log(`Found ${serviceList.length} services in ${region.id()}`);
  }
}

async function iterateOnServices() {
  let limit = 10;
  const services = all(infra.services.bind(infra));
  for await (const service of services) {
    if (--limit == 0) {
      break;
    }
    const regions = all(service.regions.bind(service));
    let regionList = [];
    for await (const region of regions) {
      regionList.push(region);
    }
    console.log(`Found ${service.id()} is found in ${regionList.length} regions`);
  }
}

iterateOnRegions();
iterateOnServices();
```

While this is totally possible, it's not an ideal way to iterate on
unbounded data, and I would prefer to disguise this requirement to
all languages... more thought needs to be given to it.

[1]: https://github.com/aws/jsii
[2]: https://github.com/philcali/aws-global-infrastructure
