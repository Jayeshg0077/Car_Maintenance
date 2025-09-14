import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const navigate = useNavigate();
    const location = useLocation();

    // Check for session timeout
    useEffect(() => {
        const checkSession = () => {
            const now = Date.now();
            if (user && now - lastActivity > SESSION_TIMEOUT) {
                handleLogout();
            }
        };

        const interval = setInterval(checkSession, 1000); // Check every second

        // Update last activity on user interaction
        const updateActivity = () => {
            setLastActivity(Date.now());
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('click', updateActivity);
        window.addEventListener('scroll', updateActivity);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('click', updateActivity);
            window.removeEventListener('scroll', updateActivity);
        };
    }, [user, lastActivity]);

    // Initialize auth state from storage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const isAuth = localStorage.getItem('isAuthenticated');
                const userData = localStorage.getItem('user');
                const storedLastActivity = localStorage.getItem('lastActivity');

                if (isAuth && userData && storedLastActivity) {
                    const now = Date.now();
                    const lastActivityTime = parseInt(storedLastActivity);

                    if (now - lastActivityTime <= SESSION_TIMEOUT) {
                        setUser(JSON.parse(userData));
                        setLastActivity(lastActivityTime);
                    } else {
                        // Session expired
                        handleLogout();
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const handleLogin = async (credentials, remember = false) => {
        setLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In production, this should be replaced with actual API call
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
                const userData = {
                    name: 'Admin User',
                    role: 'Administrator',
                    email: 'admin@autocare.com'
                };

                setUser(userData);
                setLastActivity(Date.now());

                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('lastActivity', Date.now().toString());

                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Redirect to the originally requested URL or dashboard
                const from = location.state?.from || '/';
                navigate(from);

                return { success: true };
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('rememberMe');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login: handleLogin,
            logout: handleLogout,
            loading,
            isAuthenticated: !!user
        }}>
            {!loading ? children : null}
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

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            // Redirect to login page and save the attempted url
            navigate('/login', {
                state: { from: location.pathname },
                replace: true
            });
        }
    }, [user, loading, navigate, location]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return user ? children : null;
};