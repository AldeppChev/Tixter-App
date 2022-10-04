import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import useAuthentication from '../hooks/useAuthentication';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { user } = useAuthentication();

    // const route = user ? MainRoutes : AuthenticationRoutes;
    return useRoutes([MainRoutes, AuthenticationRoutes]);
}
