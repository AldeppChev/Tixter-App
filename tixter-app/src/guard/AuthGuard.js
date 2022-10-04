/*
 * Copyright (c) 2022 Eliott Guillaumin
 * All rights reserved.
 */
import { Navigate } from 'react-router';
import useAuthentication from '../hooks/useAuthentication';

const AuthGuard = (props) => {
    const { user } = useAuthentication();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return <>{props.children}</>;
};

export default AuthGuard;
