function validateEmail(email) {
    const domain = email.split('@')[1];
    if (domain !== 'laplateforme.io') {
        alert('Seuls les emails @laplateforme.io sont autorisés !');
        return false;
    }
    return true;
}