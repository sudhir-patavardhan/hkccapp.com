import json
import boto3

def lambda_handler(event, context):
    # create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    phone = event["phone"]
    doctorName = event["doctorName"]
    
    
    # get the doctorTable
    table = dynamodb.Table('doctor')
    table.load()
    
    # Define the filter expression with an inline placeholder
    filter_expression = 'phone = :phone and contains(doctorName, :doctorName) '
    
    # scan the table 
    response = table.scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues={
            ':phone': phone,
            ':doctorName': doctorName
        }
    )
    
    # print each item/row
    for item in response['Items']:
        print(item)
        
    # Return the results as JSON
    return {
        'statusCode': 200,
        'body': json.dumps(response['Items'])
    }