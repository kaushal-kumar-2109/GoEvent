const CheckUserAuth = () => {
    const userDataStr = localStorage.getItem("GoEventUserData");
    if (!userDataStr) return false;
    try {
        const userData = JSON.parse(userDataStr);
        if (!userData || !userData.validTill) return false;
        if (userData.validTill < Date.now()) {
            localStorage.removeItem("GoEventUserData");
            return false;
        }
        return true;
    } catch (e) {
        localStorage.removeItem("GoEventUserData");
        return false;
    }
}

const RemoveUserAuth = () => {
    localStorage.removeItem("GoEventUserData");
}

export { CheckUserAuth, RemoveUserAuth };