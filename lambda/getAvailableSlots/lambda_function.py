import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table_name = 'doctor_availability'
table = dynamodb.Table(table_name)

appointments_table_name = 'appointments'
appointments_table = dynamodb.Table(appointments_table_name)

def lambda_handler(event, context):
    appointment_date_str = event['appointmentDate']
    appointment_date = datetime.strptime(appointment_date_str,'%Y-%m-%d')

    # Get the day of the week as a string
    weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekday_str = weekdays[appointment_date.weekday()]

    # Get the available slots for the given day of the week
    response = table.query(
        KeyConditionExpression='weekday = :weekday_val',
        ExpressionAttributeValues={':weekday_val': weekday_str},
        ScanIndexForward=True
    )
    if not response['Items']:
        return {
            'statusCode': 200,
            'body': {'availableSlots': []}
        }
    available_slots = [item['slot'] for item in response['Items']]

    # Get the booked slots for the given date
    response = appointments_table.query(
        KeyConditionExpression='#date = :date_val',
        ExpressionAttributeNames={'#date': 'appointmentDate'},
        ExpressionAttributeValues={':date_val': appointment_date_str}
    )
    booked_slots = [item['appointmentTime'] for item in response['Items']]
    available_slots = [slot for slot in available_slots if slot not in booked_slots]

    return {
        'availableSlots': available_slots,
    }
