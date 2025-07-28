import { useState } from 'react';
import { addUserLogin, getUserData, addPassword } from '../database.js'
import { Link } from 'react-router-dom';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        // replace with real user authorization later, right now just checks that there is something entered
        if (!username || !password) {
            // await addUserLogin(username);
            // onLogin(); // triggers the setIsLoggedIn in App.js
            return alert("Please enter a username and password!");
        }
        try {
            const user = await getUserData(username);
            if (user) {
                if (user.password === password) {

                    onLogin(username); // triggers the setIsLoggedIn in App.js
                } else {
                    alert('Incorrect password. Please try again.');
                }
            }
            else {
                await addUserLogin(username);
                await addPassword(username, password);
                onLogin();
                 // just for debugging, but we need to put this in the sign up page!
                // alert("User does not exit. Please sign up first!");
            }
        }
        catch (err){
            console.error("Error logging in:", err);
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
                <p className="text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 underline hover:text-blue-700">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}