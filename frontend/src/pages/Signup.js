import { useState } from "react";
import { addUserLogin, getUserData, addPassword } from '../database.js'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link } from 'react-router-dom';

export default function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      // await addUserLogin(username);
      // onLogin(); // triggers the setIsLoggedIn in App.js
      return alert("Please enter a username and password!");
  }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const user = await getUserData(username);
            if (user) {
                return alert("Username already exists. Please choose a different username or go to Login page!");

                    
                } 
            
      // You can replace this with your actual signup API
      // const res = await fetch("http://localhost:5000/auth/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ username, password }),
      // });

      // const data = await res.json();

     
      await addUserLogin(username);
      await addPassword(username, password);
      alert("Account created! Please log in.");
      onSignupSuccess(); // Redirect to login page
      
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 bg-background">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your username & password below to create your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Input
              type="text"
              placeholder="userexample1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            Create account
          </Button>
          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 underline hover:text-blue-700">
                Log in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
