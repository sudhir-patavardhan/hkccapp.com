import json
import boto3

def lambda_handler(event, context):
    
    # Parse the input data from the event object
    phone = event['phone']
    doctorName = event['doctorName']
    specialization = event['specialization']
    email = event['email']
    
    # Create a DynamoDB resource object
    dynamodb = boto3.resource('dynamodb')
    
    # Get a reference to the doctorTable table
    table = dynamodb.Table('doctor')
    
    # Insert the data into the table
    table.put_item(
        Item={
            'phone': phone,
            'doctorName': doctorName,
            'email': email,
            'specialization': specialization
        }
    )
    
    # Return a success message
    return {
        'statusCode': 200,
        'body': json.dumps('Data inserted successfully')
    }

