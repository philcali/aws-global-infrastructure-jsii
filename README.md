# AWS Global Infrastructure JSII

This is a proof of concept using the [jsii][1] to generate a polyglot
library... one that is loosely based on the Java
[aws-global-infrastructure][2] helper.

We'll see how this goes...

## Examples

__JavaScript__
```
let infra = new GlobalInfrastructure();
let result = infra.regions();
```

__Java__
```
import me.philcali.aws.global.infrastructure.GlobalInfrastructure;

var infra = new GlobalInfrastructure();
infra.regions();
```

__Python__
```
import GlobalInfrastructure from me.philcali.aws_global_infrastructure

infra = new GlobalInfrastructure()
infra.regions()
```

[1]: https://github.com/aws/jsii
[2]: https://github.com/philcali/aws-global-infrastructure
