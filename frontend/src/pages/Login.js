import { useState } from 'react';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        // replace with real user authorization later, right now just checks that there is something entered
        if (username && password) {
            onLogin(); // triggers the setIsLoggedIn in App.js
        }
        else {
            alert('Please enter username and password.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>BiteBuddy</h1>
                <p> Welcome to BiteBuddy - your personal food companion! </p>
                <p> Discover recipes, customized meal plans, and find nutritional information. </p>
            </div>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">LOG IN</button>
            </form>
        </div>
    );
}