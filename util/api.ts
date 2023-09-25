import { Api } from "./api-client/gen/Api";

export const apiClient = new Api({
    baseUrl: "http://localhost:8090",
    baseApiParams: {
        mode: "cors",
    },
})
