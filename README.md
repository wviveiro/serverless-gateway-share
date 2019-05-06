# Share endpoint between multiple services in Serverless

After following the example in https://github.com/serverless/serverless/blob/master/docs/providers/aws/events/apigateway.md#share-api-gateway-and-api-resources I noticed my project was returning the error `The specified provider "undefined" does not exist.`.

To fix the problem above, the following has to be done:

1. Main `serverless.yml`. Used to create the Gateway that will be shared among multiple services:

```yml
service: myservice-gateway # This service will create a gateway resource to be used among other services

#####
# Provider is to be used as per usual.
#####
provider:
  name: aws
  runtime: nodejs8.10
  stage: dev
  region: ap-southeast-2

#####
# Here is the new part:
#####
resources:
  Resources:
    MyGatewayName: # Custom name, use whatever you want.
      Type: AWS::ApiGateway::RestApi # Keep this line as it is.
      Properties:
        Name: MyGatewayName # Same custom name used before.

  Outputs:
    apiGatewayRestApiId:
      Value:
        Ref: MyGatewayName # Same custom name used before.
      Export:
        Name: MyGatewayName-restApiId # Name of the output of your restApiId.

    apiGatewayRestApiRootResourceId:
      Value:
        Fn::GetAtt:
          - MyGatewayName # Same custom name used before.
          - RootResourceId # Keep this line as it is.
      Export:
        Name: MyGatewayName-rootResourceId # Name of the output of your rootResourceId
```

The `MyGatewayName-restApiId` and `MyGatewayName-rootResourceId` will be used to set the other services.

2. Service that will use the main gateway:

```yml
service: myservice-a # custom name of my service

#####
# That is the part that is different from the example in 
# https://github.com/serverless/serverless/blob/master/docs/providers/aws/events/apigateway.md#share-api-gateway-and-api-resources
#
# The provider name, runtime and region HAS TO BE SET.
#####
provider:
  name: aws
  runtime: nodejs8.10
  stage: dev
  region: ap-southeast-2 # The region has to be the same of the main service.
  apiGateway:
    restApiId:
      'Fn::ImportValue': MyGatewayName-restApiId # Name of your restApiId set on the main service
    restApiRootResourceId:
      'Fn::ImportValue': MyGatewayName-rootResourceId # Name of your rootResourceId set on the main service

#####
# Functions as per usual.
#####
functions:
  ...
```

Do the same as above for all services sharing the same gateway and you are done!
