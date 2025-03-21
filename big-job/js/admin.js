document.addEventListener('DOMContentLoaded', async function () {
    await fetchData();
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    function loadRegistrations() {
        const studentList = document.getElementById('studentList');
        if (!studentList) return;
        studentList.innerHTML = '';

        data.registrations.forEach((reg, index) => {
            const user = data.users.find(u => u.id === reg.userId);
            studentList.innerHTML += `
                <tr>
                    <td>${user.email}</td>
                    <td>${reg.date || 'Non choisi'}</td>
                    <td id="status-${index}">${reg.status}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="updateStatus(${index}, 'accepted')">Accepter</button>
                        <button class="btn btn-danger btn-sm" onclick="updateStatus(${index}, 'rejected')">Refuser</button>
                    </td>
                </tr>
            `;
        });
    }

    loadRegistrations();
});
