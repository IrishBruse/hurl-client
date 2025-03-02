# -------------------------------------------------------------------
# Entry 1 – Complete HTTP Request with All Request Sections & Options
# -------------------------------------------------------------------

# This entry demonstrates a complete HTTP request with headers, all request sections,
# file parameters (both as a multipart file and via oneline-file usage in a multipart section),
# placeholders using functions and filters, and an extensive options section.

GET /api/test?query={{ getEnv("SEARCH_TERM") | urlEncode }}
Host: example.com
Content-Type: application/json
X-Request-ID: {{ newUuid }}

[BasicAuth]
admin: s3cr3t

[QueryStringParams]
# Both "[QueryStringParams]" and its alias "[Query]" can be used.
[Query]
search: hurl
page: 1

[FormParams]
# Both "[FormParams]" and its alias "[Form]" are allowed.
[Form]
field1: value1
field2: {{ newUuid }}

[MultipartFormData]
# Both "[MultipartFormData]" and its alias "[Multipart]" are allowed.
[Multipart]
# This section includes both a file parameter and a regular key-value parameter.
upload: file, ./sample.txt; text/plain
# Alternative file parameter (oneline-file style, without an explicit content type).
attachment: file, ./attachment.pdf;
description: "This is a multipart field with a quoted-string: \"special:chars#\\n\""

[Cookies]
sessionid: abcdef123456

[Options]
aws-sigv4: {{ getEnv("AWS_SIGV4_TOKEN") }}
cacert: ./certs/ca.pem
cert: ./certs/client.pem:password123
key: ./certs/client.key
compressed: true
connect-to: "localhost:8080"
connect-timeout: 5s
delay: 100ms
location: true
location-trusted: false
http1.0: false
http1.1: true
http2: true
http3: false
insecure: false
ipv4: true
ipv6: false
limit-rate: 1024
max-redirs: 10
netrc: false
netrc-file: "./.netrc"
netrc-optional: true
output: "./output.txt"
path-as-is: false
proxy: "http://proxy.example.com"
resolve: "example.com:127.0.0.1"
repeat: 3
retry: 2
retry-interval: 500ms
skip: false
unix-socket: "/var/run/socket.sock"
user: "user:password"
# Variable option using a placeholder with function and filter.
variable: myVar={{ newDate | format "yyyy-MM-dd" }}
# Variable option using explicit variable-definition (variable-name "=" variable-value).
variable: envVar=production
verbose: true
very-verbose: false

{
  "message": "Hello, world!",
  "timestamp": "{{ newDate }}",
  "extra": {
    "notes": "This is an oneline-string value with `escaped` backticks and a placeholder {{ newUuid }}"
  }
}

# -------------------------------------------------------------------
# Entry 2 – Complete HTTP Response with Captures & Extensive Assertions
# -------------------------------------------------------------------

# This entry demonstrates a complete HTTP response including headers,
# two response sections ([Captures] and [Asserts]) that use every query type,
# a JSON body containing both an object and an array, and predicates with various filters.
# Additional headers are included to exercise numeric, float, boolean, and string predicates.

HTTP/1.1 200
Content-Type: application/json
Set-Cookie: sessionid=abcdef123456
X-Server: "Hurl-Test-Server"
X-Info: "Additional \"quoted\" info"
X-Encoded: U29tZSBFbmNvZGVkIFZhbHVl
X-Content-Length: "12345"
X-Date: "2025-02-03T00:00:00Z"
X-Float: "12.34"
X-Boolean: "true"
X-String: hello
X-Created: 2025-01-28

[Captures]
# Capture a header value.
authToken: header "Authorization"

[Asserts]
# Assert that the status is 200.
status == 200
# Assert that the status is not 404 (using "not" predicate).
status not == 404
# Assert that the URL contains "api/test".
url contains "api/test"
# Assert that the Content-Type header exactly matches.
header "Content-Type" == "application/json"
# Assert that the cookie "sessionid" equals the expected value.
cookie "sessionid" == "abcdef123456"
# Assert that the body contains a given substring.
body contains "Hello, world!"
# Assert that an XPath query finds at least one node.
xpath "/root/item" exists
# Assert that a JSONPath query returns a collection.
jsonpath "$.data.user" isCollection
# Assert a regular expression match.
regex "/[0-9]{3}/" matches "200"
# Assert that a variable query returns the expected date.
variable "myVar" == "2025-02-03"
# Assert a numeric predicate on duration.
duration > 100
# Assert SHA256 hash value using an oneline-base64 literal.
sha256 == "base64,ABC123def456==;"
# Assert MD5 hash value using an oneline-hex literal.
md5 != "hex,deadbeef;"
# Assert that the bytes (body) are empty.
bytes isEmpty

# Additional assertions to cover every predicate function:
body startsWith "{"
body endsWith "}"
body contains "{}"
body matches "Hello, world!"
body includes "world"
header "X-Content-Length" isInteger
header "X-Float" isFloat
header "X-Boolean" isBoolean
header "X-String" isString
header "X-Content-Length" >= 10000
header "X-Content-Length" <= 20000
header "X-Float" < "20.0"
header "X-Date" isIsoDate
header "X-Created" isDate

{
  "data": {
    "user": {
      "id": 12345,
      "name": "John Doe"
    },
    "created": "2025-01-28T12:00:00Z"
  },
  "items": [ "first", "second", "third" ]
}

# -------------------------------------------------------------------
# Entry 3 – POST Request with Multiline & Oneline Strings, XML, and Advanced Filters
# -------------------------------------------------------------------

# This entry demonstrates:
# - A POST method using HTTP/2.
# - Oneline-string usage in headers.
# - A multiline-string body that specifies a type ("json") and includes attributes ("escape" and "novariable").
# - An XML body example using the XML production.
# - Placeholders and functions with additional filters (base64Encode, decode, count, split, replace,
#   to-int, to-float, htmlEscape, htmlUnescape, regex, daysAfterNow, urlDecode, urlEncode, xpath).

POST /api/multiline HTTP/2
Content-Type: text/plain
X-Multiline: `Single line header with \`escaped\` backticks and a placeholder {{ newUuid }}`

[FormParams]
description: "This request demonstrates multiline-string bodies."

[Options]
# Use additional options with integer, duration, and placeholder examples.
retry: 5
retry-interval: 2s
variable: sampleVar={{ newDate | format "yyyyMMdd" }}

# The body is defined as a multiline-string with type "json", attributes "escape" and "novariable".
```json,escape,novariable
{
  "message": 'This is a multiline JSON message',
  "details": "Supports \"quotes\", \\backslashes\\, and special characters: #, :, and {}.",
}
```
# End of the multiline-string.


# -------------------------------------------------------------------
# Entry 4 – POST Request with a GraphQL Multiline String
# -------------------------------------------------------------------

# This entry demonstrates a GraphQL request using a multiline-string with type "graphql".
# It also shows usage of a variable inside the GraphQL query and the "novariable" attribute.
# Note: GraphQL type is one of the supported multiline-string types per the grammar.

POST /graphql HTTP/1.1
Content-Type: application/json

[Options]
variable: queryVar={{ getEnv("DEFAULT_QUERY") }}

```graphql,novariable
# GraphQL Query Example
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```
