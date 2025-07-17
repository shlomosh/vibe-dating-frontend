#!/bin/bash

# Fix CORS configuration for API Gateway (adds CORS headers to allow requests from any origin). For debug only.

AWS_PROFILE="vibe-dev"
AWS_REGION="il-central-1"
STAGE="dev"

# Get API ID from AWS
API_ID=$(AWS_PROFILE=vibe-dev aws apigateway get-rest-apis --query "items[?name==\`vibe-api-$STAGE\`].id" --output text)

if [ -z "$API_ID" ]; then
    echo "Error: Could not find API ID. Please check if the API exists and you have correct permissions."
    exit 1
fi

# Get resource ID first
RESOURCE_ID=$(AWS_PROFILE=vibe-dev aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/auth/platform`].id' --output text)

if [ -z "$RESOURCE_ID" ]; then
    echo "Error: Could not find resource ID for /auth/platform path. Please check if the resource exists."
    exit 1
fi

echo "Fixing CORS configuration for API Gateway (API_ID: $API_ID, RESOURCE_ID: $RESOURCE_ID)..."

# Delete existing POST method response if it exists
AWS_PROFILE=vibe-dev aws apigateway delete-method-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --region $AWS_REGION 2>/dev/null || true

# Update POST method response to include CORS headers
AWS_PROFILE=vibe-dev aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --response-parameters "{\"method.response.header.Access-Control-Allow-Origin\":true,\"method.response.header.Access-Control-Allow-Methods\":true,\"method.response.header.Access-Control-Allow-Headers\":true}" \
  --region $AWS_REGION

if [ $? -ne 0 ]; then
    echo "Error: Failed to update POST method response"
    exit 1
fi

# Delete existing POST integration response if it exists
AWS_PROFILE=vibe-dev aws apigateway delete-integration-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --region $AWS_REGION 2>/dev/null || true

# Update POST integration response to include CORS headers
AWS_PROFILE=vibe-dev aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --response-parameters "{\"method.response.header.Access-Control-Allow-Origin\":\"'*'\",\"method.response.header.Access-Control-Allow-Methods\":\"'POST,OPTIONS'\",\"method.response.header.Access-Control-Allow-Headers\":\"'Content-Type,X-Amz-Date,Authorization,X-Api-Key'\"}" \
  --region $AWS_REGION

if [ $? -ne 0 ]; then
    echo "Error: Failed to update POST integration response"
    exit 1
fi

# Delete existing OPTIONS method if it exists
AWS_PROFILE=vibe-dev aws apigateway delete-method \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method OPTIONS \
  --region $AWS_REGION 2>/dev/null || true

# Enable CORS by adding OPTIONS method
AWS_PROFILE=vibe-dev aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method OPTIONS \
  --authorization-type NONE \
  --region $AWS_REGION

# Add OPTIONS method response
AWS_PROFILE=vibe-dev aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters "{\"method.response.header.Access-Control-Allow-Origin\":true,\"method.response.header.Access-Control-Allow-Methods\":true,\"method.response.header.Access-Control-Allow-Headers\":true}" \
  --region $AWS_REGION

# Add OPTIONS integration
AWS_PROFILE=vibe-dev aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method OPTIONS \
  --type MOCK \
  --request-templates "{\"application/json\":\"{\\\"statusCode\\\": 200}\"}" \
  --region $AWS_REGION

# Add OPTIONS integration response
AWS_PROFILE=vibe-dev aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters "{\"method.response.header.Access-Control-Allow-Origin\":\"'*'\",\"method.response.header.Access-Control-Allow-Methods\":\"'POST,OPTIONS'\",\"method.response.header.Access-Control-Allow-Headers\":\"'Content-Type,X-Amz-Date,Authorization,X-Api-Key'\"}" \
  --region $AWS_REGION

# Deploy the API
AWS_PROFILE=vibe-dev aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name $STAGE \
  --region $AWS_REGION

if [ $? -eq 0 ]; then
    echo "CORS configuration updated and deployed successfully!"
    echo "API Gateway URL: https://$API_ID.execute-api.$AWS_REGION.amazonaws.com/$STAGE"
else
    echo "Error: Failed to deploy API changes"
    exit 1
fi
