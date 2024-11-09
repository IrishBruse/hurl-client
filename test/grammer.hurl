# A simple GET with headers
GET https://example.org/news
User-Agent: Mozilla/5.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
[QueryStringParams]
order: newest
search: something to search
count: 100
[Cookies]
theme: light
sessionToken: abc123

HTTP/1.1 200
# HTTP/1.0 200
# HTTP/2 200
# HTTP/3 200
# HTTP *
[Asserts]
body not contains "[Asserts]"

POST http://example.com/


{
    "message": "Hello"
}

POST http://example.com
{
    "asd":123,
    "asdas":"123",
    "asddsd":{

    }
}
HTTP *
[Captures]
            test: jsonpath "$.results[0].email"

GET http://localhost:8000/error-assert-variable
HTTP 200
[Captures]
status: status
length: header "content-length"
type: header "content-type"
[Asserts]
variable "toto" == "tata"
variable "status" == {{unknown}}
variable "status" == {{type}}
variable "status" == {{length}}


GET http://localhost:8000/error-assert-variable
[Options]
verbose: {{verbose}}
HTTP 200
