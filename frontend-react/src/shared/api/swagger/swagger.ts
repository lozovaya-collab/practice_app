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

export interface PingResponse {
  message: string;
}

export interface User {
  /** @format double */
  id: number;
  login: string;
}

export interface UserNotAuthorized {
  message: "User not authorized";
}

export interface InternalServerErrorResponse {
  message: "Internal Server Error";
}

export interface UserValidateError {
  message: "Validation failed";
  details: {
    password: boolean;
    login: boolean;
  };
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickUserWithPasswordExcludeKeysId {
  password: string;
  login: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitUserWithPasswordId = PickUserWithPasswordExcludeKeysId;

export type UserCreateParams = OmitUserWithPasswordId;

export interface UserAuthorizationFailed {
  message: "Authorization failed";
}

export interface TaskStatuses {
  /** @format double */
  id: number;
  name: string;
}

export interface QueryParamsValidateError {
  message: "Validation failed";
  details: Record<string, boolean>;
}

export interface TaskStatusesValidateError {
  message: "Validation failed";
  details: {
    name: boolean;
  };
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickTaskStatusesExcludeKeysId {
  name: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitTaskStatusesId = PickTaskStatusesExcludeKeysId;

export type TaskStatusesCreateParams = OmitTaskStatusesId;

export interface Task {
  /** @format double */
  id: number;
  /** @format double */
  status_id: number;
  /** @format double */
  author_id: number;
  created_date: string;
  update_date: string;
  title: string;
  description: string | null;
}

export interface TaskValidateError {
  message: "Validation failed";
  details: {
    status_id?: boolean;
    author_id?: boolean;
    description?: boolean;
    title?: boolean;
    id?: boolean;
  };
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickTaskCreateParamsExcludeKeysAuthorId {
  title: string;
  description: string | null;
  /** @format double */
  status_id: number;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitTaskCreateParamsAuthorId = PickTaskCreateParamsExcludeKeysAuthorId;

/** From T, pick a set of properties whose keys are in the union K */
export interface PickTaskUpdateParamsExcludeKeysId {
  title?: string;
  description?: string;
  /** @format double */
  status_id?: number;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitTaskUpdateParamsId = PickTaskUpdateParamsExcludeKeysId;

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "/" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title vkr
 * @version 1.0.0
 * @license ISC
 * @baseUrl /
 * @contact
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  ping = {
    /**
     * No description
     *
     * @tags Ping
     * @name GetPing
     * @request GET:/ping
     */
    getPing: (params: RequestParams = {}) =>
      this.request<PingResponse, any>({
        path: `/ping`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Получение всех пользователей
     *
     * @tags User
     * @name Get
     * @summary get
     * @request GET:/users
     * @secure
     */
    Get: (params: RequestParams = {}) =>
      this.request<User[], UserNotAuthorized | InternalServerErrorResponse>({
        path: `/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создание пользователя
     *
     * @tags Auth, User
     * @name Create
     * @summary create
     * @request POST:/users
     */
    Create: (data: UserCreateParams, params: RequestParams = {}) =>
      this.request<User, UserValidateError | InternalServerErrorResponse>({
        path: `/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение пользователей по id
     *
     * @tags User
     * @name GetById
     * @summary get By Id
     * @request GET:/users/{id}
     * @secure
     */
    GetById: (id: string, params: RequestParams = {}) =>
      this.request<User | null, UserNotAuthorized | InternalServerErrorResponse>({
        path: `/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление пользователя. Удалить пользователя может только он сам
     *
     * @tags User
     * @name Delete
     * @summary delete
     * @request DELETE:/users/{id}
     */
    Delete: (id: string, params: RequestParams = {}) =>
      this.request<boolean, UserAuthorizationFailed | InternalServerErrorResponse>({
        path: `/users/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description Авторизация
     *
     * @tags Auth
     * @name Login
     * @summary login
     * @request POST:/login
     */
    Login: (data: UserCreateParams, params: RequestParams = {}) =>
      this.request<User, UserAuthorizationFailed | UserValidateError | InternalServerErrorResponse>({
        path: `/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * @description Выход
     *
     * @tags Auth
     * @name Logout
     * @summary logout
     * @request POST:/logout
     */
    Logout: (params: RequestParams = {}) =>
      this.request<void, InternalServerErrorResponse>({
        path: `/logout`,
        method: "POST",
        ...params,
      }),
  };
  me = {
    /**
     * @description Профиль
     *
     * @tags Auth
     * @name Me
     * @summary me
     * @request GET:/me
     * @secure
     */
    Me: (params: RequestParams = {}) =>
      this.request<User, UserNotAuthorized | InternalServerErrorResponse>({
        path: `/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  taskStatuses = {
    /**
     * @description Получение всех статусов
     *
     * @tags TaskSatuses
     * @name Get
     * @summary get
     * @request GET:/task-statuses
     * @secure
     */
    Get: (params: RequestParams = {}) =>
      this.request<TaskStatuses[], UserNotAuthorized | InternalServerErrorResponse>({
        path: `/task-statuses`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создание статуса
     *
     * @tags Auth, TaskSatuses
     * @name Create
     * @summary create
     * @request POST:/task-statuses
     */
    Create: (data: TaskStatusesCreateParams, params: RequestParams = {}) =>
      this.request<TaskStatuses, UserNotAuthorized | TaskStatusesValidateError | InternalServerErrorResponse>({
        path: `/task-statuses`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение статуса по id
     *
     * @tags TaskSatuses
     * @name GetById
     * @summary get By Id
     * @request GET:/task-statuses/{id}
     * @secure
     */
    GetById: (id: string, params: RequestParams = {}) =>
      this.request<TaskStatuses | null, UserNotAuthorized | QueryParamsValidateError | InternalServerErrorResponse>({
        path: `/task-statuses/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление статуса
     *
     * @tags TaskSatuses
     * @name Delete
     * @summary delete
     * @request DELETE:/task-statuses/{id}
     */
    Delete: (id: string, data: string, params: RequestParams = {}) =>
      this.request<boolean, UserNotAuthorized | InternalServerErrorResponse>({
        path: `/task-statuses/${id}`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  tasks = {
    /**
     * @description Получение всех задач с фильтрами
     *
     * @tags Tasks
     * @name Get
     * @summary get
     * @request GET:/tasks
     * @secure
     */
    Get: (
      query?: {
        author_id?: number[];
        status_id?: number[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Task[], UserNotAuthorized | UserValidateError | InternalServerErrorResponse>({
        path: `/tasks`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создание задачу
     *
     * @tags Tasks
     * @name Create
     * @summary create
     * @request POST:/tasks
     */
    Create: (data: OmitTaskCreateParamsAuthorId, params: RequestParams = {}) =>
      this.request<Task, UserNotAuthorized | TaskValidateError | InternalServerErrorResponse>({
        path: `/tasks`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение задачи по id
     *
     * @tags Tasks
     * @name GetById
     * @summary get By Id
     * @request GET:/tasks/{id}
     * @secure
     */
    GetById: (id: string, params: RequestParams = {}) =>
      this.request<Task | null, UserNotAuthorized | InternalServerErrorResponse>({
        path: `/tasks/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Редактирование задачи
     *
     * @tags Tasks
     * @name Update
     * @summary update
     * @request PUT:/tasks/{id}
     */
    Update: (id: number, data: OmitTaskUpdateParamsId, params: RequestParams = {}) =>
      this.request<Task, UserNotAuthorized | UserAuthorizationFailed | TaskValidateError | InternalServerErrorResponse>(
        {
          path: `/tasks/${id}`,
          method: "PUT",
          body: data,
          type: ContentType.Json,
          format: "json",
          ...params,
        },
      ),

    /**
     * @description Удаление задачи. Удалить задачу может только он автор
     *
     * @tags Tasks
     * @name Delete
     * @summary delete
     * @request DELETE:/tasks/{id}
     */
    Delete: (id: string, params: RequestParams = {}) =>
      this.request<boolean, UserAuthorizationFailed | InternalServerErrorResponse>({
        path: `/tasks/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
}
