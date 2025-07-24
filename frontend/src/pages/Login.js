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
            <form onSubmit={handleSubmit}>
                <h1>BiteBuddy</h1>

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