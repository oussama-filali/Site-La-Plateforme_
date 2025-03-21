document.addEventListener('DOMContentLoaded', async function () {
    await fetchData();

    document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;

        if (!email.endsWith('@laplateforme.io')) {
            showToast('Seuls les emails @laplateforme.io sont autorisés.', 'warning');
            return;
        }

        if (data.users.some(u => u.email === email)) {
            showToast('Un compte avec cet email existe déjà.', 'danger');
            return;
        }

        const newUser = { email, password, role: 'student', id: data.users.length + 1 };
        data.users.push(newUser);
        data.registrations.push({ userId: newUser.id, eventId: null, status: 'pending' });

        await saveData();
        sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
        showToast('Inscription réussie !', 'success');
        closeModal('signupModal');
        window.location.href = 'student-dashboard.html';
    });

    document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const user = data.users.find(u => u.email === email && u.password === password);
        if (!user) {
            showToast('Email ou mot de passe incorrect.', 'danger');
            return;
        }

        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        showToast('Connexion réussie !', 'success');
        window.location.href = user.role === 'student' ? 'student-dashboard.html' : 'admin.html';
    });

    document.getElementById('logoutButton')?.addEventListener('click', function () {
        sessionStorage.removeItem('loggedInUser');
        showToast('Vous avez été déconnecté.', 'info');
        window.location.href = 'index.html';
    });
});
