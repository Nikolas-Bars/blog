import {SortDirection} from "mongodb";

export type QueryUserInputModel = {
    pageNumber?: string | number
    pageSize?: string | number
    sortBy?: string
    sortDirection?: SortDirection
    searchLoginTerm?: string
    searchEmailTerm?: string
}