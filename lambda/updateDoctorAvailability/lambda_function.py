import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('doctor_availability')


def insert_slot(weekday, slot):
    try:
        response = table.put_item(
            Item={
                'weekday': weekday,
                'slot': slot
            }
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return False
    else:
        return True


def lambda_handler(event, context):
    # You can customize the input event format as per your requirement.
    # Here, we are assuming the event contains a list of slots with 'weekday' and 'slot' keys.


    weekday = event['weekday']
    time_slot = event['slot']
        
    if insert_slot(weekday, time_slot):
        print(f"Successfully inserted slot {time_slot} on {weekday}.")
    else:
        print(f"Failed to insert slot {time_slot} on {weekday}.")
            
    return {
        'statusCode': 200,
        'body': 'Slots insertion completed'
    }

