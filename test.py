import requests
import json

url = 'http://118.25.8.230:3000/api/org.acme.pv.auction.Member'

payload = {
"$class": "org.acme.pv.auction.Member", "balance": 200,
"email": "seller1@vt.edu",
"firstName": "seller1",
"lastName": "seller1"}

headers = {'content-type': 'application/json'}
response = requests.post(url, data=json.dumps(payload), headers=headers)

print(response)
