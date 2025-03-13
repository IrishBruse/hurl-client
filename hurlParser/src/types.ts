export type HurlParseResult =
    | {
          sucess: true;
          data: Hurl;
      }
    | {
          sucess: false;
          error: string;
      };

export type Hurl = {
    entries: Entry[];
};

export type Entry = {
    request: Request;
    response?: Response;
};

export type Request = {
    method: Method;
    url: string;
    comments?: string[];
    options?: Option[];
    formParams?: Cooky[];
    headers?: Cooky[];
    body?: RequestBody;
    queryStringParams?: Cooky[];
    multipartFormData?: MultipartFormDatum[];
    cookies?: Cooky[];
};

export type RequestBody = {
    type?: BodyType;
    value?: number[] | boolean | PurpleValue | number | string;
    filename?: string;
    encoding?: Encoding;
};

export type Encoding = "base64" | "regex";

export type BodyType = "text" | "json" | "graphql" | "xml" | "file";

// todo

export type PurpleValue = {
    name?: string;
    age?: number | string;
    query?: string;
    user?: string;
    password?: string;
    strict?: boolean;
    spacing?: string;
    gClef?: string;
    items?: (boolean | number | string)[];
    variable?: string;
    empty?: string;
    natural?: number;
    negative?: number;
    float?: number;
    floatWith00?: number;
    exponent?: number;
    height?: string;
    female?: string;
    id?: string;
    aNull?: string;
    country?: string;
    planet?: string;
    galaxy?: string;
    foo?: string;
    baz?: boolean;
};

export type Cooky = {
    name: string;
    value: string;
};

export type Method =
    | "GET"
    | "PUT"
    | "POST"
    | "HEAD"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "PATCH"
    | "LINK"
    | "UNLINK"
    | "PURGE"
    | "LOCK"
    | "UNLOCK"
    | "PROPFIND"
    | "VIEW";

export type MultipartFormDatum = {
    name: string;
    value?: string;
    filename?: string;
    contentType?: string;
};

export type Option = {
    name: string;
    value: boolean | number | string;
    unit?: string;
};

export type Response = {
    status?: number;
    version?: string;
    body?: ResponseBody;
    asserts?: Assert[];
    headers?: Cooky[];
    captures?: Capture[];
};

export type Assert = {
    query: AssertQuery;
    predicate: Predicate;
    filters?: AssertFilter[];
};

export type AssertFilter = {
    type: string;
    fmt?: string;
    n?: number;
    expr?: ExprClass | string;
    encoding?: string;
    sep?: string;
    oldValue?: string;
    newValue?: string;
};

export type ExprClass = {
    type: Encoding;
    value: string;
};

export type Predicate = {
    type: PredicateType;
    value?: boolean | FluffyValue | number | null | string;
    encoding?: Encoding;
    not?: boolean;
};

export type PredicateType =
    | "equal"
    | "exist"
    | "greater"
    | "include"
    | "isCollection"
    | "not-equal"
    | "isBoolean"
    | "isEmpty"
    | "isString"
    | "less-or-equal"
    | "less"
    | "isFloat"
    | "isNumber"
    | "isInteger"
    | "isIsoDate"
    | "greater-or-equal"
    | "start-with"
    | "end-with"
    | "contain"
    | "match";

export type FluffyValue = {
    type: BodyType;
    filename: string;
};

export type AssertQuery = {
    type: QueryType;
    name?: string;
    expr?: ExprClass | string;
};

export type QueryType = "body" | "bytes" | "header" | "variable" | "jsonpath" | "regex" | "status" | "sha256" | "md5" | "xpath" | "url" | "cookie" | "duration";

export type ResponseBody = {
    type?: BodyType;
    value?: number[] | TentacledValue | string;
    filename?: string;
    encoding?: Encoding;
};

export type TentacledValue = {
    count?: number;
    success?: boolean;
    errors?: Error[];
    failures?: Error[];
    duration?: number;
    tags?: string[];
    nullable?: null;
    profileID?: string;
    dates?: Date[];
    fruit?: Fruit[];
    main?: Main;
    more?: More;
    bigInteger?: number;
    list?: number[];
    message?: string;
    url?: string;
    encodedURL?: string;
    text?: string;
    escapedHTML?: string[];
    id?: string;
    score?: number;
    ips?: string;
    json?: string;
    pi?: string;
    ten?: number;
    store?: Store;
    integer?: number;
    float?: number;
    smallFloat1?: number;
    smallFloat2?: number;
    bigFloat1?: number;
    bigFloat2?: number;
};

export type Error = {
    id: string;
};

export type Fruit = {
    name: string;
    price: Price;
};

export type Price = {
    us: number;
    un: number;
};

export type Main = {
    items: MainItem[];
};

export type MainItem = {
    id: number;
    name: string;
    items?: ItemItem[];
};

export type ItemItem = {
    id: number;
    name: string;
};

export type More = {
    items: ItemItem[];
};

export type Store = {
    book: Book[];
    bicycle: Bicycle;
};

export type Bicycle = {
    color: string;
    price: number;
};

export type Book = {
    category: string;
    published: boolean;
    author: string;
    title: string;
    price: number;
    isbn?: string;
};

export type Capture = {
    name: string;
    query: CaptureQuery;
    filters?: CaptureFilter[];
};

export type CaptureFilter = {
    type: FilterType;
    expr?: ExprClass | string;
    fmt?: string;
};

export type FilterType = "regex" | "toDate" | "count";

export type CaptureQuery = {
    type: QueryType;
    name?: string;
    expr?: string;
};
