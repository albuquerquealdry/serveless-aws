import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

export class HealthcheckStack extends cdk.Stack {
    readonly HealthcheckHandler: lambdaNodeJS.NodejsFunction

    constructor(scope: Construct, id: string, porps?: cdk.StackProps){
        super(scope, id, porps)

        this.HealthcheckHandler = new lambdaNodeJS.NodejsFunction(this, "Healthcheck Fuction", {
            runtime: lambda.Runtime.NODEJS_16_X,
            functionName: "HealthCheck",
            entry: "lambda/products/healthcheck.ts",
            handler: "handler",
            memorySize: 128,
            timeout: cdk.Duration.seconds(5),
            bundling:{
                minify: true,
                sourceMap: false
            },
        })
    }
}