import json
import boto3

def lambda_handler(event, context):
    # create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    searchFor = event["searchFor"]

    
    
    # get the Table
    table = dynamodb.Table('patient')
    table.load()
    
    # Define the filter expression with an inline placeholder
    filter_expression = 'contains(phone, :searchFor) or contains(patientName, :searchFor) or contains(parentName, :searchFor)'
    
    # scan the table 
    response = table.scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues={
            ':searchFor': searchFor
        }
    )
    
    # print each item/row
    #for item in response['Items']:
    #    print(item)
        
    # Return the results as JSON
    #limited_items = response['Items'][:4]
    return json.dumps(response['Items'])
    

    
