
################################################################################
# Request 1: Simple GET with URL query parameters, headers and Basic Authentication
################################################################################
GET https://example.org/api/dogs?id=4567
User-Agent: My User Agent
Content-Type: application/json
[BasicAuth]
alice: secret

################################################################################
# Request 2: GET with [QueryStringParams] and [Cookies]
################################################################################
GET https://example.org/forum/questions/
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0)
[QueryStringParams]
search: Install Linux
order: newest
[Cookies]
theme: light
sessionToken: abc123

################################################################################
# Request 3: POST with [Options] and [FormParams] (application/x-www-form-urlencoded)
################################################################################
POST https://example.org/contact
[Options]
delay: 3s
location: true
[FormParams]
default: false
token: {{token}}
email: john.doe@rookie.org
number: 33611223344

################################################################################
# Request 4: POST with [MultipartFormData] for file upload simulation
################################################################################
POST https://example.org/upload
[MultipartFormData]
field1: value1
field2: file,example.txt;
field3: file,example.zip; application/zip

################################################################################
# Request 5: POST with JSON request body
################################################################################
POST https://example.org/api/dogs
{
    "id": 0,
    "name": "Frieda",
    "picture": "images/scottish-terrier.jpeg",
    "age": 3,
    "breed": "Scottish Terrier",
    "location": "Lisco, Alabama"
}

################################################################################
# Request 6: POST with XML request body (SOAP example)
################################################################################
POST https://example.org/InStock
Content-Type: application/soap+xml; charset=utf-8
SOAPAction: "http://www.w3.org/2003/05/soap-envelope"
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:m="http://example.net">
  <soap:Header></soap:Header>
  <soap:Body>
    <m:GetStockPrice>
      <m:StockName>GOOG</m:StockName>
    </m:GetStockPrice>
  </soap:Body>
</soap:Envelope>

################################################################################
# Request 7: POST with a GraphQL query (with variables example)
################################################################################
POST https://example.org/starwars/graphql
```graphql
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

################################################################################
# Request 8: POST with a multiline string body (CSV content)
################################################################################
POST https://example.org/models
```
Year,Make,Model,Description,Price
1997,Ford,E350,"ac, abs, moon",3000.00
1999,Chevy,"Venture ""Extended Edition""","",4900.00
1999,Chevy,"Venture ""Extended Edition, Very Large""",,5000.00
1996,Jeep,Grand Cherokee,"MUST SELL! air, moon roof, loaded",4799.00
```

################################################################################
# Request 9: POST with an oneline string body
################################################################################
POST https://example.org/helloworld
`Hello world!`

################################################################################
# Request 10: POST with a Base64-encoded body (binary data example)
################################################################################
POST https://example.org/data
# Some random comments before body
base64,TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4=;

################################################################################
# Request 11: PUT with a Hex-encoded body (UTF-8 café example)
################################################################################
PUT https://example.org/cafe
# Send a café, encoded in UTF-8
hex,636166c3a90a;

################################################################################
# Request 12: POST with a file body (content loaded from a local file)
################################################################################
POST https://example.org/uploadfile
# Some random comments before body
file,example-data.bin;
