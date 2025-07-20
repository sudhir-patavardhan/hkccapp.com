import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'appointments'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    
    patient_phone = event['pathParameters']['patientPhone']
    
    try:
        response = table.scan(
            FilterExpression='patientPhone = :phone_number',
            ExpressionAttributeValues={
                ':phone_number': patient_phone
            }
        )
        if response['Count'] == 0:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Cannot find appointment with given patient phone number'})
            }
            
        appointments = response['Items']
        sorted_appointments = sorted(appointments, key=lambda x: x['appointmentDate'])
        latest_appointment = sorted_appointments[-1]
        
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache" 
            },
            "body": json.dumps(latest_appointment)
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': 'Error: Could not get latest appointment'
        }
