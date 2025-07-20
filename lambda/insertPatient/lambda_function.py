import boto3

def lambda_handler(event, context):
    
    # Connect to DynamoDB
    dynamodb = boto3.resource('dynamodb')
    
    # Get the patient table
    table = dynamodb.Table('patient')
    
    # Get the attributes from the event
    phone = event['phone']
    patientName = event['patientName']
    parentName = event['parentName']
    dateOfBirth = event['dateOfBirth']
    gender = event['gender']
    area = event['area']
    
    # Create a new item to insert into the table
    new_item = {
        'phone': phone,
        'patientName': patientName,
        'parentName': parentName,
        'dateOfBirth': dateOfBirth,
        'gender': gender,
        'area': area
    }
    
    # Insert the new item into the table
    table.put_item(Item=new_item)
    
    # Return a success message
    return {
        'statusCode': 200,
        'body': 'Item inserted successfully!'
    }

