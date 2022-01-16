
curl --data "org=1" http://localhost:3000/enrolladmin


curl --data "org=1&user=amal" http://localhost:3000/enrolluser

curl -s -X POST http://localhost:3000/enrolluser -H "content-type: application/x-www-form-urlencoded" -d 'org=1&user=amal'