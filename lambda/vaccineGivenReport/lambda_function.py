import json
import boto3
import logging
from datetime import datetime

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Lambda function to fetch vaccine given records within a date range.
    
    Args:
        event (dict): Contains 'startDate' and 'endDate' in 'YYYY-MM-DD' format
        context: Lambda context object
    
    Returns:
        dict: JSON response with vaccine given records
    """
    try:
        logger.info(f"Lambda execution started. Event: {json.dumps(event)}")
        logger.info(f"Lambda context: RequestId={context.aws_request_id}, FunctionName={context.function_name}")
        
        # Validate input parameters
        if not event:
            logger.error("Event is empty or None")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Event is required'})
            }
        
        # Extract and validate dates from API Gateway event
        # API Gateway wraps the request body in the event
        request_body = event.get('body', '{}')
        
        # Parse the JSON body if it's a string
        if isinstance(request_body, str):
            try:
                request_data = json.loads(request_body)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse request body JSON: {str(e)}")
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Invalid JSON in request body'})
                }
        else:
            request_data = request_body
        
        start_date = request_data.get('startDate')
        end_date = request_data.get('endDate')
        
        if not start_date or not end_date:
            logger.error(f"Missing required parameters. startDate: {start_date}, endDate: {end_date}")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'startDate and endDate are required'})
            }
        
        logger.info(f"Processing date range: {start_date} to {end_date}")
        
        # Validate date format
        try:
            start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
            end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
            logger.info(f"Date parsing successful. Start: {start_datetime}, End: {end_datetime}")
        except ValueError as e:
            logger.error(f"Invalid date format. Error: {str(e)}")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'Invalid date format. Expected YYYY-MM-DD. Error: {str(e)}'})
            }
        
        # Validate date range
        if start_datetime > end_datetime:
            logger.error(f"Invalid date range: start date {start_date} is after end date {end_date}")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'startDate cannot be after endDate'})
            }
        
        # Convert datetime objects back to strings in the format used in the table
        start_date_str = start_datetime.strftime('%Y-%m-%d')
        end_date_str = end_datetime.strftime('%Y-%m-%d')
        
        logger.info(f"Formatted date strings - Start: {start_date_str}, End: {end_date_str}")
        
        # Create DynamoDB resource
        logger.info("Creating DynamoDB resource")
        dynamodb = boto3.resource('dynamodb')
        table_name = 'vaccineGiven'
        
        logger.info(f"Accessing DynamoDB table: {table_name}")
        table = dynamodb.Table(table_name)
        
        # Log table details for debugging
        try:
            table.load()
            logger.info(f"Table {table_name} loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load table {table_name}. Error: {str(e)}")
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f'Failed to access DynamoDB table: {str(e)}'})
            }
        
        # Define the filter expression
        filter_expression = 'givenDate BETWEEN :start_date AND :end_date'
        expression_values = {
            ':start_date': start_date_str,
            ':end_date': end_date_str
        }
        
        logger.info(f"Scanning table with filter: {filter_expression}")
        logger.info(f"Expression values: {json.dumps(expression_values)}")
        
        # Scan the table
        try:
            response = table.scan(
                FilterExpression=filter_expression,
                ExpressionAttributeValues=expression_values
            )
            logger.info(f"Scan operation completed successfully. Found {len(response.get('Items', []))} items")
            
        except Exception as e:
            logger.error(f"DynamoDB scan operation failed. Error: {str(e)}")
            logger.error(f"Error type: {type(e).__name__}")
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f'DynamoDB scan failed: {str(e)}'})
            }
        
        # Process and log results
        items = response.get('Items', [])
        logger.info(f"Retrieved {len(items)} vaccine given records")
        
        # Log sample items for debugging (first 3 items)
        for i, item in enumerate(items[:3]):
            logger.info(f"Sample item {i+1}: {json.dumps(item, default=str)}")
        
        if len(items) > 3:
            logger.info(f"... and {len(items) - 3} more items")
        
        # Check for pagination
        if 'LastEvaluatedKey' in response:
            logger.warning("Results are paginated. Consider implementing pagination handling.")
        
        # Return the results
        result = {
            'statusCode': 200,
            'body': json.dumps(items),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        
        logger.info(f"Lambda execution completed successfully. Returning {len(items)} items")
        return result
        
    except Exception as e:
        logger.error(f"Unexpected error in lambda_handler: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error details: {e}")
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e),
                'type': type(e).__name__
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }

