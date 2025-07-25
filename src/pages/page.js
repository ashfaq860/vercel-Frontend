import { useState, useEffect } from "react";
import Layout from '../components/layout/layout';
import { useNavigate, useParams } from "react-router-dom";

import { getPageBySlug } from '../api/internal';
import parse from 'html-react-parser';
import { Helmet } from 'react-helmet-async';

const Page = () => {
    const { slug } = useParams();
    const [title, setTitle] = useState('');
    
    const [content, setContent] = useState('');
    //setSlug(useParams().slug);
    const getPageBySlugData = async () => {
     
        const res = await getPageBySlug(slug);
        if (res.status == 200) {
           
            setContent(res.data.page.content);
            setTitle(res.data.page.title);
        }
    }
    useEffect(() => {
        getPageBySlugData();
    }, [slug]);
    return (
        <>
            <Layout>
                <Helmet>
                    <title>{ title }Mian Motorcycle Parts Raiwind- All kind of motocycle parts shop</title>
                    <meta name="description" content="Mian Motocycle Parts, Honda 70 , CG125, China 70, Uniter 100, Ching CHi Rickshaw, Location Kasur Road Raiwind" />
                </Helmet>
               <div className="container pt-3">
                    <h1 className="text-center">{ title }</h1>
                    { parse(content)}
                </div>
            </Layout>

        </>
    );
}
export default Page;