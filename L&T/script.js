document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.getElementById('registerButton');
    const modal = document.getElementById('registrationModal');
    const registrationForm = document.getElementById('registrationForm');

    registerButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone })
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            modal.style.display = 'none';
        })
        .catch(error => console.error(error));
    });
});
