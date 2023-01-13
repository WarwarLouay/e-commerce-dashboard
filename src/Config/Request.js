import axios from 'axios';
import Constant from './Constants';

class Request {
    constructor() {
        this.api = axios.create({
            baseURL: Constant.serverlink,
            timeout: Constant.timeout,
            headers: {
                "Content-Type": "application/json"
            },
        });
    }

    debugit() {
        this.api.interceptors.request.use((request) => {
            console.log("Starting Request", request);
            return request;
        });

        this.api.interceptors.response.use((response) => {
            console.log("Response:", response);
            return response;
        });
    }

    async get(path) {
        const link = "/api/" + path;
        return await this.api.get(link, path);
    }

    async deleteProduct(data) {
        const link = "/api/product/delete";
        return await this.api.post(link, data);
    }

    async updateProduct(data) {
        const link = "/api/product/update";
        return await this.api.post(link, data);
    }

    async deleteCategory(data) {
        const link = "/api/category/delete";
        return await this.api.post(link, data);
    }

    async deleteUser(data) {
        const link = "/api/user/delete";
        return await this.api.post(link, data);
    }

    async deleteOrder(data) {
        const link = "/api/order/delete";
        return await this.api.post(link, data);
    }
}

export default Request;