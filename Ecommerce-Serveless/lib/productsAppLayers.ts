import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as ssm from "aws-cdk-lib/aws-ssm"

export class ProductsAppLayersStack extends cdk.Stack {
    readonly productsLayers: lambda.LayerVersion

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope,id,props)

        const productsLayers =  new lambda.LayerVersion(this, "ProductsLayer", {
            code:  lambda.Code.fromAsset('lambda/products/layers/productsLayer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            layerVersionName: "ProductsLayer",
            removalPolicy: cdk.RemovalPolicy.DESTROY
        })

        new ssm.StringParameter(this, "ProductsLayerVersionArn", {
            parameterName: "ProductsLayerVersionArn",
            stringValue: productsLayers.layerVersionArn
        })

        const productsEventsLayers =  new lambda.LayerVersion(this, "ProductsEventsLayers", {
            code:  lambda.Code.fromAsset('lambda/products/layers/productsEventsLayers'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            layerVersionName: "ProductsEventsLayers",
            removalPolicy: cdk.RemovalPolicy.DESTROY
        })

        new ssm.StringParameter(this, "ProductsEventsLayersArn", {
            parameterName: "ProductsLayerVersionArn",
            stringValue: productsEventsLayers.layerVersionArn
        })
    }
}