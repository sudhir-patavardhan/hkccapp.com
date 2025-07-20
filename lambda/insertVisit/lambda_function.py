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
    nextVisitDate = event.get('nextVisitDate')
    
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
    if nextVisitDate:
        new_item['nextVisitDate'] = nextVisitDate
    
    # Insert the new item into the visit table
    table.put_item(Item=new_item)

    # If nextVisitDate is provided, add a reminder to the 'reminder' table
    if nextVisitDate:
        reminder_table_name = 'reminder'
        # Try to get or create the reminder table
        try:
            reminder_table = dynamodb.Table(reminder_table_name)
            reminder_table.load()
        except Exception:
            # Table does not exist, create it
            attribute_definitions = [
                {'AttributeName': 'reminderDate', 'AttributeType': 'S'},
                {'AttributeName': 'reminderType#phoneAndPatientName', 'AttributeType': 'S'}
            ]
            key_schema = [
                {'AttributeName': 'reminderDate', 'KeyType': 'HASH'},
                {'AttributeName': 'reminderType#phoneAndPatientName', 'KeyType': 'RANGE'}
            ]
            provisioned_throughput = {
                'ReadCapacityUnits': 1,
                'WriteCapacityUnits': 1
            }
            reminder_table = dynamodb.create_table(
                TableName=reminder_table_name,
                KeySchema=key_schema,
                AttributeDefinitions=attribute_definitions,
                ProvisionedThroughput=provisioned_throughput
            )
            reminder_table.wait_until_exists()
        # Insert the reminder item
        reminder_item = {
            'reminderDate': nextVisitDate,
            'reminderType#phoneAndPatientName': f"nextVisit|{phoneAndPatientName}",
            'reminderType': 'nextVisit',
            'phoneAndPatientName': phoneAndPatientName,
            'phone': phone,
            'patientName': patientName,
            'lastVisitDate': visitDate,
            'lastVisitReason': reason,
            'createdAt': visitDate
        }
        reminder_table.put_item(Item=reminder_item)
    
    # Return a success message
    return {
        'statusCode': 200,
        'body': 'Visit inserted successfully!'
    }


