import * as cdk from "aws-cdk-lib"
import * as lambddaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"
import { Construct } from "constructs"

interface EcommerceApiStackProps extends cdk.StackProps {
    productsFetchHandler: lambddaNodeJS.NodejsFunction
    productsAdminHandler: lambddaNodeJS.NodejsFunction
    healthcheckHandler: lambddaNodeJS.NodejsFunction
}

export class EcommerceApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EcommerceApiStackProps){
        super(scope, id, props)
        
        const logGroup = new cwlogs.LogGroup(this, "EcommerceApiLogs")
        const api = new apigateway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi",
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        })
        const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)
        const healthcheckFetchIntegration = new apigateway.LambdaIntegration(props.healthcheckHandler)
        const productsAdminIntegration = new apigateway.LambdaIntegration(props.productsAdminHandler)

        // "GET /PRODUCTS"
        const productsResource = api.root.addResource("products")
        productsResource.addMethod("GET", productsFetchIntegration)
        // "GET /PRODUCTS/{id}"
        const productsIdResource = productsResource.addResource("{id}")
        productsIdResource.addMethod("GET", productsFetchIntegration)
        // "GET /HELTHCHECK"
        const healthcheck = api.root.addResource("healthcheck")
        healthcheck.addMethod("GET", healthcheckFetchIntegration)
        // POST / PRODUCTS
        productsResource.addMethod("POST", productsAdminIntegration)
        // PUT / PRODUCTS/{id}
        productsIdResource.addMethod("PUT", productsAdminIntegration)
        // DELETE / PRODUCTS/{id}
        productsIdResource.addMethod("DELETE", productsAdminIntegration)
    }
}