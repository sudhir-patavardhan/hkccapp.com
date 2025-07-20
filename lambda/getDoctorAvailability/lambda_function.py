import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('doctor_availability')


def fetch_all_slots():
    try:
        response = table.scan()
        return response['Items']
    except ClientError as e:
        print(e.response['Error']['Message'])
        return []


def lambda_handler(event, context):
    slots = fetch_all_slots()
    return {
        'statusCode': 200,
        'body': slots
    }

