import { useState, useRef } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import './addCat.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { submitPageContent } from "../../api/internal";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

import JoditEditor from 'jodit-react';

const CreatePage = () => {
    <Helmet><title>Create New Page</title></Helmet>
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const editor = useRef(null);


    const author = useSelector(state => state.user._id);
    const handleSubmit = async () => {
        if (title !== "" && slug !== "" && content !== "") {
            const data = {
                title,
                slug,
                author,
                content

            };
            try {
                const response = await submitPageContent(data);
                if (response.status == 201) {
                    navigate("/admin/all-pages");
                } else {
                    alert(response.message);
                }
            } catch (error) {
                alert(error.message);
                console.log(error);
            }
        } else {
            alert("Fields should not be empty!")
        }
    }
    const pageTitle = (value) => {
        setTitle(value);
       
        setSlug(title.replace(' ', '-').toLowerCase());
    }
    return (<>
        <AdminLayout>
            <div className="col-auto col-md-9 col-xl-10 px-sm-10">

                <h1 className="text-center p-3"><b>Create New Page</b></h1>
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
                        <textarea onChange={(e) => setContent(e.target.value)} placeholder="write page Content here..." style={{'width':'100%'} }>
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
                        <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary" style={{ "width": "100%" }}>Create Page</button>
                    </div>
                </div>

            </div>

        </AdminLayout>
    </>)

}
export default CreatePage;