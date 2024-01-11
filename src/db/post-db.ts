export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string
    blogId: string
    blogName: string
}

export const postDB: PostType[] = [
    {
        id: "string1",
        title: "it",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "Blog1"
    },
    {
        id: "string2",
        title: "back",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "Blog2"
    },
    {
        id: "string3",
        title: "front",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "Blog3"
    },
]