import boto3
import json

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    # doctorTable
     # patientTable
    table_name = 'doctor'
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f'Table {table_name} already exists.')
    except:
        attribute_definitions = [
            {'AttributeName': 'phone', 'AttributeType': 'S'},
        ]
        key_schema = [
            {'AttributeName': 'phone', 'KeyType': 'HASH'},
        ]
        provisioned_throughput = {
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        }
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        print(f"Table {table_name} has been created")

   
    # patientTable
    table_name = 'patient'
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f'Table {table_name} already exists.')
    except:
        attribute_definitions = [
            {'AttributeName': 'phone', 'AttributeType': 'S'},
            {'AttributeName': 'patientName', 'AttributeType': 'S'}
        ]
        key_schema = [
            {'AttributeName': 'phone', 'KeyType': 'HASH'},
            {'AttributeName': 'patientName', 'KeyType': 'RANGE'}
        ]
        provisioned_throughput = {
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        }
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        print(f"Table {table_name} has been created")

    # vaccineTable
    table_name = 'vaccine'
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f'Table {table_name} already exists.')
    except:
        attribute_definitions = [
            {'AttributeName': 'vaccineName', 'AttributeType': 'S'},
        ]
        key_schema = [
            {'AttributeName': 'vaccineName', 'KeyType': 'HASH'},
        ]
        provisioned_throughput = {
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        }
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        print(f"Table {table_name} has been created")
    
    # visit
    table_name = 'visit'
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f'Table {table_name} already exists.')
    except:
        attribute_definitions = [
            {'AttributeName': 'phoneAndPatientName', 'AttributeType': 'S'},
            {'AttributeName': 'visitDate', 'AttributeType': 'S'}
        ]
        key_schema = [
            {'AttributeName': 'phoneAndPatientName', 'KeyType': 'HASH'},
            {'AttributeName': 'visitDate', 'KeyType': 'RANGE'}
        ]
        provisioned_throughput = {
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        }
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        print(f"Table {table_name} has been created")
    
    # vaccineGiven
    table_name = 'vaccineGiven'
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f'Table {table_name} already exists.')
    except:
        attribute_definitions = [
            {'AttributeName': 'phoneAndPatientName', 'AttributeType': 'S'},
            {'AttributeName': 'vaccineNameAndDate', 'AttributeType': 'S'},
        ]
        key_schema = [
            {'AttributeName': 'phoneAndPatientName', 'KeyType': 'HASH'},
            {'AttributeName': 'vaccineNameAndDate', 'KeyType': 'RANGE'}
        ]
        provisioned_throughput = {
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        }
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        print(f"Table {table_name} has been created")
        
    # appointments
    table_name = 'appointments'
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f'Table {table_name} already exists.')
    except:
        attribute_definitions = [
            {'AttributeName': 'phone', 'AttributeType': 'S'},
            {'AttributeName': 'slot', 'AttributeType': 'S'},
        ]
        key_schema = [
            {'AttributeName': 'phone', 'KeyType': 'HASH'},
            {'AttributeName': 'slot', 'KeyType': 'RANGE'}
        ]
        provisioned_throughput = {
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        }
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        print(f"Table {table_name} has been created")    
    
    # doctor_availability
    table_name = 'doctor_availability'
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f'Table {table_name} already exists.')
    except:
        attribute_definitions = [
            {'AttributeName': 'weekday', 'AttributeType': 'S'},
            {'AttributeName': 'slot', 'AttributeType': 'S'},
        ]
        key_schema = [
            {'AttributeName': 'weekday', 'KeyType': 'HASH'},
            {'AttributeName': 'slot', 'KeyType': 'RANGE'}
        ]
        provisioned_throughput = {
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        }
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        print(f"Table {table_name} has been created") 
    
        
    # Return a success message
    return {
        'statusCode': 200,
        'body': json.dumps('Schema created successfully')
    }