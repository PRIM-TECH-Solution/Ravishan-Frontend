import axios from "axios";

const USER_API_BASE_URL1 = "http://localhost:8080/eventcards/add";

const addEvent = async (eventData) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(USER_API_BASE_URL1, eventData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default { addEvent };