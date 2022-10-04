import parseApi from 'api/parseApi';
import AuthContext from 'context/AuthContext';
import { useContext } from 'react';

const useAuthentification = () => {
    const { user, setUser } = useContext(AuthContext);

    const logIn = async (username, password) => {
        await parseApi.logIn(username, password).then(() => setUser(parseApi.currentUser()));
    };

    const logOut = async () => {
        await parseApi.logOut();
        setUser(null);
    };

    const signUp = (username, password, email, fullName) => {
        return parseApi.signUp(username, password, { email, fullName }).then(() => setUser(parseApi.currentUser()));
    };

    return { user, setUser, logIn, logOut, signUp };
};

export default useAuthentification;
