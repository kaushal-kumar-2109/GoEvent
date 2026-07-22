const FetchDataCall = async (url, method, data = null) => {
    try {
        const isFormData = data instanceof FormData;
        const headers = {};
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: headers,
            credentials: 'include',
            body: data ? (isFormData ? data : JSON.stringify(data)) : undefined
        });
        const json = await response.json();
        return json;
    } catch (err) {
        return ({
            flag: false,
            message: "Failed to fetch data",
            error: err
        });
    }
}


export default FetchDataCall;