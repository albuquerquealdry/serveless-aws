import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent, context: Context ): Promise<APIGatewayProxyResult> {
    // DADOS DE ENTRADA DE REQUISIÇÃO
    const lambdaRequestId = context.awsRequestId
    const apiRequestId = event.requestContext.requestId
    const method = event.httpMethod
    

    console.log(`API Gateway RequestId: ${apiRequestId} -  Lambda RequestId: ${lambdaRequestId}`)
    
    if(event.resource === "/healthcheck"){
        if(method === 'GET'){

            console.log('GET')
            return{
                statusCode: 200,
                body: JSON.stringify({
                    "message": "OK"
                })
            }
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Bad Request"
        })
    }
}