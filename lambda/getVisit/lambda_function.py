import json
import boto3
from collections import defaultdict

def lambda_handler(event, context):
    # create a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    phone = event["phone"]
    patientName = event["patientName"]
    phoneAndPatientName = phone + "|" + patientName
    startDate = event["startDate"]
    endDate = event["endDate"]

    # get the 'visit' Table
    visit_table = dynamodb.Table('visit')
    visit_table.load()

    # get the 'vaccineGiven' Table
    vaccine_given_table = dynamodb.Table('vaccineGiven')
    vaccine_given_table.load()

    all_visits = []

    if not phone or not patientName:
        print('000-----')
        visit_filter_expression = '(visitDate >= :startDate and visitDate <= :endDate)'
    
        # scan the visit table 
        visit_response = visit_table.scan(
            FilterExpression=visit_filter_expression,
            ExpressionAttributeValues={
                ':startDate': startDate,
                ':endDate': endDate
            }
        ) 
        all_visits.extend(visit_response.get('Items', []))
        print('111-----')
        last_evaluated_key = visit_response.get('LastEvaluatedKey')
        print('222----')
        while last_evaluated_key:
            print(last_evaluated_key)
            visit_response = visit_table.scan(
            FilterExpression=visit_filter_expression,
            ExpressionAttributeValues={
                ':startDate': startDate,
                ':endDate': endDate
            },
            ExclusiveStartKey=last_evaluated_key
            )
            all_visits.extend(visit_response.get('Items', []))
            last_evaluated_key = visit_response.get('LastEvaluatedKey')

            
    else:
        # Query the visit table based on phoneAndPatientName
        phoneAndPatientName = phone + "|" + patientName
        visit_response = visit_table.query(
            KeyConditionExpression='phoneAndPatientName = :phoneAndPatientName',
            ExpressionAttributeValues={':phoneAndPatientName': phoneAndPatientName}
        )
        all_visits.extend(visit_response.get('Items', []))
        
    #print(visit_response)

    # Scan the vaccineGiven table
    vaccine_given_response = vaccine_given_table.scan()

    # Group vaccineGiven data by phoneAndPatientName and givenDate
    grouped_vaccine_data = defaultdict(lambda: defaultdict(list))
    for vaccine_item in vaccine_given_response['Items']:
        phone_and_patient_name = vaccine_item['phoneAndPatientName']
        given_date = vaccine_item['givenDate']
        grouped_vaccine_data[phone_and_patient_name][given_date].append(vaccine_item['vaccineName'])

    visit_items = []

    #for visit_item in visit_response['Items']:
    for visit_item in all_visits:
        cur_visit_date = visit_item['visitDate']
        cur_phone = visit_item['phone']
        cur_patient_name = visit_item['patientName']
        cur_phone_and_patient_name = cur_phone + '|' + cur_patient_name
        
        entry_time = visit_item.get('entryTime', '0')
        session_number = visit_item.get('sessionNumber', '1')

        vaccine_given_names = grouped_vaccine_data.get(cur_phone_and_patient_name, {}).get(cur_visit_date, [])

        visit_item['vaccineGiven'] = ','.join(vaccine_given_names)
        visit_item['entryTime'] = entry_time
        visit_item['sessionNumber'] = session_number
        visit_items.append(visit_item)

    # Sort the results by entryTime ascending, assuming 0 if entryTime is missing
    visit_items_sorted = sorted(visit_items, key=lambda x: (x.get('entryTime', 0), x['visitDate']))

    # Return the results as JSON
    return json.dumps(visit_items_sorted)

