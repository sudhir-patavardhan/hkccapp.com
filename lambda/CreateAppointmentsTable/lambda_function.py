import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    table_name = 'appointments'
    key_schema = [
        {'AttributeName': 'appointmentDate', 'KeyType': 'HASH'},
        {'AttributeName': 'appointmentTime', 'KeyType': 'RANGE'}
    ]
    attribute_definitions = [
        {'AttributeName': 'appointmentDate', 'AttributeType': 'S'},
        {'AttributeName': 'appointmentTime', 'AttributeType': 'S'}
    ]
    provisioned_throughput = {
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
    
    try:
        response = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        return {
            'statusCode': 200,
            'body': {'message': 'Table created successfully'}
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': {'message': 'Error creating table'}
        }
