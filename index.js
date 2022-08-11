const express = require("express");
const app = express();

require("dotenv").config();
const port = process.env.PORT


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// const userRoutes = require("./routes/userRoutes");
// const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/order");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./db/connection")

// app.use("/user",userRoutes);
// app.use("/product",productRoutes);
app.use("/order",orderRoutes);


app.get("/",(req,res)=>{
    res.send("Hello There!")
})


app.listen(port, ()=>{
    console.log("Server Running!")
})