import { Requests } from "../../scripts/requests.js"
import { App } from "../../scripts/Modules/App.js"
import { MenuHamb } from "../../scripts/menuHamb.js"

export class Details {
    static detailsContainer = document.querySelector(".details__product")
    static listProducst = document.querySelector(".products__list")

    static handleGetIdUrl () {
        const urlParam = new URLSearchParams(window.location.search)
        const idProduct = urlParam.get("id")
        
        this.handleRenderProduct(idProduct)
    }

    static async handleRenderProduct (idProduct) {

        const product = await Requests.getProductSpec(idProduct)
        const obj = await this.handleCardProduct(product)
        const { section, category } = obj
        this.detailsContainer.append(section)

        this.handleAddCartProductMain()
        this.handleRenderSimilar(category)
    }   

    static async handleCardProduct(product) {
        let {id, title, price, description, category, image} = product

        
        const section = document.createElement("section")
        const divImgtitleBtn = document.createElement("div")
        const divImg = document.createElement("div")
        const imgProduct = document.createElement("img")
        const divTitleBtn = document.createElement("div")
        const titleProduct = document.createElement("h2")
        const spanPrice = document.createElement("span")
        const btnAddcart = document.createElement("button")
        const divDescription = document.createElement("div")
        const h3TitleDescription = document.createElement("h3")
        const descriptionProduct = document.createElement("p")

        section.className = "product__container"
        divImgtitleBtn.className = "product__image-title-btn"       
        divImg.className = "product__image"
        divTitleBtn.className = "product__title-btn"
        titleProduct.className = "product__title title-2 font-weight-600"
        spanPrice.className = "title-2 font-weight-700"
        btnAddcart.className = "product__btn title-2 font-weight-500 btn__add-cart"
        divDescription.className = "product__description"
        h3TitleDescription.className = "title-2 font-weight-700"
        descriptionProduct.className = "description title-3"

        price = price.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency",
            minimumIntegerDigits: 2
        })

        btnAddcart.setAttribute("data-btn-cart-main", id)
        btnAddcart.innerText ="Adicionar ao carrinho"
        h3TitleDescription.innerText = "Descrição"

        imgProduct.src = image
        imgProduct.alt = title
        titleProduct.innerText = title
        spanPrice.innerText = price
        descriptionProduct.innerText = description

        section.append(divImgtitleBtn, divDescription)
        divImgtitleBtn.append(divImg, divTitleBtn)
        divImg.append(imgProduct)
        divTitleBtn.append(titleProduct, spanPrice, btnAddcart)
        divDescription.append(h3TitleDescription, descriptionProduct)


        this.handleHeadPage(title, description)

        return {
            section,
            category
        }
    }

    static handleHeadPage(title, description) {
        const titlePage = document.querySelector("title")
        const descriptionPage = document.getElementById("descriptionPage")

        titlePage.innerText = `Weartake - ${title}`
        descriptionPage.content = description
    }

    static async handleRenderSimilar (category) {
        const arrProducts = await Requests.getProductsCategorie(category)

        await Promise.all(arrProducts.map(async (product) => {
            const card = await App.handleCard(product)
            this.listProducst.append(card)
        })) 

        App.handlePageProduct()
        App.handleAddCart()
    }

    static async handleAddCartProductMain () {
        const btn = document.querySelector("[data-btn-cart-main]")

        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-btn-cart-main")
            App.handleListCard(id)
        })
    }
}

MenuHamb.menuHamb()
Details.handleGetIdUrl()
App.handleModalCart()
App.handleRemoveCart()
App.handleCartStorage()
App.handleSearch()
App.handleFilter()