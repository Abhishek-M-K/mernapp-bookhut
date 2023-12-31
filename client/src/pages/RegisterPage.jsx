import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function RegisterPage(){
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    // const registerUser=(e)=>{
    //     e.preventDefault();
    //     axios.get('http://localhost:4000/test')
    // }

    //making it async await func

    async function registerUser(ev){
        ev.preventDefault();
        // axios.get('http://localhost:4000/test'); no need to hardcode the url , store it as baseUrl --->
        // axios.get('/test') testing purposes
        try{
            await axios.post('/register',{
                name,
                email,
                password
            });
            alert("Registration Successful ! Please Login ");
        } catch (e){
            alert("Registration Failed ! Please try again later")
        }
        
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-50">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="name" 
                            placeholder="your name" 
                            value={name} 
                            onChange={ev=>setName(ev.target.value)}/>
                    <input type="email" 
                            placeholder="your@email.com"
                            value={email} 
                            onChange={ev=>setEmail(ev.target.value)} />
                    <input type="password" 
                            placeholder="password" 
                            value={password} 
                            onChange={ev=>setPassword(ev.target.value)}/>
                    <button className="login">Register</button>
                    <div className="text-center py-2 text-gray-600">
                        Already a member ? <Link className=" text-black" to={'/login'}>Login !</Link></div>
                </form>
            </div>            
        </div>
    );
}