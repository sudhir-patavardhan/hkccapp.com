import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('doctor_availability')

def delete_slot(weekday, slot):
    try:
        response = table.delete_item(
            Key={
                'weekday': weekday,
                'slot': slot
            }
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'An error occurred while deleting the slot.'})
        }
    else:
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Slot deleted successfully.'})
        }

def lambda_handler(event, context):
    weekday = event['pathParameters']['weekday']
    slot = event['pathParameters']['slot']

    response = delete_slot(weekday, slot)
    return response
