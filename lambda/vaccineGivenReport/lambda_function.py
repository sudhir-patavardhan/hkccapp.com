import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    # create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    table_name = 'vaccineGiven'
    table = dynamodb.Table(table_name)
    
    # extract start and end dates from the event object
    start_date, end_date = event['startDate'], event['endDate']
    
    # convert the dates to datetime objects
    start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
    end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
    
    # convert datetime objects back to strings in the format used in the table
    start_date_str = start_datetime.strftime('%Y-%m-%d')
    end_date_str = end_datetime.strftime('%Y-%m-%d')
    
    # Define the filter expression with an inline placeholder
    filter_expression = 'givenDate BETWEEN :start_date AND :end_date'
    
    # scan the table 
    response = table.scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues={
            ':start_date': start_date_str,
            ':end_date': end_date_str
        }
    )
    
    # print each item/row
    for item in response['Items']:
        print(item)
        
    # Return the results as JSON
    return {
        'statusCode': 200,
        'body': json.dumps(response['Items'])
    }

