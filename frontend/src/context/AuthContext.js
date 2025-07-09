import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: false,
    loading: true,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                loading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                loading: false,
            };
        case 'TOKEN_REFRESHED':
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Set up axios interceptors
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (state.accessToken) {
                    config.headers.Authorization = `Bearer ${state.accessToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const response = await axios.post('/api/auth/refresh', {
                            refreshToken: state.refreshToken,
                        });

                        const { accessToken, refreshToken } = response.data.data;

                        dispatch({
                            type: 'TOKEN_REFRESHED',
                            payload: { accessToken, refreshToken },
                        });

                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        dispatch({ type: 'LOGOUT' });
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        toast.error('Session expired. Please login again.');
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [state.accessToken, state.refreshToken]);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            if (state.accessToken) {
                try {
                    const response = await axios.get('/api/auth/me');
                    dispatch({
                        type: 'SET_USER',
                        payload: response.data.data.user,
                    });
                } catch (error) {
                    dispatch({ type: 'LOGOUT' });
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuth();
    }, []);

    // Save tokens to localStorage when they change
    useEffect(() => {
        if (state.accessToken) {
            localStorage.setItem('accessToken', state.accessToken);
        }
        if (state.refreshToken) {
            localStorage.setItem('refreshToken', state.refreshToken);
        }
    }, [state.accessToken, state.refreshToken]);

    const login = async (email, password) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await axios.post('/api/auth/login', {
                email,
                password,
            });

            const { user, accessToken, refreshToken } = response.data.data;

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, accessToken, refreshToken },
            });

            toast.success('Login successful!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            dispatch({ type: 'SET_LOADING', payload: false });
            return { success: false, message };
        }
    };

    const register = async (username, email, password) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await axios.post('/api/auth/register', {
                username,
                email,
                password,
            });

            const { user, accessToken, refreshToken } = response.data.data;

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, accessToken, refreshToken },
            });

            toast.success('Registration successful!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            dispatch({ type: 'SET_LOADING', payload: false });
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch({ type: 'LOGOUT' });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            toast.success('Logged out successfully');
        }
    };

    const value = {
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 