export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export const blogDB: BlogType[] = [
    {
        id: "111",
        name: "IT",
        description: "incubator",
        websiteUrl: "https://samurai.it-incubator.io/"
    },
    {
        id: "112",
        name: "IT1",
        description: "incubator",
        websiteUrl: "https://samurai.it-incubator.io/"
    },
    {
        id: "113",
        name: "IT2",
        description: "incubator",
        websiteUrl: "https://samurai.it-incubator.io/"
    }
]