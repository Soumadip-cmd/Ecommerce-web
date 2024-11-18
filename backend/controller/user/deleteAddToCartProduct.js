// const addToCartModel = require("../../models/cartProduct")

// const deleteAddToCartProduct = async(req,res)=>{
//     try{
//         const currentUserId = req.userId 
//         const addToCartProductId = req.body._id

//         const deleteProduct = await addToCartModel.deleteOne({ _id : addToCartProductId})

//         res.json({
//             message : "Product Deleted From Cart",
//             error : false,
//             success : true,
//             data : deleteProduct
//         })

//     }catch(err){
//         res.json({
//             message : err?.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = deleteAddToCartProduct



const addToCartModel = require("../../models/cartProduct")

// deleteAddToCartProduct.js
const deleteAddToCartProduct = async(req,res)=>{
    try{
        const currentUserId = req.userId 
        const addToCartProductId = req.body._id

        // Add userId check for security
        const deleteProduct = await addToCartModel.deleteOne({ 
            _id: addToCartProductId,
            userId: currentUserId  // Ensure user can only delete their own cart items
        })

        if (deleteProduct.deletedCount === 0) {
            return res.json({
                message: "Product not found or unauthorized",
                error: true,
                success: false
            })
        }

        res.json({
            message: "Product Deleted From Cart",
            error: false,
            success: true,
            data: deleteProduct
        })

    }catch(err){
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = deleteAddToCartProduct