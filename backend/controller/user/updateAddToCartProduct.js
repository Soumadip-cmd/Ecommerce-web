// const addToCartModel = require("../../models/cartProduct")

// const updateAddToCartProduct = async(req,res)=>{
//     try{
//         const currentUserId = req.userId 
//         const addToCartProductId = req?.body?._id

//         const qty = req.body.quantity

//         const updateProduct = await addToCartModel.updateOne({_id : addToCartProductId},{
//             ...(qty && {quantity : qty})
//         })

//         res.json({
//             message : "Product Updated",
//             data : updateProduct,
//             error : false,
//             success : true
//         })

//     }catch(err){
//         res.json({
//             message : err?.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = updateAddToCartProduct




const addToCartModel = require("../../models/cartProduct")

const updateAddToCartProduct = async(req,res)=>{
    try{
        const currentUserId = req.userId 
        const addToCartProductId = req?.body?._id
        const qty = req.body.quantity

        // Add userId check for security
        const updateProduct = await addToCartModel.findOneAndUpdate(
            {
                _id: addToCartProductId,
                userId: currentUserId  // Ensure user can only update their own cart items
            },
            {
                ...(qty && {quantity: qty})
            },
            { new: true }  // Return updated document
        ).populate('productId')

        if (!updateProduct) {
            return res.json({
                message: "Product not found or unauthorized",
                error: true,
                success: false
            })
        }

        res.json({
            message: "Product Updated",
            data: updateProduct,
            error: false,
            success: true
        })

    }catch(err){
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = updateAddToCartProduct