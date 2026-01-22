import {useState} from "react" ;
import { useNavigate } from "react-router-dom";
function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "" ,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }
    // if (res.ok) {
    //   alert("Signup successful");
    //   setPage("login");
    // } else {
    //   alert(data.message);
    // }
    const handleSubmit = async (e) => {
        e.preventDefault();
     const response = await fetch("http://localhost:5000/signup", {
        method: 'POST',
        headers: {   
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
    });
    const data = await response.json();
   alert(data.message);

   if(response.ok){
    navigate("/login");
   }
    };
    return (
        <div className="bound">
          
            <form onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <input type="text" name="name" placeholder="name" onChange={handleChange} />
                <input type="email" name="email" placeholder="email" onChange={handleChange} />
                <input type="password" name="password" placeholder="password" onChange={handleChange} />
                <input type="password" name="confirmPassword" placeholder="confirmPassword" onChange={handleChange} />
                <button type="submit">Signup</button>
            </form>
             <p
        className="auth-link"
        onClick={() => navigate("/login")}
      >
        Already have an account? Login
      </p>
        </div>
    );
}


export default Signup;