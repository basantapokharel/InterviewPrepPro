import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import {login,register,logout,getMe} from "../services/auth.api"



export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context


    const handleLogin = async({email,password}) =>{
        setLoading(true)
        try{
            const data = await login({email,password})
            setUser(data.user)
        }catch(err)
        {
            console.log(err)
        }finally{
            setLoading(false)
        }

        
    }

    const handleRegister = async({username,email,password}) =>{
        console.log("Inside handleRegister");
        setLoading(true)
        console.log("loading is true")
        try{
            const data = await register({username,email,password})
            setUser(data.user)
        }catch(err)
        {
            console.log(err)
        }finally{
            setLoading(false)
        }
        
        
    }

    const handleLogout = async () =>{
        setLoading(true)

        try{
            const data = await logout()
            setUser(null)
        }catch(err)
        {
            console.log(err)
        }finally{
            setLoading(false)
        }

        
    }

        useEffect(()=>{
        const getAndSetUser = async()=>{
            console.log("getAndSetUser is now called");

            try{
            const data = await getMe();
            console.log(data);
            setUser(data.user);
            }catch(err){ }finally{
                setLoading(false);            }
        }
            
        getAndSetUser();
    },[])

    return {user,loading,handleRegister,handleLogin,handleLogout}

}