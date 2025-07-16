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

# Check if method response already exists
METHOD_RESPONSE=$(AWS_PROFILE=vibe-dev aws apigateway get-method-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --region $AWS_REGION 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "Method response already exists, skipping PUT method-response..."
else
    # Update CORS configuration directly instead of modifying path
    AWS_PROFILE=vibe-dev aws apigateway put-method-response \
      --rest-api-id $API_ID \
      --resource-id $RESOURCE_ID \
      --http-method POST \
      --status-code 200 \
      --response-parameters "{\"method.response.header.Access-Control-Allow-Origin\":true}" \
      --region $AWS_REGION

    if [ $? -ne 0 ]; then
        echo "Error: Failed to update resource configuration"
        exit 1
    fi
fi

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
else
    echo "Error: Failed to deploy API changes"
    exit 1
fi
