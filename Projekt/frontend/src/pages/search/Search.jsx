import "./search.css";
import Navbar from "../../components/navbar/Navbar";
import SearchResults from "../../components/searchResults/SearchResults";


export default function Search() {
    return (
        <>
            <Navbar/>
            <div className= "searchContainer">
                <SearchResults/>
            </div>
        </>
    );
}