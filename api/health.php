<?php
// Simple health check to verify server access bypasses Auth
header('Content-Type: text/plain');
http_response_code(200);
echo "API Health: OK";
