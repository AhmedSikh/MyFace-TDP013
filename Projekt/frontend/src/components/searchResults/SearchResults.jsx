import "./searchResults.css"

import SearchObject from "../searchObject/SearchObject";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SearchResults() {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  let searchTerm = query.get("q");
  if ( searchTerm === "") searchTerm = "*";
  const queryData = searchTerm;
  const [searchResults, setResults] = useState([]);

  //Render search results every time queryData changes
   useEffect(()=>{
      const fetchResults = async () => {
        const response = await axios.get(`users/search/${queryData}`)
        setResults(response.data);
      }
      fetchResults();
  }, [queryData]);



    return (
      <div className="searchResults">
        <div className="SearchResultsWrapper">
          <span className="searchTitle">Search results:</span>
          <hr className="searchHr" />
          <ul className="searchList">
            {searchResults.map((u) => (
              <SearchObject key={u._id} user={u} />
            ))}
          </ul>
        </div>
      </div>
    );
  }