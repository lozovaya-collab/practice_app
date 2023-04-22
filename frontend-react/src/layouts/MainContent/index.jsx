import React, { useEffect } from 'react';
import {
    BrowserRouter as
        Router,
        Routes,
        Route,
        useNavigate
} from 'react-router-dom';

import { apiService } from '../../shared/api/swagger/swagger.js';

import { HomePage } from '../../pages/HomePage';
import { AuthPage } from '../../pages/AuthPage';

const MainContent = () => {
    const navigate = useNavigate();

    const getAuth = async () => {
        try {
            await apiService.me.Me().then(res => {
                localStorage.setItem('user', JSON.stringify(res.data))
            })
        } catch (err) {
            if(err.response.status === 401) navigate('/auth')
        }
    }

    useEffect(() => {
        getAuth();
    }, [])
    return (
        <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
        </Routes> 
        
    )
}

export { MainContent }