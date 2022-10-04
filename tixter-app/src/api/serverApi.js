/*
 * Copyright (c) 2022 Eliott Guillaumin
 * All rights reserved.
 */
const { create } = require('apisauce');

const api = create({
    baseURL: 'https://parseapi.back4app.com/classes',
    headers: {
        'X-Parse-Application-Id': '4NsQpfWY23Hhjc1CQ2z5l1dE0G9mGupSsuK4TZwR',
        'X-Parse-REST-API-Key': 'nNsOZZGLGh1HcyHwr4prho9zQBuFCxNXNEcWUFPA',
        'Content-Type': 'application/json'
    }
});

const getUsers = async () => {
    const ret = await api.get('/userProfile');
    if (!ret.ok) throw new Error(ret.originalError);
    return ret.data?.results;
};

const addUser = async (user) => {
    const ret = await api.post('/userProfile', user);
    if (!ret.ok) throw new Error(ret.originalError);
    return ret.data;
};

const editUser = async (user) => {
    const ret = await api.put(`/userProfile/${user.objectId}`, user);
    if (!ret.ok) throw new Error(ret.originalError);
    return ret.data;
};

const deleteUser = async (user) => {
    const ret = await api.delete(`/userProfile/${user.objectId}`);
    if (!ret.ok) throw new Error(ret.originalError);
    return ret.data;
};

export default { getUsers, addUser, editUser, deleteUser };
