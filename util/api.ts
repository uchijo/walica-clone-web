import { Api } from "./api-client/gen/Api";

const apiBase = process.env.NEXT_PUBLIC_API_BASE

if (!apiBase) {
    throw new Error("API_BASE is not defined")
}

export const apiClient = new Api({
    baseUrl: apiBase,
    baseApiParams: {
        mode: "cors",
    },
})
