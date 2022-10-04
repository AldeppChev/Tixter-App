import { useState } from 'react';

/**
 * @template Y the request function
 * @typedef apiRet
 * @property {Awaited<ReturnType<Y>>} data
 * @property {String} error
 * @property {String} errorMessage
 * @property {Function} resetError
 * @property {boolean} loading
 * @property {Y} request
 */

/**
 * Gives you the relevant tools to execute api calls asynchronously with error and loading management
 * @template Y the request function
 * @param {Y} apiFunc
 * @returns {apiRet<Y>}
 */
const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loadingState, setLoadingState] = useState(false);

    const request = async (...args) => {
        if (!loadingState) {
            setLoadingState(true);
        }
        let response;
        try {
            response = await apiFunc(...args);
            // console.log(JSON.stringify(response).length);
            resetError();
            setData(response);
            setLoadingState(false);
            return response;
        } catch (error) {
            setError(true);
            setErrorMessage(error);
            setLoadingState(false);
        }
        return response;
    };

    const resetError = () => {
        setError(false);
        setErrorMessage(null);
    };

    return {
        data,
        error,
        errorMessage,
        loadingState,
        resetError,
        request
    };
};

export default useApi;
