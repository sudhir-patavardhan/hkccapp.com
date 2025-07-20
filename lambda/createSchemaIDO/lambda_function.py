import boto3

def lambda_handler(event, context):

    # Create a DynamoDB client
    dynamodb = boto3.client('dynamodb')

    # Define the table name and key schema
    table_name = 'charitable_organisations'
    key_schema = [
        {'AttributeName': 'name', 'KeyType': 'HASH'},
        {'AttributeName': 'zip_code', 'KeyType': 'RANGE'}
    ]

    # Define the attribute definitions
    attribute_definitions = [
        {'AttributeName': 'name', 'AttributeType': 'S'},
        {'AttributeName': 'zip_code', 'AttributeType': 'S'}
    ]

    # Define the provisioned throughput
    provisioned_throughput = {
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }

    # Create the table
    response = dynamodb.create_table(
        TableName=table_name,
        KeySchema=key_schema,
        AttributeDefinitions=attribute_definitions,
        ProvisionedThroughput=provisioned_throughput
    )

    # Return a success message
    return {
        'statusCode': 200,
        'body': 'Table created successfully!'
    }

