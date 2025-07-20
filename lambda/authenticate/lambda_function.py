import json

def lambda_handler(event, context):
    
    user_id = event['userid']
    password = event['password']
    
    authenticator = lambda user_id, password: user_id == 'uuuuu' and password == '********'

    # Authenticate user
    if user_id and password and authenticator(user_id, password):
        print('Authentication successful!')
        statusCode = 200
        message = 'authenticated'
    else:
        print('Authentication failed!')
        statusCode = 404
        message = 'invalid username or password'
    
    # TODO implement
    return {
        'statusCode': statusCode,
        'body': json.dumps(message)
    }
