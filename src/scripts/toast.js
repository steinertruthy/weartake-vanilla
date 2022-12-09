class Toast {
    static create (text, status) {
        let color = ""
        if (status) {
            color = "#2E245E "
        } else {
            color = "#852121"
        }

        Toastify({
            text: text,
            duration: 2500,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: color,
            },
          }).showToast();
    }
}

export { Toast }