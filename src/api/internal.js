import axios from 'axios';
import NProgress from 'nprogress';
const api = axios.create({
    baseURL: process.env.REACT_APP_INTERNAL_API_PATH,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});
// Request interceptor: start progress bar
api.interceptors.request.use(
    (config) => {
        NProgress.start();
        return config;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);

// Response interceptor: stop progress bar
api.interceptors.response.use(
    (response) => {
        NProgress.done();
        return response;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);

// general setting function 
export const createGeneralSetting =async(data) => {
    let response;
    try {
        response    =   await api.post("/generalSetting",data)
    } catch (error) {
        return error;
    }
    return response;
}
// get general setting function
export const getGeneralSetting = async () => {
    let response;
    try {
        response = await api.get("/getGeneralSetting");
    } catch (error) {
        return error;
    }
    return response;
}
// user functions
export const loginUser = async (data) => {
    let response;
    try {
        response = await api.post('/login', data);
    } catch (error) {
        return error;
    }
    return response;
}
export const findUser = async (data) => {
    let response;
    try {
        response = await api.get(`getuserByEmail/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}
export const register = async (data) => {
    let response;
    try {
        response = await api.post('/register', data);
    } catch (error) {
        return error;
    }
    return response;

}
export const updateUser = async (data) => {
    let response;
    try {
        response = await api.put('/updateUser', data);
    } catch (error) {
        return error;
    }
        return response;
}
//######### Start Password Match function ###############
export const checkIfPasswordMatch = async (data) => {
    let response;
    try {
        response = await api.put('/matchPassword', data);
    } catch (error) {
        return error;
    }
    return response;
}

// ################ Password Change functions

export const changePassword = async (data) => {
    let response;
    try {
        response = await api.put('/changePassword', data);
    } catch (error) {
        return error;
    }
    return response;
}

// ################ Chek if  Password functions

export const checkPassword = async (data) => {
    let response;
    try {
        response = await api.get(`/checkPassword/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}

// ################ set Password functions

export const setPassword = async (data) => {
    let response;
    try {
        response = await api.put('/setPassword', data);
    } catch (error) {
        return error;
    }
    return response;
}


// ################ forgotPassword functions

export const forgotPassword = async (data) => {
    let response;
    try {
        response = await api.post('/forgot-password', data);
    } catch (error) {
        return error;
    }
    return response;
}

// getAll Users
export const getAllUsers = async () => {
    let response;
    try {
        response = await api.get('/getAllUsers');
    } catch (error) {
        return error;
    }
    return response;
}

// Change user role function
export const updateUserRole = async (data) => {
    let response;
    try {
        response = await api.put('/changeUserRole',data);
    } catch (error) {
        return error;
    }
    return response;
}

// deleteUser Users
export const deleteUser = async (data) => {
    let response;
    try {
        response = await api.delete(`/deleteUser/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}


// ################ forgotPassword functions

export const verifyOTP = async (data) => {
    let response;
    try {
        response = await api.put('/verifyOTP', data);
    } catch (error) {
        return error;
    }
    return response;
}

// ################ getOTP time via token functions

export const getOTPTime = async (data) => {
    let response;
    try {
        response = await api.get(`/otpTime/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}

// ################ Reset Password Token functions

export const resetPassword = async (data) => {
    let response;
    try {
        response = await api.post(`/reset-password`,data);
    } catch (error) {
        return error;
    }
    return response;
}
/* resend OTP function starts
export const OTPResend = async (data) => {
    let response;
    try {
        response = await apit.post('/resendOTP', data);
    } catch (error) {
        return error;
    }
    return response;
}
*/
//#### end user functions

export const submitCategory = async (data) => {
    let response;
    try {
        response = await api.post('/createCategory', data);
    } catch (error) {
        return error;
    }
    return response;

}
export const getAllCat = async () => {
    let response;
    try {
        response = await api.get('/category/all');
    } catch (error) {
        return error;
    }
    return response;

}

export const deleteCategory= async (data) => {
    let response;
    try {
        response = await api.delete(`/category/delete/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}
export const getCatById = async (data) => {
    let response;
    try {
        response = await api.get(`/category/single/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}

export const updateCategory = async (data) => {
    let response;
    try {
        response = await api.put('/category/update',data);
    } catch (error) {
        return error;
    }
    return response;
}

    /// product functions list
export const createProduct = async (data) => {
    let response;
    try {
        response = await api.post('/createProduct/', data);
    } catch (error) {
        return error;
    }
    return response;
}

/// getAll products function
export const getAllProducts = async () => {
    let response;
    try {
        response = await api.get('/product/all');
    } catch (error) {
        return error;
    }
    return response;
}
//###### get Latest Products ###############
export const getLatestProducts = async (data) => {
    let response;
    try {
        response = await api.get(`/product/latest/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}

//###### get Popular Products ###############
export const getPopularProducts = async (data) => {
    let response;
    try {
        response = await api.get(`/product/popular/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}



//###### get Featured Products ###############
export const getFeaturedProducts = async() => {
    let response;
    try {
       response = await api.get(`/product/featured/4`);
    } catch (error) {
        return error;
    }
    return response;
}

// Delete Product function
export const deleteProduct = async (data) => {
    let response;
    try {
        response = await api.delete(`/product/delete/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}
// getProductBy Id

export const getProductById = async (data) => {
    let response;
    try {
        response = await api.get(`/product/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}

    //update product
export const updateProduct = async (data) => {
    let response;
    try {
        response = await api.put('/product/update', data);
    } catch (error) {
        return error;
    }
    return response;
}

//###### Mark Product as Featured Produc #############////////
export const markFeatured = async(data)=>{
    
    let response;
    try{
        response    =   await api.put('/product/markFeatured',data);
    }catch(error){
       return error;
    }
    return response;
}
//###### Category wise PRoducts###########
export const CategoryRelatedProduct = async (data) => {
    let response;
    try {
        response = await api.get(`/category/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}

//###### Related PRoducts###########
export const relatedProducts = async (data) => {
    let response;
    try {
        response = await api.get(`/related/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}


//######Searched Category wise PRoducts###########
export const SearchRelatedProduct = async (term,cId) => {
    let response;
    try {
        response = await api.get(`/search/${term}/${cId}`);
    } catch (error) {
        return error;
    }
    return response;
}


    /*#Produt photoes funtions */

// upload product Photoes
export const uploadProductPhotoes = async (data) => {
    let response;
    try {
        response = await api.post('/uploadPhotos/', data);
    } catch (error) {
        return error;
    }
    return response;
}

// get photoes list by product Id
export const getPhotosByProductId = async (data) => {
    let response;
    try {
        response = await api.get(`/photosByProductId/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}

// update product Photoes if photoes already created
export const updateProductPhotoes = async (data) => {
    let response;
    try {
        response = await api.put('/updatePhotoes/', data);
    } catch (error) {
        return error;
    }
    return response;
}

/** ############# Product Review FUnctions #########*/

/// product functions list
export const submitReview = async (data) => {
    let response;
    try {
        response = await api.post('/addReview/', data);
    } catch (error) {
        return error;
    }
    return response;
}
// get review by product Id
export const getReviewByProductId = async (data) => {
    let response;
    try {
        response = await api.get(`/getReviewsByProductId/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}
// get reviews function 
export const getAllReviews = async () => {
    let response;
    try {
        response = await api.get(`/getAllReviews`);
    } catch (error) {
        return error;
    }
    return response;
}

// get reviews function 
export const updateReview = async (data) => {
    let response;
    try {
        response = await api.put(`/updateReview`,data);
    } catch (error) {
        return error;
    }
    return response;
}

// Delete reviews function 
export const deleteReview = async (data) => {
    let response;
    try {
        response = await api.delete(`/deleteReview/${data}`);
    } catch (error) {
        return error;
    }
    return response;
}
// reply to the comment
export const reviewReply = async (data) => {
    let response;
    try {
        response = await api.put(`/reviewReply`, data);
    } catch (error) {
        return error;
    }
    return response;
}

    //########## Page functions
export const submitPageContent = async (data) => {
    let response;
    try {
        response = await api.post('/create-page', data);
    } catch (error) {
        return error;
    }
    return response;
} // End submitpage funtion

/* start get All pages function */
export const getAllPages = async () => {
    let response;
    try {
        response = await api.get('/get-all-pages');
    } catch (error) {
        return error;
    }
    return response;
} // end get All Pages function



/* start  delete page function */
export const deletePage = async (slug) => {
    let response;
    try {
        response = await api.get(`/delete-page/${slug}`);
    } catch (error) {
        return error;
    }
    return response;
} // end delete page Page function

 /*start Page  By slug function */
export const getPageBySlug = async(slug)=> {
    let response;
    try {
        response = await api.get(`/get-page-by-Slug/${slug}`);
    } catch (error) {
        return error;
    }
    return response;

} // end getpage by slug func
/* start submit change page */
export const submitPageChanges = async (data) => {
    let response;
    try {
        response = await api.put('/update-changes', data);        
    } catch (error) {
        return error;
    }
    return response;
}

/* Order Functions starts here */
export const placeOrder = async (data) => {
    let response;
    try {
        response = await api.post("/placeORder", data);
    } catch (error) {
        return error
    }

    return response;
}

/** ORder Receieved functions*/
export const orderById = async (data) => {
    let response;
    try {
        response = await api.get(`/orderById/${data}`, data);

    } catch (error) {
        return error;
    }
    return response;
} 


/** ORder Receieved functions*/
export const orderByCustomer = async (data) => {
    let response;
    try {
        response = await api.get(`/orderByCustomer/${data}`);

    } catch (error) {
        return error;
    }
    return response;
}

/* start function to cancel an order */
export const getAllOrders = async () => {
    let response;
    try {
        response = await api.get('/allOrders');

    } catch (error) {
        return error;
    }
    return response;
}

/** start to get all orders functions*/
export const changeStatus = async (data) => {
    let response;
    try {
        response = await api.put('/changeStatus',data);

    } catch (error) {
        return error;
    }
    return response;
}
/** start to get all orders functions*/
export const orderByUserId = async (data) => {
    let response;
    try {
        response = await api.get(`/orderByUserId/${data}`);

    } catch (error) {
        return error;
    }
    return response;
}
export const sendOrderMailToClient = async (data) => {
    let response;
    try {
        response = await api.post('/sendEmailToClient',data);

    } catch (error) {
        return error;
    }
    return response;
}
/** functions to getting Charts Data */
export const getGrowthChartData = async (type, year, month=null) => {
    let response;
    try {
        response = await api.get(`/growthChartData/${type}/${year}/${month}`);

    } catch (error) {
        return error;
    }
    return response;
}
export const getLineChartData = async (data) => {
    let response;
    try {
        response = await api.get(`/lineChartData`);

    } catch (error) {
        return error;
    }
    return response;
}

export const OrderStatusPiChart = async () => {
    let response;
    try {
        response = await api.get(`/piChartData`);

    } catch (error) {
        return error;
    }
    return response;
}
export const popularStock = async () => {
    let response;
    try {
        response = await api.get(`/popularStock`);

    } catch (error) {
        return error;
    }
    return response;
}


// 📤 Create or Update Slider Images
export const uploadSliderImages = async (data) => {
    try {
        const response = await api.post(`/slider-images`, data);
        return response.data;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

// 📦 Get All Slider Images
export const getSliderImages = async () => {
    try {
        const response = await api.get('/get-slider-images');
        return response.data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

// 🗑️ Delete a Specific Slide by ID
export const deleteSlide = async (id) => {
    try {
        const response = await api.delete(`/slider-images/${id}`);
        return response.data;
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
};

// 🔀 Save Reordered Slide IDs
export const reorderSlides = async (orderedIds) => {
    try {
        const response = await api.put(`/slider-images-reorder`, orderedIds );
        return response.data;
    } catch (error) {
        console.error('Reorder error:', error);
        throw error;
    }
};

