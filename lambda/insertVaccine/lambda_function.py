import boto3
import json

def lambda_handler(event, context):
    
    # initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    
    # specify the name of the DynamoDB table
    table = dynamodb.Table('vaccine')
    
    # parse the request body
    # data = json.loads(event['body'])
     
    # extract the attributes from the request body
    vaccineName = event['vaccineName']
    #content = event['content']
    #mrp = event['mrp']
    #buyingCost = event['buyingCost']
    sellingPrice = event['sellingPrice']
    #stockOnHand = event['stockOnHand']
    
    # create a new item to be added to the table
    item = {

        'vaccineName': vaccineName,
        'sellingPrice': sellingPrice
    }
    
    # add the item to the table
    table.put_item(Item=item)
    
    # return a success response
    response = {
        'statusCode': 200,
        'body': json.dumps('Item added to DynamoDB table')
    }
    
    return response

