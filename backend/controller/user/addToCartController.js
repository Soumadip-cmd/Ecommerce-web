// const addToCartModel = require("../../models/cartProduct")

// const addToCartController = async(req,res)=>{
//     try{
//         const { productId } = req?.body
//         const currentUser = req.userId

//         const isProductAvailable = await addToCartModel.findOne({ productId })

//         console.log("isProductAvailabl   ",isProductAvailable)

//         if(isProductAvailable){
//             return res.json({
//                 message : "Already exits in Add to cart",
//                 success : false,
//                 error : true
//             })
//         }

//         const payload  = {
//             productId : productId,
//             quantity : 1,
//             userId : currentUser,
//         }

//         const newAddToCart = new addToCartModel(payload)
//         const saveProduct = await newAddToCart.save()


//         return res.json({
//             data : saveProduct,
//             message : "Product Added in Cart",
//             success : true,
//             error : false
//         })
        

//     }catch(err){
//         res.json({
//             message : err?.message || err,
//             error : true,
//             success : false
//         })
//     }
// }


// module.exports = addToCartController




const addToCartModel = require("../../models/cartProduct")

const addToCartController = async(req,res)=>{
    try{
        const { productId } = req?.body
        const currentUser = req.userId

        // Check if product already exists in user's cart
        const isProductAvailable = await addToCartModel.findOne({ 
            productId: productId,
            userId: currentUser  // Add userId check
        })

        if(isProductAvailable){
            return res.json({
                message : "Already exists in Add to cart",
                success : false,
                error : true
            })
        }

        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
        }

        const newAddToCart = new addToCartModel(payload)
        const saveProduct = await newAddToCart.save()

        // Populate product details in response
        const populatedProduct = await addToCartModel.findById(saveProduct._id)
            .populate('productId')

        return res.json({
            data: populatedProduct,
            message: "Product Added in Cart",
            success: true,
            error: false
        })

    }catch(err){
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}


module.exports = addToCartController