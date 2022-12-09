export class MenuHamb {
    static menuHamb () {
        const btnMenu = document.querySelector(".menu__hamb")
        const menu = document.querySelector(".menu__container")
        btnMenu.addEventListener("click", () => {
            console.log("Olas");
            btnMenu.classList.toggle("menu__hamb--open")
            menu.classList.toggle("menu__container--open")
        })
    }
}