export class Requests {
    static baseUrlProducts = "https://fakestoreapi.com"

    static async getAllProducts () {
        const response = await fetch(`${this.baseUrlProducts}/products`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(resp => resp.json())
        .catch(err => console.log(err))

        return response
    }

    static async getProductSpec (idProduct) {
        const response = await fetch(`${this.baseUrlProducts}/products/${idProduct}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(resp => resp.json())
        .catch(err => console.log(err))

        return response
    }

    static async getProductsCategorie (category) {
        const response = await fetch(`${this.baseUrlProducts}/products/category/${category}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(resp => resp.json())
        .catch(err => console.log(err))

        return response
    }

}