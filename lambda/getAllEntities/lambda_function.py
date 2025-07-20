import json
import boto3

def lambda_handler(event, context):
    
    entity = event['entity']
    
    # create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    
    # get the doctorTable
    table = dynamodb.Table(entity)
    
    # scan the table to retrieve all items/rows
    response = table.scan()
    
    # print each item/row
    for item in response['Items']:
        print(item)

    # Return the results as JSON
    return {
        'statusCode': 200,
        'body': json.dumps(response['Items'])
    }