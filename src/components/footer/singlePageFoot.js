const SinglePageFoot = () => {

    return (
        <>
           
            <div className="container-fluid mt-4 mb-4" style={{ 'backgroundColor': "#f6f6f6" }}>  {/* start Fluid container */}
                <div className="row">
                <div className="col-12">
                        <div className="container mt-1">{ /* start container */}
                    <div className="row">
                                <div className="col-lg-4 col-md-6 col-12 pt-4">
                                    <div className="div-icon">
                                            <i className="bi bi-truck"></i>
                                    </div>
                                    <div className="div-text">
                                        <h6>Free Shipping</h6>
                                    <p>5km Range in Raiwind, <br />on All orders above Rs.1000.</p>
                                    </div>

                        </div>
                                <div className="col-lg-4 col-md-6 col-12 pt-4">
                                    <div className="div-icon">
                                        <i className="bi bi-arrow-repeat"></i>
                                    </div>
                                    <div className="div-text">
                                        <h6>7 Days Return</h6>
                                        <p>You have 7days to return</p>
                                    </div>

                        </div>
                                <div className="col-lg-4 col-md-6 col-12 pt-4">
                                    <div className="div-icon">
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    <div className="div-text">
                                        <h6> Safe Shopping</h6>
                                        <p>Payment 100% secure</p>
                                    </div>

                           
                           
                        </div>
                            
                    </div>
                        </div>{/* End container */}
                    </div>
                </div>
            </div> {/* end Fluid container */}
        </>
    );
}
export default SinglePageFoot;