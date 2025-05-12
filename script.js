document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cultForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const reason = document.getElementById('reason').value.trim();
        const laughingGas = document.getElementById('laughingGas').checked;

        if (!name || !reason) {
            formMessage.textContent = 'Please fill out all fields!';
            formMessage.style.color = '#ff00cc';
            return;
        }
        if (!laughingGas) {
            formMessage.textContent = 'You must consent to the laughing gas!';
            formMessage.style.color = '#ff00cc';
            return;
        }
        formMessage.innerHTML = `<span style='font-size:1.2em;'>🎈 Welcome, <b>${name}</b>! Prepare for uncontrollable laughter! 😂</span>`;
        formMessage.style.color = '#fff';
        form.reset();
    });
});
