import {SortDirection} from "mongodb";

export type QueryPostInputModel = {
    pageNumber?: string | number
    pageSize?: string | number
    sortBy?: string
    sortDirection?: SortDirection
}