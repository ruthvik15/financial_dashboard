require("dotenv").config();
const express    = require("express");
const cookieParser = require("cookie-parser");

const { client: redisClient } = require("./utils/redisClient");
redisClient.on("error", () => {}); 

const commonRouter    = require("./routes/common")
const adminRouter     = require("./routes/admin");
const dashboardRouter = require("./routes/dashboard");
const analystRouter   = require("./routes/analyst");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", commonRouter);   
app.use("/dashboard", dashboardRouter); 
app.use("/admin", adminRouter);      
app.use("/analyst", analystRouter);   

app.use((err, req, res, next) => {
    console.error("[Unhandled]", err.message);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});