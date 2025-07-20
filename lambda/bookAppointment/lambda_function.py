import boto3
import json

# Provide your own Lambda function name for sending SMS messages
sms_function_name = 'sendSMS'

dynamodb = boto3.resource('dynamodb')
table_name = 'appointments'
table = dynamodb.Table(table_name)
lambda_client = boto3.client('lambda')

def book_appointment(appointmentDate, appointmentTime, patient_name, patient_email, patient_phone):
    try:
        response = table.put_item(
            Item={
                'appointmentDate': appointmentDate,
                'appointmentTime': appointmentTime,
                'patientName': patient_name,
                'patientEmail': patient_email,
                'patientPhone': patient_phone
            },
            ConditionExpression='attribute_not_exists(appointmentDate) AND attribute_not_exists(appointmentTime)'
        )
        return {
            'statusCode': 200,
            'body': {'message': 'Appointment booked successfully'}
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': {'message': str(e)}  # Ensure the error is returned as a string
        }

def lambda_handler(event, context):
    try:
        appointmentDate = event['appointmentDate']
        appointmentTime = event['appointmentTime']
        patient_name = event['patientName']
        patient_email = event['patientEmail']
        patient_phone = event['patientPhone']
        
        # Book the appointment
        response = book_appointment(appointmentDate, appointmentTime, patient_name, patient_email, patient_phone)

        # Prepare SMS payload if appointment was booked successfully
        if response['statusCode'] == 200:
            sms_payload = {
                'phone_number': patient_phone,
                'message': f"Your appointment with Dr. Sheela Ramalingaiah of HKCC is confirmed for {appointmentDate} at {appointmentTime}."
            }
            sms_response = lambda_client.invoke(
                FunctionName=sms_function_name,
                InvocationType='Event',
                Payload=json.dumps(sms_payload)
            )

            return {
                'statusCode': response['statusCode'],
                'body': {
                    'message': response['body']['message'],
                    'smsResponse': sms_response.get('StatusCode'),  # Extract the status code for SMS
                }
            }
        
        return response  # Return the booking response if not successful
    
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': {'message': str(e)}
        }
