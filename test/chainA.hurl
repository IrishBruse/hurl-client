GET https://randomuser.me/api
HTTP 200

[Captures]
            test: jsonpath "$.results[0].email"
