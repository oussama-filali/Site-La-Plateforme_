$(document).ready(function() {
    // Données JSON (simulées ici, à charger depuis data.json dans un projet réel)
    const data = {
        "users": [
            {"email": "user1@laplateforme.io", "password": "password123", "role": "student"},
            {"email": "admin@laplateforme.io", "password": "adminpass", "role": "admin"}
        ],
        "events": [
            {"date": "2025-03-25", "title": "Journée Portes Ouvertes - Alternance", "maxParticipants": 50, "registered": 30},
            {"date": "2025-03-26", "title": "Journée Portes Ouvertes - Développement Web", "maxParticipants": 40, "registered": 20}
        ]
    };

    // Afficher les événements sur la page d'accueil
    function loadEvents() {
        const eventList = $('#eventList');
        data.events.forEach(event => {
            const availability = event.maxParticipants - event.registered;
            const card = `
                <div class="col-md-6 mb-3">
                    <div class="card glass-effect">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">Date: ${event.date}</p>
                            <p class="card-text">Places restantes: ${availability}/${event.maxParticipants}</p>
                        </div>
                    </div>
                </div>
            `;
            eventList.append(card);
        });
    }
    loadEvents();

    // Charger les événements dans le modal du tableau de bord
    function loadEventOptions() {
        const eventSelect = $('#eventSelect');
        data.events.forEach(event => {
            const availability = event.maxParticipants - event.registered;
            if (availability > 0) {
                eventSelect.append(`<option value="${event.date}">${event.title} (${event.date}) - ${availability} places</option>`);
            }
        });
    }
    loadEventOptions();

    // Vérification email domaine @laplateforme.io pour inscription
    $('#signupForm').submit(function(e) {
        e.preventDefault();
        const email = $('#signupEmail').val();
        const password = $('#signupPassword').val();
        if (!email.endsWith('@laplateforme.io')) {
            alert('Veuillez utiliser une adresse @laplateforme.io');
            return;
        }
        // Simulation ajout utilisateur
        data.users.push({"email": email, "password": password, "role": "student"});
        alert('Inscription réussie !');
        window.location.href = 'student-dashboard.html';
    });

    // Connexion utilisateur
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        const user = data.users.find(u => u.email === email && u.password === password);
        if (!user) {
            alert('Email ou mot de passe incorrect.');
            return;
        }
        if (user.role === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (user.role === 'admin') {
            window.location.href = 'admin.html';
        }
        alert('Connexion réussie !');
    });

    // Confirmation date
    $('#confirmDate').click(function() {
        const selectedDate = $('#eventSelect').val();
        const today = new Date('2025-03-21'); // Date actuelle
        const chosenDate = new Date(selectedDate);

        if (chosenDate < today) {
            alert('Vous ne pouvez pas choisir une date passée.');
            return;
        }

        const event = data.events.find(e => e.date === selectedDate);
        if (event.registered >= event.maxParticipants) {
            alert('Cet événement est complet.');
            return;
        }

        event.registered += 1; // Simule l'inscription
        alert(`Présence confirmée pour ${event.title} le ${selectedDate}`);
        $('#calendarModal').modal('hide');
    });
});