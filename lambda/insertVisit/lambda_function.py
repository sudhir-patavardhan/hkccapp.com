import boto3

def lambda_handler(event, context):
    
    # Connect to DynamoDB
    dynamodb = boto3.resource('dynamodb')
    
    # Get the visit table
    table = dynamodb.Table('visit')
    
    # Get the attributes from the event
    phone = event['phone']
    patientName = event['patientName']
    phoneAndPatientName = phone + "|" + patientName
    visitDate = event['visitDate']
    reason = event['reason']
    consultationFee = str(event['consultationFee'])
    totalVaccineFee = str(event['totalVaccineFee'])
    totalFee = str(event['totalFee'])
    paymentMode = event['paymentMode']
    notes = event['notes']
    sessionNumber = event['sessionNumber']
    entryTime = str(event['entryTime'])
    
    # Create a new item to insert into the table
    new_item = {
        'phoneAndPatientName': phoneAndPatientName,
        'visitDate': visitDate,
        'phone': phone,
        'patientName': patientName,
        'reason': reason,
        'consultationFee': consultationFee,
        'totalVaccineFee': totalVaccineFee,
        'totalFee': totalFee,
        'paymentMode': paymentMode,
        'notes': notes,
        'sessionNumber': sessionNumber,
        'entryTime': entryTime
    }
    
    # Insert the new item into the table
    table.put_item(Item=new_item)
    
    # Return a success message
    return {
        'statusCode': 200,
        'body': 'Visit inserted successfully!'
    }


