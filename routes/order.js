const Order = require("../models/order");
const express = require("express");
const { emit } = require("../models/order");
const router = express.Router();

const deliveryStatus = ["placed", "packed","dispatched","delivered"];

router.get("/",(req,res)=>{
    Order.find((error,orders)=>{
        if(error){
            res.status(500).json({
                message : "Internal server error"
            })
        }
        else {
            res.status(200).json({
                orders
            })
        }
    })
})

router.post("/add",async(req,res)=>{
    const {quantity, address,payment} = req.body;
    const date = new Date();
    const newOrder = new Order({
        quantity,
        address,
        date : date.toDateString().substring(4),
        payment,
        status : "placed"
    });
    await newOrder.save((error,data)=>{
        if(error){
            res.status(500).json({
                message : "Order save error"
            })
        }
        else {
            console.log(data)
            res.status(200).json({
                message : "Order successfull",
                order : data
            })
        }
    })
})

router.put("/update/:id",(req,res)=>{
    const orderId = req.params.id;
    const body = req.body;
    Order.findByIdAndUpdate(orderId,body,async (error,orderData)=>{
        if(error) {
            res.status(500).json({
                message : "Internal Server Error"
            })
        }
        else if(orderData==null){
            res.status(400).json({
                message : "Order Not Found"
            })
        }
        else {
            const updatedOrder = await Order.findById(orderId);
            res.status(200).json({
                order : updatedOrder
            })
        }
    });
})


router.put("/updateStatus/:id",(req,res)=>{
    const orderId = req.params.id;
    const {status} = req.body;
    if(deliveryStatus.indexOf(status)==-1){
        res.status(400).json({
            message : "Invalid status value"
        })
    }
    else {
        Order.findByIdAndUpdate(orderId,{status},async (error,orderData)=>{
            if(error) {
                res.status(500).json({
                    message : "Internal Server Error"
                })
            }
            else if(orderData==null){
                res.status(400).json({
                    message : "Order Not Found"
                })
            }
            else {
                const updatedOrder = await Order.findById(orderId);
                res.status(200).json({
                    order : updatedOrder
                })
            }
        });
    }
})

router.delete("/delete/:id",(req,res)=>{
    const orderId = req.params.id;
    Order.findByIdAndDelete(orderId,(error,status)=>{
        if(error){
            res.status(500).json({
                message : "Internal server error"
            })
        }
        else {
            console.log(status);
            res.status(200).json({
                message : "Order deleted successfully"
            })
        }
    })
})


router.get("/checkCapacity/:date",(req,res)=>{
    const {date} = req.params;
    const reqDate = new Date(new Number(date));
    console.log(reqDate.toDateString().substring(4));
    
    Order.aggregate([{
        $group : {
            _id: '$date',
            total : {
                $sum : "$quantity"
            }
        },
        
        
    }],(error,data)=>{
        if(error){
            res.status(500).json({
                message : "Internal Server Error"
            });
        }
        else {
            data = data.filter((value)=>{
                if(value._id===reqDate) return 1;
                return -1;
            })
            res.status(200).json({
                capacityLeft : 4000-data[0].total
            });
        }
    })

    // (error,data)=>{
    //     if(error){
    //         res.status(500).json({
    //             message : "Internal Server Error"
    //         });
    //     }
    //     else {
    //         res.status(200).json({
    //             data : data
    //         });
    //     }
    // }
    // const data = date_quantity.find();
    // console.log(data)
    
})


module.exports = router;