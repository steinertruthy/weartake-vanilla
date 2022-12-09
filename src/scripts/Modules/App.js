import { Requests } from "../requests.js"
import { Toast } from "../toast.js"


export class App {
    static listProducts = document.querySelector(".products__list")
    static listProductsCart = document.querySelector(".cart__list")
    static arrCart = []
    static arrCartStorage = JSON.parse(localStorage.getItem("@Weartake:cart")) || []

    static async handleRenderProducts (arrProducts) {
        
        const list = this.listProducts 
        list.innerHTML = ""


        if (!arrProducts) {
            arrProducts = await Requests.getAllProducts()   
        }

       const allCards = await Promise.all(arrProducts.map(async (product) => {
            return await this.handleCard(product)
        }))

        allCards.forEach((card) => {
            list.append(card)
        })
                
        this.handleRemoveLoading() 
        this.handlePageProduct()
    }

    static handleRenderProductsCart (arrProducts) {
        if (arrProducts.length) {
            arrProducts.forEach( async (product) => {
                const card = await this.handleCard(product, true)
                this.listProductsCart.append(card)
            })
        }
    }

    

    static async handleCard (product, isCartStorage, isListCart) {
        const { id, title, price, description, image } = product

        const card = document.createElement("li")
        const divImg = document.createElement("div")
        const img = document.createElement("img")
        const divData = document.createElement("div")
        const divInfo = document.createElement("div")
        const titleProduct = document.createElement("h2")
        const descriptionProduct = document.createElement("p")
        const divPriceBtn = document.createElement("div")
        const spanPrice = document.createElement("span")
        const btnCart = document.createElement("button")

        card.className = "card"
        divImg.className = "img"
        divData.className = "data"
        divInfo.className = "info"
        titleProduct.className = "title-4 font-weight-600 card__title"
        descriptionProduct.className = "text-2 card__description"
        divPriceBtn.className = "price-btn"
        spanPrice.className = "text-2 font-weight-600"
        btnCart.className = "text-2 button-effect btn__add-cart"
        btnCart.id = id

        img.src = image
        img.alt = description

        titleProduct.innerText = title
        descriptionProduct.innerText = description
        
   


        spanPrice.innerText = price.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency",
            minimumFractionDigits: 2
        })

        btnCart.innerText = "Adicionar ao carrinho"

        divImg.append(img)
        divData.append(divInfo, divPriceBtn)
        divInfo.append(titleProduct, descriptionProduct)
        divPriceBtn.append(spanPrice, btnCart)
        card.append(divImg, divData)

        if (isCartStorage) {
            card.classList.add("cart__product")
            descriptionProduct.classList.add("modal__cart--hidden")
            spanPrice.innerText = price.toLocaleString("pt-BR", {
                currency: "BRL",
                style: "currency",
                minimumFractionDigits: 2
            })
            btnCart.innerText = "Remover do carrinho"
        }

        return card
    }

    static handleModalCart () {
        const btnOpenCart = document.getElementById("btnOpenCart")
        const modalCartContainer = document.querySelector(".modal-cart__container")
        const modalCart = document.querySelector(".modal__cart")
        const btnCloseCart = document.getElementById("btnCloseCart")

        btnOpenCart.addEventListener("click", () => {

         
            modalCart.classList.remove("modal__animate--close")
            modalCart.classList.add("modal__animate--open")

            const modalCartOpen = modalCartContainer.classList.contains("modal__cart--hidden")

            if (modalCartOpen) {
                modalCartContainer.classList.remove("modal__cart--hidden")
            }
        })

        btnCloseCart.addEventListener("click", () => {
            modalCart.classList.add("modal__animate--close")
            modalCart.classList.remove("modal__animate--open")

            setTimeout(() => {
                modalCartContainer.classList.add("modal__cart--hidden")
            }, 500)
        })
    }

    static handleAddCart () {
        const listProducts = this.listProducts

        listProducts.addEventListener("click", (event) => {
            const click = event.target
            if (click.tagName == "BUTTON") {
                const idProduct = click.id
                this.handleListCard(idProduct)
            }
        })
    }
    
    static async handleListCard (idProduct) {
        const listCart = document.querySelector(".cart__list")

        const product = await Requests.getProductSpec(idProduct)

        this.arrCartStorage.push(product)
        localStorage.setItem("@Weartake:cart", JSON.stringify(this.arrCartStorage))

        const card = await this.handleCard(product, false, true)
        card.classList.add("cart__product")
        card.querySelector(".card__description").classList.add("modal__cart--hidden")
        card.querySelector("button").innerText = "Remover do carrinho"

        listCart.append(card)
        this.handleUpdateInfoCard(this.arrCartStorage)

        Toast.create("Produdo adicionado ao carrinho!", true)
    }

    static handleRemoveCart () {
        const listCart = document.querySelector(".cart__list")

        listCart.addEventListener("click", (event) => {
            const elementClick = event.target

            if (elementClick.tagName == "BUTTON") {
                const idProduct = elementClick.id
                const indexProduct = this.arrCartStorage.findIndex(({id}) => id == idProduct)
                this.arrCartStorage.splice(indexProduct, 1) 
                localStorage.setItem("@Weartake:cart", JSON.stringify(this.arrCartStorage))
                
                const card = elementClick.closest("li")
                card.remove()

                this.handleUpdateInfoCard(this.arrCartStorage)  
                Toast.create("Produto removido do carrinho", false)
            }
        })
    }

    static handleUpdateInfoCard (arrProdutcs) {
        const resume = document.querySelector(".resume")
        const spanQuantity = document.getElementById("spanQuantity")
        const spanPrice = document.getElementById("spanPrice")
        const cartMessage = document.querySelector(".cart__message")
        const contProductsCartHeader = document.querySelector(".cont__products")

        const qtProducts = arrProdutcs.length
        
        if (qtProducts > 0) {
            spanQuantity.innerText = qtProducts
            contProductsCartHeader.innerText = qtProducts
            let total = 0
            
            arrProdutcs.forEach((product) => {
                const { price } = product
                total += price
            }) 
  
            const totalValue = total.toLocaleString("pt-BR", {
                currency: "BRL",
                style: "currency",
                minimumFractionDigits: 2
            }) 

            spanPrice.innerText = totalValue
            
            resume.classList.remove("modal__cart--hidden")
            cartMessage.classList.add("modal__cart--hidden")
        } else {
            contProductsCartHeader.innerText = 0

            resume.classList.add("modal__cart--hidden")
            cartMessage.classList.remove("modal__cart--hidden")
        }
    }
    
    static handleCartStorage () {

        const arrStorage = this.arrCartStorage
        localStorage.setItem("@Weartake:cart", JSON.stringify(arrStorage))
        
        if (arrStorage.length) {
            this.handleRenderProductsCart(this.arrCartStorage)
            this.handleUpdateInfoCard(arrStorage)
        }
    }

    static async handleSearch () {
        const arrBtns = document.querySelectorAll(".btn__search")
        const arrProducts = await Requests.getAllProducts()
        
        const urlParam = new URLSearchParams(window.location.search)
        const urlSearch = urlParam.get("busca")
        
        
        if (urlSearch) {
            this.handleFilterSearch(arrProducts, urlSearch)
        }
        
        arrBtns.forEach((btn) => {
            btn.addEventListener("click", async () => {
                const inputSearch = btn.parentElement.querySelector(".input__search")
                const search = inputSearch.value.trim().toLowerCase()
                window.location = `../../../index.html?busca=${search}`

                if (search != "") {
                    this.handleFilterSearch(arrProducts, search)
                } else {
                    this.handleRenderProducts()
                }     
            })
        })
    }

    static async handleFilterSearch (arrProducts, search) {
        const arrSearch = arrProducts.filter((product) => {
            const { title, description, category } = product

            const data = { 
                title,
                description, 
                category 
            }

            for (let key in data) {
                if (String(data[key]).toLowerCase().includes(search)) {
                    return true
                }
            }
        })

        this.handleRenderProducts(arrSearch)

    }

    static async handleFilter () {
        const arrBtns = document.querySelectorAll(".btn__filter")
        const arrCatecategories = ["electronics", "jewelery", "men's clothing", "women's clothing"] 

        arrBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const idValue = btn.id.toLowerCase()

                arrCatecategories.forEach(async (category) => {
                    const valueCategory = category.replaceAll("'", "").replaceAll(" ", "").toLowerCase()

                    if (valueCategory == idValue) {
                        window.location = `../../../index.html?busca=${category}`
                   }
                })

                if (idValue == "all") {
                    window.location = `../../../index.html`
                }
            })
        })
    }

    static handleRemoveLoading () {
        const modal = document.querySelector(".modal__load")
        modal.classList.add("modal__load--close")
    }

    static handlePageProduct () {
        const cards = document.querySelectorAll(".products__list .card")
 

        cards.forEach((card) => {
            card.addEventListener("click", (event) => {

                const elementClick = event.target
               
                if (elementClick.tagName != "BUTTON") {
                    const idProduct = card.querySelector("button").id
                    window.location = `../../../src/pages/details/details.html?id=${idProduct}`
                }
            })
        })
    }
}


