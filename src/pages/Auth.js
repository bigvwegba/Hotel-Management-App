import {useState} from 'react';
const Auth = ({onLogin}) => {
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({name: "", password:"", confirm:""});




    const handleChange = (e) => {
        const {name, value}= e.target;
        setForm({...form, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup && form.password !== form.confirm){
            alert("Password do not match");
            return;
        }
        localStorage.setItem('user', JSON.stringify(form));
        onLogin(form);
    }
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
export default Auth;