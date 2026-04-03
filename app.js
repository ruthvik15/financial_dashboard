require("dotenv").config();
const { client: redisClient } = require("./utils/redisClient");
const { globalLimiter } = require("./middleware/rateLimiter");
const commonRouter = require("./routes/common")
const adminRouter = require("./routes/admin");
const dashboardRouter = require("./routes/dashboard");
const analystRouter = require("./routes/analyst");
const express = require("express");
const cookieParser = require("cookie-parser");
const { swaggerUi, swaggerDocs } = require("./utils/swagger");

const app = express();


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));    
app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", commonRouter);   
app.use("/dashboard", dashboardRouter); 
app.use("/admin", adminRouter);      
app.use("/analyst", analystRouter);

redisClient.on("error", () => {}); 

const PORT = process.env.PORT || 3000;

// if the file is run directly, it will start the server
// else it will be imported as a module
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

module.exports = app;