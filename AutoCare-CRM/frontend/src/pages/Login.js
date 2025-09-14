import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading: authLoading, isAuthenticated } = useAuth();

    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from || '/';
            navigate(from);
        }
    }, [isAuthenticated, navigate, location]);

    // Load remembered credentials
    useEffect(() => {
        const remembered = localStorage.getItem('rememberMe');
        if (remembered) {
            const savedUsername = localStorage.getItem('rememberedUsername');
            if (savedUsername) {
                setCredentials(prev => ({ ...prev, username: savedUsername }));
                setRememberMe(true);
            }
        }
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!credentials.username.trim()) {
            errors.username = 'Username is required';
        }
        if (!credentials.password) {
            errors.password = 'Password is required';
        } else if (credentials.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        // Real-time validation
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError('');

        try {
            // Remember username if checkbox is checked
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', credentials.username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            const result = await login(credentials, rememberMe);
            if (!result.success) {
                throw new Error(result.error || 'Invalid credentials');
            }
        } catch (err) {
            setError(err.message);
            // Shake animation for error
            const form = document.querySelector('form');
            form.classList.add('animate-shake');
            setTimeout(() => form.classList.remove('animate-shake'), 500);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img
                            src={process.env.PUBLIC_URL + '/logo.png'}
                            alt="AutoCare CRM"
                            className="h-20 w-20 object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Please sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className={`space-y-6 ${error ? 'animate-shake' : ''}`}>
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                className={`appearance-none relative block w-full px-3 py-3 pl-10 
                  border ${validationErrors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
                  placeholder-gray-500 text-gray-900 dark:text-white rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  bg-white dark:bg-gray-700`}
                                placeholder="Username"
                            />
                        </div>
                        {validationErrors.username && (
                            <p className="mt-1 text-sm text-red-500">{validationErrors.username}</p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className={`appearance-none relative block w-full px-3 py-3 pl-10 
                  border ${validationErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
                  placeholder-gray-500 text-gray-900 dark:text-white rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  bg-white dark:bg-gray-700`}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                )}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <FaSpinner className="animate-spin h-5 w-5" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Demo credentials:
                        <br />
                        Username: admin
                        <br />
                        Password: admin123
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img
                            src={process.env.PUBLIC_URL + '/logo.png'}
                            alt="AutoCare CRM"
                            className="h-20 w-20 object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Please sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                                placeholder="Username"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin h-5 w-5" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                </form>

                <div className="mt-6">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Demo credentials:
                        <br />
                        Username: admin
                        <br />
                        Password: admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;