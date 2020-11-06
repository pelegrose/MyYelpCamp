// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
    // This allows the names of files to be displayd when uploading new images
    bsCustomFileInput.init();
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()