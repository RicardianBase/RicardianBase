#!/bin/bash
set -e
BASE_URL=${1:-http://localhost:3000/api}
echo "Smoke testing against $BASE_URL"

# 1. Health check
echo "--- Health Check ---"
curl -sf "$BASE_URL/health" | jq .
echo ""

# 2. Request nonce (will create a new user)
echo "--- Request Nonce ---"
NONCE_RESPONSE=$(curl -sf -X POST "$BASE_URL/auth/nonce" \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU","provider":"phantom"}')
echo "$NONCE_RESPONSE" | jq .
NONCE=$(echo "$NONCE_RESPONSE" | jq -r '.data.nonce // .nonce')
echo "Nonce: $NONCE"
echo ""

# 3. Note: Can't actually verify signature without a real wallet
#    But we can test error cases:
echo "--- Verify with bad signature (should fail 401) ---"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/verify" \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU","signature":"badsig","provider":"phantom"}')
echo "Status: $HTTP_CODE (expected: 401)"
echo ""

# 4. Rate limit test
echo "--- Rate Limit Test (6 rapid nonce requests) ---"
for i in {1..6}; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/nonce" \
    -H "Content-Type: application/json" \
    -d '{"walletAddress":"TestAddr'"$i"'AAAAAAAAAAAAAAAAAAAAA","provider":"phantom"}')
  echo "Request $i: $CODE"
done
echo "(Request 6 should be 429 Too Many Requests)"
echo ""

# 5. Swagger check
echo "--- Swagger ---"
SWAGGER_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/docs")
echo "Swagger status: $SWAGGER_CODE (expected: 200 or 301)"

echo ""
echo "Smoke test complete!"
