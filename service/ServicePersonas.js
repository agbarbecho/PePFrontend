import axios from 'axios';

export const  personas = 'http://localhost:8080/personas';


export const getAPI = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

export const createAPI = async (url, arg) => {
    console.log(url,arg)
    const response = await axios.post(url, arg);
    return response.data;
};

export const updateAPI = async (url, arg) => {
    const response = await axios.put(url, arg);
    return response.data;
};