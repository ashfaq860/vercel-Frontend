import { useState, useRef } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import { useSelector } from 'react-redux';
import { submitPageChanges,getPageBySlug } from "../../api/internal";
import { useNavigate,useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

import { useEffect } from "react";
import JoditEditor from 'jodit-react';
import LoadingButton from "../loader/loadingButton";
import GoBack from "../loader/goBack";

const EditPage = () => {
    <Helmet><title>Edit Page</title></Helmet>
    const editor = useRef(null);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const author = useSelector(state => state.user._id);
    const { pSlug } = useParams();
    const [loading, setLoading] = useState(false);
    //setSlug(useParams().slug);
    const getPageBySlugData = async () => {
        const res = await getPageBySlug(pSlug);
        if (res.status == 200) {
            setSlug(res.data.page.slug);
            setContent(res.data.page.content);
            setTitle(res.data.page.title);
        }
            }
    useEffect(() => {
        getPageBySlugData();
    },[pSlug]);

    const handleSubmit = async () => {
        setLoading(true);
        const data = {
            title,
            slug,
            author,
            content
        };
        try {
            const response = await submitPageChanges(data);
            setLoading(false);
            if (response.status == 201) {
                navigate("/admin/all-pages");
            } else {
                alert(response.message);
            }
        } catch (error) {
            setLoading(false);
            alert(error.message);
            console.log(error);
        }
    }
    const pageTitle = (value) => {
        setTitle(value);

       // setSlug(title.replace(' ', '-').toLowerCase());
    }
    return (<>
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">

                <h1 className="text-center p-3"> <GoBack link="/admin/all-pages" title="Go Back" /><b>Update Page</b></h1>
                <div style={{ "width": "110vh", "margin": "auto" }}>
                    <div className="form-floating mb-3" >
                        <input type="text" class="form-control" id="title" onChange={(e) => pageTitle(e.target.value)} value={title} placeholder="Page Title" />
                        <label for="floatingInput">Page Title</label>
                    </div>
                    <div className="form-floating">

                        <input type="text" class="form-control" id="catName" onChange={(e) => setSlug(e.target.value)} value={slug} placeholder="Category Name" />
                        <label for="floatingInput">Page Slug</label>
                    </div>
                    <div className="form-floating mt-3">
                        {
                          /*
                          <textarea onChange={(e) => setContent(e.target.value)} placeholder="write page Content here..." style={{ 'width': '100%' }} value={content}>
                          </textarea>
                          */
                        }
                           <JoditEditor
                                ref={editor}
                                value={content}
                              
                               
                                 // preferred to use only this option to update the content for performance reasons
                                onChange={newContent => setContent(newContent)}
                            />   
                     </div>
                
                    <div className="mt-3">
                        <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary" style={{ "width": "100%" }}><LoadingButton loading={loading} title="Update Page Changes" /> </button>
                    </div>
                </div>

            </div>

        </AdminLayout>
    </>)

}
export default EditPage;