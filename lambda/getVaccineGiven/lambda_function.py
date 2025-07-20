import json
import boto3

def lambda_handler(event, context):
    # create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    phone = event["phone"]
    patientName = event["patientName"]
    vaccineName = event["vaccineName"]
    
    
    # get the Table
    table = dynamodb.Table('vaccineGiven')
    table.load()
    
    # Define the filter expression with an inline placeholder
    filter_expression = 'contains(phoneAndPatientName, :phone) and contains(phoneAndPatientName, :patientName) and contains(vaccineNameAndDate, :vaccineName)'
    
    # scan the table 
    response = table.scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues={
            ':phone': phone,
            ':patientName': patientName,
            ':vaccineName': vaccineName
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


