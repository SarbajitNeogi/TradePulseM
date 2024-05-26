import React, { useState } from 'react';
import './AuthForm.css';
import ErrorBox from '../Components/ErrorBox';
import { useNavigate } from 'react-router-dom';
import { ProfileInterface } from '../Constants/interfaces';

interface propsInterface {
    type: boolean,
    setIsSigned: Function
    setUser: Function
}

function AuthForm(props: propsInterface) {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(props.type);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const closeErrorBox = () => {
        setError(null);
      };
      const triggerError = (err:string) => {
        setError(err);
      };

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            };

            const response = await fetch(`http://127.0.0.1:5000/${isSignUp ? 'signup' : 'signin'}`, requestOptions);
            const data = await response.json();

            if (data.success) {
                const userdata:ProfileInterface = {
                    _id : data.user._id,
                    name : data.user.name,
                    email : data.user.email,
                    balance : data.user.balance,
                    balancesheet : data.user.balancesheet,
                    activities : data.user.activities
                }

                props.setUser(userdata)
                props.setIsSigned(true);
                navigate('/');
            } else {
                throw new Error(data.error);
            }

        } catch (err:{message:string}) {
            console.error('Authentication error:', err);
            triggerError(err.message);
        }
    };

    return (
        <div className="container">
            {error && <ErrorBox errorMessage={error} onClose={closeErrorBox} />}
            <div className="form-container">
                <div className="slide-container" style={{ transform: `translateX(${isSignUp ? '-100%' : '17%'})` }}>
                    <div className="sign-in-container">
                        <form onSubmit={handleSubmit}>
                            <h2>Sign In</h2>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit">Sign In</button>
                            <p>
                                Don't have an account?{' '}
                                <span onClick={() => setIsSignUp(true)} className="accent-text">
                                    Sign Up
                                </span>
                            </p>
                        </form>
                    </div>
                    <div className="sign-up-container">
                        <form onSubmit={handleSubmit}>
                            <h2>Sign Up</h2>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit">Sign Up</button>
                            <p>
                                Already have an account?{' '}
                                <span onClick={() => setIsSignUp(false)} className="accent-text">
                                    Sign In
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;