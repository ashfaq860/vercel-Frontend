import * as yup from "yup";
const generalSettingsSchema = yup.object().shape({
    facebookId: yup.string().required("Facebook Id is required"),
    twitterId: yup.string().required("Twitter Id is required"),
    whatsAppId: yup.string().required("Whats App Id is required"),
    tiktokId: yup.string().required("Tiktok Id is required"),
    phone: yup.string().required("Phone No is required"),
    email: yup.string().required("Email is required"),
    address: yup.string().required("Address is required"),
    timing: yup.string().required("Timing is required"),
    photo: yup.string().required("Photo is required"),



});
export default generalSettingsSchema;