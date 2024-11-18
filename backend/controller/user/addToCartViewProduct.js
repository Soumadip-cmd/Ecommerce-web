// const addToCartModel = require("../../models/cartProduct")

// const addToCartViewProduct = async(req,res)=>{
//     try{
//         const currentUser = req.userId

//         const allProduct = await addToCartModel.find({
//             userId : currentUser
//         }).populate("productId")

//         res.json({
//             data : allProduct,
//             success : true,
//             error : false
//         })

//     }catch(err){
//         res.json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports =  addToCartViewProduct




const addToCartModel = require("../../models/cartProduct")

// addToCartViewProduct.js
const addToCartViewProduct = async(req,res)=>{
    try{
        const currentUser = req.userId

        const allProduct = await addToCartModel.find({
            userId: currentUser
        }).populate({
            path: 'productId',
            select: 'productName brandName price sellingPrice productImage'  // Specify fields you want
        })

        res.json({
            data: allProduct,
            success: true,
            error: false
        })

    }catch(err){
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports =  addToCartViewProduct