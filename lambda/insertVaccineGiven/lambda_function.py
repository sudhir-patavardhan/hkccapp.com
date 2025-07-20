import boto3

def lambda_handler(event, context):
    
    # Connect to DynamoDB
    dynamodb = boto3.resource('dynamodb')
    
    # Get the visit table
    table = dynamodb.Table('vaccineGiven')
    table.load()
    
    # Get the attributes from the event
    phone = event['phone']
    patientName = event['patientName']
    phoneAndPatientName = phone + "|" + patientName
    
    vaccineName = event['vaccineName']
    givenDate = event['givenDate']
    vaccineNameAndDate = vaccineName + "|" + givenDate
    
    vaccineCost = event['vaccineCost']
    notes = event['notes']
    
    # Create a new item to insert into the table
    new_item = {
        'phoneAndPatientName': phoneAndPatientName,
        'vaccineNameAndDate': vaccineNameAndDate,
        'phone': phone,
        'patientName': patientName,
        'vaccineName':vaccineName,
        'givenDate': givenDate,
        'vaccineCost': vaccineCost,
        'notes': notes
    }
    
    # Insert the new item into the table
    table.put_item(Item=new_item)
    
    # Return a success message
    return {
        'statusCode': 200,
        'body': 'vaccineGiven inserted successfully!'
    }



