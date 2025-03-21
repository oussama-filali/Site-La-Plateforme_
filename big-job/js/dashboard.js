document.addEventListener('DOMContentLoaded', async function () {
    await fetchData();
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!user || user.role !== 'student') {
        window.location.href = 'index.html';
        return;
    }

    function loadEvents() {
        const eventList = document.getElementById('eventList');
        if (!eventList) return;
        eventList.innerHTML = '';

        data.events.forEach(event => {
            const availability = event.maxParticipants - event.registered;
            eventList.innerHTML += `
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">Date: ${event.date}</p>
                            <p class="card-text">Places restantes: ${availability}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    loadEvents();
});
