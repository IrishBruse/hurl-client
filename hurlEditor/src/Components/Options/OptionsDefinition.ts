export const Options = {
    authentication: {
        "aws-sigv4": {
            type: "string",
            description:
                "Generate an Authorization header with an AWS SigV4 signature. Use -u, --user to specify Access Key Id (username) and Secret Key (password). To use temporary session credentials, add the X-Amz-Security-Token header containing the session token.",
            name: "AWS Signature V4",
        },
        "cacert": {
            type: "string",
            description:
                "Specifies the certificate file for peer verification. The file may contain multiple CA certificates and must be in PEM format. Typically used to alter the default file used by Hurl.",
            name: "Cacert",
        },
        "cert": {
            type: "string",
            description: "Client certificate file and password.",
            name: "Cert",
        },
        "key": {
            type: "string",
            description: "Private key file name.",
            name: "Key",
        },
        "insecure": {
            type: "boolean",
            description: "Explicitly allows Hurl to perform insecure SSL connections and transfers.",
            name: "Insecure",
        },
        "netrc": {
            type: "boolean",
            description: "Scan the .netrc file in the user's home directory for the username and password.",
            name: "Netrc",
        },
        "netrc-file": {
            type: "string",
            description: "Like --netrc, but provide the path to the netrc file.",
            name: "Netrc File",
        },
        "netrc-optional": {
            type: "boolean",
            description: "Similar to --netrc, but makes the .netrc usage optional.",
            name: "Netrc Optional",
        },
        "proxy": {
            type: "string",
            description: "Use the specified proxy.",
            name: "Proxy",
        },
        "resolve": {
            type: "string",
            description: "Provide a custom address for a specific host and port pair.",
            name: "Resolve",
        },
        "ssl-no-revoke": {
            type: "boolean",
            description: "(Windows) Disable certificate revocation checks.",
            name: "SSL no Revoke",
        },
        "user": {
            type: "string",
            description: "Add basic Authentication header to each request.",
            name: "User",
        },
    },
    networking: {
        "connect-timeout": {
            type: "number",
            units: ["s", "ms"],
            description: "Maximum time in seconds that you allow Hurl's connection to take.",
            name: "Connection Timeout",
        },
        "connect-to": {
            type: "string",
            description: "For a request to the given HOST1:PORT1 pair, connect to HOST2:PORT2 instead.",
            name: "Connect To",
        },
        "ipv4": {
            type: "boolean",
            description: "Use IPv4 addresses only when resolving host names.",
            name: "Ipv4",
        },
        "ipv6": {
            type: "boolean",
            description: "Use IPv6 addresses only when resolving host names.",
            name: "Ipv6",
        },
        "limit-rate": {
            type: "integer",
            minimum: 1,
            description: "Specify the maximum transfer rate in bytes/second.",
            name: "Limit Rate",
        },
        "max-filesize": {
            type: "integer",
            minimum: 1,
            description: "Specify the maximum size in bytes of a file to download.",
            name: "Max Filesize",
        },
        "max-redirs": {
            type: "integer",
            minimum: -1,
            description: "Set maximum number of redirection-followings allowed.",
            name: "Max Redirs",
        },
        "max-time": {
            type: "number",
            units: ["s", "ms"],
            description: "Maximum time in seconds that you allow a request/response to take.",
            name: "Max Time",
        },
        "noproxy": {
            type: "string",
            description: "Comma-separated list of hosts which do not use a proxy.",
            name: "Noproxy",
        },
        "retry": {
            type: "integer",
            minimum: -1,
            description: "Maximum number of retries on error.",
            name: "Retry",
        },
        "retry-interval": {
            type: "string",
            pattern: "^[0-9]+(ms|s)?$",
            description: "Duration in milliseconds between each retry.",
            name: "Retry Interval",
        },
        "unix-socket": {
            type: "string",
            description: "(HTTP) Connect through this Unix domain socket instead of using the network.",
            name: "Unix Socket",
        },
    },
    request_handling: {
        "compressed": {
            type: "boolean",
            description: "Request a compressed response using algorithms like br, gzip, deflate and automatically decompress the content.",
            name: "Compressed",
        },
        "cookie": {
            type: "string",
            description: "Read cookies from a file (using the Netscape cookie file format).",
            name: "Cookie",
        },
        "cookie-jar": {
            type: "string",
            description: "Write cookies to a file after running the session (only for one session).",
            name: "Cookie Jar",
        },
        "http1.0": {
            type: "boolean",
            description: "Tells Hurl to use HTTP version 1.0.",
            name: "HTTP 1.0",
        },
        "http1.1": {
            type: "boolean",
            description: "Tells Hurl to use HTTP version 1.1.",
            name: "HTTP 1.1",
        },
        "http2": {
            type: "boolean",
            description: "Tells Hurl to use HTTP version 2.",
            name: "HTTP 2",
        },
        "http3": {
            type: "boolean",
            description: "Tells Hurl to try HTTP/3 and fallback to earlier HTTP versions if necessary.",
            name: "HTTP 3",
        },
        "location": {
            type: "boolean",
            description: "Follow redirects.",
            name: "Location",
        },
        "location-trusted": {
            type: "boolean",
            description: "Follow redirects and send authentication to redirected hosts.",
            name: "Location Trusted",
        },
        "path-as-is": {
            type: "boolean",
            description: "Tell Hurl to not handle sequences of /../ or /./ in the given URL path.",
            name: "Path as is",
        },
        "user-agent": {
            type: "string",
            description: "Specify the User-Agent string to send to the HTTP server.",
            name: "User Agent",
        },
    },
    execution_performance: {
        "continue-on-error": {
            type: "boolean",
            description: "Continue executing requests even when an assert error occurs.",
            name: "Continue On Error",
        },
        "delay": {
            type: "number",
            units: ["s", "ms"],
            description: "Sets delay before each request.",
            name: "Delay",
        },
        "from-entry": {
            type: "integer",
            minimum: 1,
            description: "Execute Hurl file from a specific entry number.",
            name: "From Entry",
        },
        "jobs": {
            type: "integer",
            minimum: 1,
            description: "Maximum number of parallel jobs.",
            name: "Jobs",
        },
        "parallel": {
            type: "boolean",
            description: "Run files in parallel.",
            name: "Parallel",
        },
        "repeat": {
            type: "integer",
            minimum: -1,
            description: "Repeat the input files sequence a specified number of times.",
            name: "Repeat",
        },
        "test": {
            type: "boolean",
            description: "Activate test mode.",
            name: "Test",
        },
        "to-entry": {
            type: "integer",
            minimum: 1,
            description: "Execute Hurl file up to a specific entry number.",
            name: "To-Entry",
        },
    },
    output_debugging: {
        "color": {
            type: "boolean",
            description: "Colorize debug output.",
            name: "Color",
        },
        "curl": {
            type: "file",
            description: "Export each request to a list of curl commands.",
            name: "Curl",
        },
        "error-format": {
            type: "string",
            enum: ["short", "long"],
            description: "Control the format of error message.",
            name: "Error Format",
        },
        "ignore-asserts": {
            type: "boolean",
            description: "Ignore all asserts defined in the Hurl file.",
            name: "Ignore Asserts",
        },
        "include": {
            type: "boolean",
            description: "Include the HTTP headers in the output.",
            name: "Include",
        },
        "interactive": {
            type: "boolean",
            description: "Stop between requests like a breakpoint.",
            name: "Interactive",
        },
        "json": {
            type: "boolean",
            description: "Output each Hurl file result to JSON.",
            name: "Json",
        },
        "no-color": {
            type: "boolean",
            description: "Do not colorize output.",
            name: "No Color",
        },
        "no-output": {
            type: "boolean",
            description: "Suppress output.",
            name: "No Output",
        },
        "output": {
            type: "string",
            description: "Write output to a file instead of stdout.",
            name: "Output",
        },
        "verbose": {
            type: "boolean",
            description: "Turn on verbose output for debugging.",
            name: "Verbose",
        },
        "very-verbose": {
            type: "boolean",
            description: "Turn on more verbose output, including full HTTP body request and response.",
            name: "Very Verbose",
        },
    },
    file_management: {
        "file-root": {
            type: "file",
            description: "Set root directory for file imports in Hurl.",
            name: "File Root",
        },
        "glob": {
            type: "string",
            description: "Specify input files matching a glob pattern.",
            name: "Glob",
        },
        "report-html": {
            type: "string",
            description: "Generate HTML report.",
            name: "Report Html",
        },
        "report-json": {
            type: "string",
            description: "Generate JSON report.",
            name: "Report Json",
        },
        "report-junit": {
            type: "string",
            description: "Generate JUnit report.",
            name: "Report Junit",
        },
        "report-tap": {
            type: "string",
            description: "Generate TAP report.",
            name: "Report Tap",
        },
        "variables-file": {
            type: "file",
            description: "Set properties file to define your variables.",
            name: "Variables File",
        },
    },
};
