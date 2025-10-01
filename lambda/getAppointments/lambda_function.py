import boto3
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb')
table_name = 'appointments'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
   
    start_date_str = event['startDate']
    end_date_str = event['endDate']
    
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

    # Calculate the number of days in the date range
    num_days = (end_date - start_date).days + 1

    # Initialize an empty dictionary to hold the appointments for each day
    appointments = {}

    # Loop through each day in the date range
    for i in range(num_days):
        date = start_date + timedelta(days=i)
        date_str = date.strftime('%Y-%m-%d')

        # Query the 'appointments' table for appointments on the current date
        response = table.query(
            KeyConditionExpression='#date = :date_val',
            ExpressionAttributeNames={'#date': 'appointmentDate'},
            ExpressionAttributeValues={':date_val': date_str}
        )

        # Add the appointments for the current date to the dictionary
        appointments[date_str] = []

        for item in response['Items']:
            appointments[date_str].append({
                'appointmentTime': item['appointmentTime'],
                'patientPhone': item['patientPhone'],
                'patientName': item['patientName']
            })

    # Fetch reminders from the reminder table for the same date range
    reminder_table = dynamodb.Table('reminder')
    reminders = []
    for i in range(num_days):
        date = start_date + timedelta(days=i)
        date_str = date.strftime('%Y-%m-%d')
        response = reminder_table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('reminderDate').eq(date_str)
        )
        reminders.extend(response['Items'])

    return {
        'appointments': appointments,
        'reminders': reminders
    }
