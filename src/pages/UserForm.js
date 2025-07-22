import React from "react"
export const UserForm = (onLogin) => {
    return (

        <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            />
            {isSignup && (
            <input
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={handleChange}
                required
            />
            )}
            <button type="submit">{isSignup ? "Create Account" : "Login"}</button>
            <p onClick={() => setIsSignup(!isSignup)} className="toggle-auth">
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </p>
        </form>
        </div>
    )

}