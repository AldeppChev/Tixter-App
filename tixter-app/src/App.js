/*
 * Copyright (c) 2022 Eliott Guillaumin
 * All rights reserved.
 */
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import parseApi from './api/parseApi';
import { useState } from 'react';
import AuthContext from './context/AuthContext';
import { useEffect } from 'react';
parseApi.initParse();
// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!user && parseApi.currentUser()) setUser(parseApi.currentUser());
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <AuthContext.Provider value={{ user, setUser }}>
                        <Routes />
                    </AuthContext.Provider>
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
