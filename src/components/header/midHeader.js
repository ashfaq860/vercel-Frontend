import "./midheader.css";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllCat } from "../../api/internal";
import { useEffect, useState } from "react";
import MiniCart from "./minicart/miniCart";
import toast from "react-hot-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const MidHeader = ({ logo }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("0");
    const [searchTerm, setSearchTerm] = useState("");

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    // Load categories on mount
    useEffect(() => {
        const getAllcategories = async () => {
            try {
                const res = await getAllCat();
                setCategories(res.data.categories);
            } catch (error) {
                console.log(error);
            }
        };
        getAllcategories();
    }, []);

    const handleMicClick = () => {
        if (!browserSupportsSpeechRecognition) {
            toast.error("Your browser doesn't support voice input.");
            return;
        }

        SpeechRecognition.startListening({
            continuous: false,
            language: "en-US",
        });
    };
    const handleOnChangeSearch = (e) => {
        setSearchTerm(e.target.value);


    }
    // Update search term when transcript changes
    useEffect(() => {
        if (!transcript) return;
        if (transcript) {
            setSearchTerm(transcript);
            navigate(`/search/${transcript || "all"}/${category}`);
        }
         
    }, [transcript]);

   
    const search = (e) => {
        e.preventDefault();
        navigate(`/search/${searchTerm || "all"}/${category}`);
    };

    return (
        <>
            <div
                className="container-fluid "
                style={{ background: "#fff" }}
            >
                <div className="row">
                    <div className="col-12">
                        <div className="container">
                            <div className="row midHeader ">
                                <div className="col-lg-3 col-sm-5 ">
                                    <div className="logo text-left">
                                        <NavLink to="/" >
                                            {logo ? (
                                                <img
                                                    src={logo}
                                                    alt="Mian Auto Parts"
                                                    className="img-fluid"
                                                    style={{ height: "80px", width: "85%" }}
                                                />
                                            ) : (
                                                <img
                                                    src="icons/logo.png"
                                                    alt="Mian Auto Parts"
                                                    className="img-fluid"
                                                    style={{ height: "80px", width: "85%" }}
                                                />
                                            )}
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="col-lg-7 col-sm-7 mid-header">
                                    <div className="search-header-w">
                                        <div
                                            id="sosearchpro"
                                            className="sosearchpro-wrapper so-search "
                                        >
                                            <form onSubmit={search}>
                                                <div
                                                    id="search0"
                                                    className="search input-group form-group"
                                                >
                                                    <div className="select_category filter_type icon-select hidden-sm hidden-xs">
                                                        <select
                                                            className="no-border"
                                                            name="category_id"
                                                            onChange={(e) => setCategory(e.target.value)}
                                                        >
                                                            <option value="0">All Categories</option>
                                                            {categories.map((cat) => (
                                                                <option value={cat._id} key={cat._id}>
                                                                    {cat.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <input
                                                        className="form-control searchBox"
                                                        type="text"
                                                        value={searchTerm}
                                                        onChange={(e) => handleOnChangeSearch(e)}
                                                        placeholder="Keyword here..."
                                                    />
                                                    {searchTerm && <button className="button-cross btn" onClick={() => setSearchTerm("")} type="button"><i class="bi bi-x-lg"></i></button>}
                                                    <button
                                                        type="button"
                                                        onClick={handleMicClick}
                                                        className="button-mic btn"
                                                        name="start_speech"
                                                    >
                                                        {listening ? (
                                                            <i className="bi bi-mic-mute-fill"></i>
                                                        ) : (
                                                            <i className="bi bi-mic-fill"></i>
                                                        )}
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        className="button-search btn"
                                                        name="submit_search"
                                                    >
                                                        <i className="bi bi-search"></i>
                                                    </button>
                                                </div>
                                                <input
                                                    type="hidden"
                                                    name="route"
                                                    value="product/search"
                                                />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-xs-6 col-sm-6 d-none d-lg-block mid-header text-right">
                                    <MiniCart />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MidHeader;
