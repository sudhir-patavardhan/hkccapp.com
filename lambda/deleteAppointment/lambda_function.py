import boto3
import json

dynamodb = boto3.resource('dynamodb')
table_name = 'appointments'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    
    patient_phone = event['patientPhone']
    
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
        
        appointment_date = response['Items'][response['Count'] - 1]['appointmentDate']
        appointment_time = response['Items'][response['Count'] - 1]['appointmentTime']
        
        response = table.delete_item(
            Key={
                'appointmentDate': appointment_date,
                'appointmentTime': appointment_time
            }
        )
        print(response)
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Appointment deleted successfully'})
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'message':  str(e)})
        }
