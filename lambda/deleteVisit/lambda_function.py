import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Extract 'phoneAndPatientName' and 'visitDate' from the event
    phone_and_patient_name = event['phoneAndPatientName']
    visit_date = event['visitDate']

    # Specify the table
    table = dynamodb.Table('visit')

    # Delete the specified item
    response = table.delete_item(
        Key={
            'phoneAndPatientName': phone_and_patient_name,
            'visitDate': visit_date
        }
    )

    return {
        'statusCode': 200,
        'body': json.dumps(f'Successfully deleted item: {phone_and_patient_name} - {visit_date}')
    }

