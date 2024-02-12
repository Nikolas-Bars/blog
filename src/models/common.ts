import { Request, Response } from "express";

export type ParamType = {
    id: string
}

// export type CustomRequest<ResBody = any> = Request & {userId: any}

export type RequestWithParams<P> = Request<P, {}, {}, {}>

export type RequestWithBody<B> = Request<{}, {}, B, {}>

export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>

export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>

export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>

export type ResponseType<T> = Response<T, {}>



export const HTTP_RESPONSE_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    FORBIDDEN: 403
}

export type ErrorsType = {
    errorsMessages: ErrorMessageType[]
}

export type ErrorMessageType = {
    field: string
    message: string
}

export type PaginationType<I> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: I[]
}