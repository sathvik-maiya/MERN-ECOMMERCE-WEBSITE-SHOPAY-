const express=require("express");
const { getAllProducts, createproduct,updateproduct, deleteproduct, getproductdetails, createproductreview, getproductreviews, deletereview, getAdminProducts } = require("../controllers/productcontroller");

const { isauthenticateduser, authorizeroles } = require("../middleware/auth");
const router=express.Router();


router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(isauthenticateduser, authorizeroles("admin"), getAdminProducts);
router
  .route("/admin/product/new")
  .post(isauthenticateduser, authorizeroles("admin"), createproduct);
router
  .route("/admin/product/:id")
  .put(isauthenticateduser, authorizeroles("admin"), updateproduct)
  .delete(isauthenticateduser, authorizeroles("admin"), deleteproduct)
  
  router.route("/product/:id").get(getproductdetails);
    
  router.route("/review").put(isauthenticateduser,createproductreview);
  
  
router.route("/reviews").get(getproductreviews).delete(isauthenticateduser,deletereview);


module.exports=router;