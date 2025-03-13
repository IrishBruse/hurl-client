import { Entry, Method, Request } from "./types";

export function validateEntry(entry: Entry) {
    if (typeof entry !== "object" || entry === null) {
        return false;
    }
    if (!validateRequest(entry.request)) {
        return false;
    }
    if (entry.response !== undefined && !validateResponse(entry.response)) {
        return false;
    }
    return true;
}

function validateRequest(request: Request) {
    if (typeof request !== "object" || request === null) {
        return false;
    }
    if (typeof request.url !== "string") {
        return false;
    }
    if (!validateMethod(request.method)) {
        return false;
    }
    if (request.comments !== undefined && !Array.isArray(request.comments)) {
        return false;
    }
    if (request.options !== undefined && !validateOptions(request.options)) {
        return false;
    }
    if (request.headers !== undefined && !validateCookies(request.headers)) {
        return false;
    }
    if (request.body !== undefined && !validateRequestBody(request.body)) {
        return false;
    }
    if (request.queryStringParams !== undefined && !validateCookies(request.queryStringParams)) {
        return false;
    }
    if (request.multipartFormData !== undefined && !validateMultipartFormData(request.multipartFormData)) {
        return false;
    }
    if (request.cookies !== undefined && !validateCookies(request.cookies)) {
        return false;
    }
    return true;
}

function validateMethod(method: any): method is Method {
    const validMethods: Method[] = [
        "GET",
        "PUT",
        "POST",
        "HEAD",
        "DELETE",
        "CONNECT",
        "OPTIONS",
        "TRACE",
        "PATCH",
        "LINK",
        "UNLINK",
        "PURGE",
        "LOCK",
        "UNLOCK",
        "PROPFIND",
        "VIEW",
    ];
    return typeof method === "string" && validMethods.includes(method as Method);
}

function validateResponse(obj: any): obj is Response {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    if (obj.status !== undefined && typeof obj.status !== "number") {
        return false;
    }
    if (obj.body !== undefined && !validateResponseBody(obj.body)) {
        return false;
    }
    if (obj.headers !== undefined && !validateCookies(obj.headers)) {
        return false;
    }
    if (obj.asserts !== undefined && !Array.isArray(obj.asserts)) {
        return false;
    }
    if (obj.captures !== undefined && !Array.isArray(obj.captures)) {
        return false;
    }
    if (obj.version !== undefined && typeof obj.version !== "string") {
        return false;
    }
    return true;
}

function validateOptions(options: any): boolean {
    return (
        Array.isArray(options) &&
        options.every(
            (opt) =>
                typeof opt === "object" &&
                opt !== null &&
                typeof opt.name === "string" &&
                (typeof opt.value === "string" || typeof opt.value === "number" || typeof opt.value === "boolean")
        )
    );
}

function validateCookies(cookies: any): boolean {
    return (
        Array.isArray(cookies) &&
        cookies.every((cookie) => typeof cookie === "object" && cookie !== null && typeof cookie.name === "string" && typeof cookie.value === "string")
    );
}

function validateRequestBody(obj: any): boolean {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    if (obj.type !== undefined && typeof obj.type !== "string") {
        return false;
    }
    if (
        obj.value !== undefined &&
        !(typeof obj.value === "string" || typeof obj.value === "number" || typeof obj.value === "boolean" || Array.isArray(obj.value))
    ) {
        return false;
    }
    if (obj.filename !== undefined && typeof obj.filename !== "string") {
        return false;
    }
    if (obj.encoding !== undefined && typeof obj.encoding !== "string") {
        return false;
    }
    return true;
}

function validateMultipartFormData(data: any): boolean {
    return (
        Array.isArray(data) &&
        data.every(
            (item) =>
                typeof item === "object" &&
                item !== null &&
                typeof item.name === "string" &&
                (item.value === undefined || typeof item.value === "string") &&
                (item.filename === undefined || typeof item.filename === "string") &&
                (item.contentType === undefined || typeof item.contentType === "string")
        )
    );
}

function validateResponseBody(obj: any): boolean {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    if (obj.type !== undefined && typeof obj.type !== "string") {
        return false;
    }
    if (obj.value !== undefined && !(typeof obj.value === "string" || typeof obj.value === "number" || Array.isArray(obj.value))) {
        return false;
    }
    if (obj.filename !== undefined && typeof obj.filename !== "string") {
        return false;
    }
    if (obj.encoding !== undefined && typeof obj.encoding !== "string") {
        return false;
    }
    return true;
}
