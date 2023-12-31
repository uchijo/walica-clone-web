/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiAddPaymentReply {
  id?: string;
}

export interface ApiAddPaymentRequest {
  name?: string;
  /** @format int32 */
  price?: number;
  payerId?: string;
  eventId?: string;
  payeeIds?: string[];
}

export interface ApiCreateEventReply {
  id?: string;
}

export interface ApiCreateEventRequest {
  name?: string;
  members?: string[];
}

export interface ApiDeletePaymentReply {
  paymentId?: string;
}

export interface ApiDeletePaymentRequest {
  paymentId?: string;
}

export interface ApiExchange {
  /** @format int32 */
  price?: number;
  payer?: ApiUser;
  payee?: ApiUser;
}

export interface ApiPayment {
  name?: string;
  /** @format int32 */
  price?: number;
  payer?: ApiUser;
  payees?: ApiUser[];
  id?: string;
}

export interface ApiPaymentSummary {
  user?: ApiUser;
  /** @format int32 */
  totalExpense?: number;
}

export interface ApiReadAllUsersReply {
  users?: ApiUser[];
}

export interface ApiReadAllUsersRequest {
  eventId?: string;
}

export interface ApiReadInfoReply {
  payments?: ApiPayment[];
  exchanges?: ApiExchange[];
  summaries?: ApiPaymentSummary[];
  /** @format int32 */
  totalExpense?: number;
  eventName?: string;
}

export interface ApiReadInfoRequest {
  id?: string;
}

export interface ApiReadPaymentReply {
  payment?: ApiPayment;
}

export interface ApiReadPaymentRequest {
  paymentId?: string;
}

export interface ApiUpdatePaymentReply {
  paymentId?: string;
}

export interface ApiUpdatePaymentRequest {
  paymentId?: string;
  name?: string;
  /** @format int32 */
  price?: number;
  payerId?: string;
  payeeIds?: string[];
}

export interface ApiUser {
  name?: string;
  id?: string;
}

export interface ProtobufAny {
  "@type"?: string;
  [key: string]: any;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title api/api.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @tags WalicaCloneApi
     * @name WalicaCloneApiCreateEvent
     * @request POST:/v1/event/add
     */
    walicaCloneApiCreateEvent: (body: ApiCreateEventRequest, params: RequestParams = {}) =>
      this.request<ApiCreateEventReply, RpcStatus>({
        path: `/v1/event/add`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WalicaCloneApi
     * @name WalicaCloneApiReadInfo
     * @request POST:/v1/event/info
     */
    walicaCloneApiReadInfo: (body: ApiReadInfoRequest, params: RequestParams = {}) =>
      this.request<ApiReadInfoReply, RpcStatus>({
        path: `/v1/event/info`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WalicaCloneApi
     * @name WalicaCloneApiAddPayment
     * @request POST:/v1/payment/add
     */
    walicaCloneApiAddPayment: (body: ApiAddPaymentRequest, params: RequestParams = {}) =>
      this.request<ApiAddPaymentReply, RpcStatus>({
        path: `/v1/payment/add`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WalicaCloneApi
     * @name WalicaCloneApiDeletePayment
     * @request POST:/v1/payment/delete
     */
    walicaCloneApiDeletePayment: (body: ApiDeletePaymentRequest, params: RequestParams = {}) =>
      this.request<ApiDeletePaymentReply, RpcStatus>({
        path: `/v1/payment/delete`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WalicaCloneApi
     * @name WalicaCloneApiReadPayment
     * @request POST:/v1/payment/read
     */
    walicaCloneApiReadPayment: (body: ApiReadPaymentRequest, params: RequestParams = {}) =>
      this.request<ApiReadPaymentReply, RpcStatus>({
        path: `/v1/payment/read`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WalicaCloneApi
     * @name WalicaCloneApiUpdatePayment
     * @request POST:/v1/payment/update
     */
    walicaCloneApiUpdatePayment: (body: ApiUpdatePaymentRequest, params: RequestParams = {}) =>
      this.request<ApiUpdatePaymentReply, RpcStatus>({
        path: `/v1/payment/update`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WalicaCloneApi
     * @name WalicaCloneApiReadAllUsers
     * @request POST:/v1/user/all
     */
    walicaCloneApiReadAllUsers: (body: ApiReadAllUsersRequest, params: RequestParams = {}) =>
      this.request<ApiReadAllUsersReply, RpcStatus>({
        path: `/v1/user/all`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
