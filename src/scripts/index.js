import { MenuHamb } from "./menuHamb.js";
import { App } from "./Modules/App.js";



class Index {
    static isRenderProducts () {
        const urlParam = new URLSearchParams(window.location.search)
        const search = urlParam.get("busca")

        if (!search) {
            App.handleRenderProducts()
        }
    }
}

MenuHamb.menuHamb()
Index.isRenderProducts()
App.handleModalCart()
App.handleAddCart()
App.handleRemoveCart()
App.handleCartStorage()
App.handleSearch()
App.handleFilter()



/*egg*/
console.log("%c Steiner", "font-weight: 700; font-size: 28px; font-style: italic");
