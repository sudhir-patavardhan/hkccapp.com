import json
import boto3

def lambda_handler(event, context):
    # create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    #vaccineName = event["vaccineName"]
    
    
    # get the Table
    table = dynamodb.Table('vaccine')
    table.load()
    
    # Define the filter expression with an inline placeholder
    #filter_expression = 'contains(vaccineName, :vaccineName)'
    
    # scan the table 
    response = table.scan()
    
    # print each item/row
    for item in response['Items']:
        print(item)
        
    # Return the results as JSON
    return json.dumps(response['Items'])
