const FetchDataCall = async (url, method, data = null) => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: (data ? JSON.stringify(data) : undefined)
        });
        const json = await response.json();
        return json;
    } catch (err) {
        return ({
            flag: false,
            message: "Faild to fetch data",
            error: err
        });
    }
}


export default FetchDataCall;