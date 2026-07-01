import { useAuth} from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({children}) => {
    const {loading,user} = useAuth();

    if (loading){
        console.log("Inside Protected -> if loading case is run ")
        return (
            <main><h1>Loading.....</h1></main>
        )
    }
    if (!user){
        console.log("Inside Protected -> if !user case is run ")
        return <Navigate to="/login" />;
    }
    return children;
}


export default Protected;