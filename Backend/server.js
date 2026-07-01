require("dotenv").config()




// const {resume,selfDescription,jobDescription} = require("./src/services/temp")
// const generateInterviewReport = require("./src/services/ai.service")


const app = require("./src/app")
const connectToDB = require("./src/config/database")



connectToDB();


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

// generateInterviewReport({resume,selfDescription,jobDescription});