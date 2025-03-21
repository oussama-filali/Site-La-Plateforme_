// Variables globales pour les données JSON
let data = {};

// Charger les données JSON
async function fetchData() {
    try {
        const response = await fetch('data.json');
        data = await response.json();
    } catch (error) {
        console.error('Erreur chargement JSON:', error);
        data = {};
    }
}

// Sauvegarder les données JSON (simulation)
async function saveData(updatedData) {
    console.log('Données sauvegardées :', updatedData);
    data = updatedData; // Mise à jour locale
}

// Fermer un modal
function closeModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) modal.hide();
}

// Vérifier l'utilisateur connecté
function checkLoggedInUser() {
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const currentPage = window.location.pathname;

    if (!user && (currentPage.includes('student-dashboard.html') || currentPage.includes('admin.html'))) {
        alert('Vous devez être connecté.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Inscription
document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!email.endsWith('@laplateforme.io')) {
        alert('Seuls les emails @laplateforme.io sont autorisés.');
        return;
    }

    await fetchData();
    if (data.users.some(u => u.email === email)) {
        alert('Un compte avec cet email existe déjà.');
        return;
    }

    const newUser = { id: data.users.length + 1, email, password, role: 'student' };
    data.users.push(newUser);
    data.registrations.push({ userId: newUser.id, eventId: null, status: 'en attente' });
    await saveData(data);

    sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
    alert('Inscription réussie !');
    closeModal('signupModal');
    window.location.href = 'student-dashboard.html';
});

// Connexion utilisateur
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    await fetchData();
    const user = data.users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Email ou mot de passe incorrect.');
        return;
    }

    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    alert('Connexion réussie !');
    window.location.href = user.role === 'student' ? 'student-dashboard.html' : 'admin.html';
});

// Confirmation/Modification date
document.getElementById('confirmDate')?.addEventListener('click', async function () {
    const selectedDate = document.getElementById('eventDate').value;

    if (!selectedDate) {
        alert('Veuillez sélectionner une date.');
        return;
    }

    await fetchData();
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const event = data.events.find(e => e.date === selectedDate);

    if (!event || event.registered >= event.maxParticipants) {
        alert('Événement complet ou non disponible.');
        return;
    }

    const registration = data.registrations.find(r => r.userId === user.id);
    if (registration) {
        registration.eventId = event.id;
        registration.status = 'en attente';
    } else {
        data.registrations.push({ userId: user.id, eventId: event.id, status: 'en attente' });
    }

    event.registered++;
    await saveData(data);
    alert(`Votre présence pour le ${selectedDate} a été enregistrée.`);
    closeModal('calendarModal');
    window.location.reload();
});

// Déconnexion
document.getElementById('logoutButton')?.addEventListener('click', function () {
    sessionStorage.removeItem('loggedInUser');
    alert('Vous avez été déconnecté.');
    window.location.href = 'index.html';
});

// Affichage des alertes UX avec Bootstrap Toast
function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.innerHTML = `<div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
    toastContainer.appendChild(toast);
    new bootstrap.Toast(toast).show();
}
