import * as yup from "yup";
const productSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    urduName: yup.string().required("اردو میں نام لکھیں"),
   
    model: yup.string().required("Model is required"),
    manufacturer: yup.string().required("Manufacturer is required"),
    p_price: yup.string().required("Purchase Price is required"),
    s_price: yup.string().required("Sale Price is required"),
    quantity: yup.string().required("Quantity is required"),
    quality: yup.string().required("Quality is required"),
    shippingCost: yup.string().required("Shipping Cost is required"),

    desc: yup.string().required("Description is required"),
   
    
    
});
export default productSchema;