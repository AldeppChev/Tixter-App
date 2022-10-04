import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const AuthGuard = Loadable(lazy(() => import('guard/AuthGuard')));
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// Profile page routing
const EditProfilePage = Loadable(lazy(() => import('views/edit')));
const UserProfilePage = Loadable(lazy(() => import('views/profile')));
const TopicPage = Loadable(lazy(() => import('views/topics')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-typography',
                    element: <UtilsTypography />
                },
                {
                    path: 'util-color',
                    element: <UtilsColor />
                },
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'profile',
            children: [
                {
                    element: <UserProfilePage />,
                    index: true
                },
                {
                    element: <UserProfilePage />,
                    path: ':username'
                }
            ]
        },
        {
            path: 'edit',
            element: <EditProfilePage />
        },
        {
            path: 'topics',
            children: [
                {
                    element: <TopicPage />,
                    index: true
                },
                {
                    element: <TopicPage />,
                    path: ':topic'
                }
            ]
        }
    ]
};

export default MainRoutes;
