import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Target, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "../app/auth/supabase-auth";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSignUp = searchParams.get("signup") === "true";
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nextPath = searchParams.get("next") || "/dashboard";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;
      if (isSignUp) {
        response = await signUp(email, password);
        console.log('Signup response:', response);
      } else {
        response = await signIn(email, password);
        console.log('Sign in response:', response);
      }

      if (response.error) {
        setError(response.error.message);
        setIsLoading(false);
      } else {
        // Force a small delay to ensure authentication state is updated
        setTimeout(() => {
          // Explicitly use dashboard path to ensure proper navigation
          const redirectPath = nextPath === '/' ? '/dashboard' : nextPath;
          console.log('Login successful, redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 500);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading && !error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/10 z-0 pointer-events-none" />
        <div className="flex flex-col items-center relative z-10">
          <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
          <p className="mt-4 text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/10 z-0 pointer-events-none" />
      
      <div className="w-full max-w-md p-6 bg-gray-800/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)] backdrop-blur-sm rounded-xl border border-gray-700 relative z-10">
        <div className="flex flex-col items-center justify-center mb-6">
          <Target className="h-8 w-8 text-purple-400 mb-2" />
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">Wellnash</h2>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 text-white">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-gray-400 text-center mb-6">
          {isSignUp 
            ? "Sign up to get personalized wellness plans" 
            : "Sign in to access your wellness dashboard"}
        </p>

        {error && (
          <div className="bg-red-900/30 text-red-400 p-3 rounded-md flex items-center mb-6 border border-red-800">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your.email@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              <>{isSignUp ? "Sign up" : "Sign in"}</>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold text-purple-400 hover:text-purple-300" 
                onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold text-purple-400 hover:text-purple-300" 
                onClick={() => navigate("/login?signup=true")}>
                Create an account
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};