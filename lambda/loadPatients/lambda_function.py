import boto3
import pandas as pd
from io import StringIO

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

table_name = 'patient'


def lambda_handler(event, context):
    src_bucket = event['Records'][0]['s3']['bucket']['drsheelasclinic']
    src_key = event['Records'][0]['s3']['object']['Patients.csv']
    
    try:
        csv_obj = s3.get_object(Bucket=src_bucket, Key=src_key)
        csv_data = csv_obj['Body'].read().decode('utf-8')
        data = pd.read_csv(StringIO(csv_data))
        
        for index, row in data.iterrows():
            item = {
                'patientName': row['patientName'],
                'phone': row['phone']
            }
            write_to_dynamodb(item)
        print('CSV file successfully processed')
        
    except Exception as e:
        print(f'Error processing CSV file: {e}')


def write_to_dynamodb(item):
    table = dynamodb.Table(table_name)
    
    try:
        table.put_item(Item=item)
    except Exception as e:
        print(f'Error writing item to DynamoDB: {e}')

