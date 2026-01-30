import React from 'react';
import {useTranslation} from 'react-i18next';
import moment from 'moment'

const SearchBar = ({keyword,setKeyword,fieldType,placeholder}) => {
  const {t} = useTranslation()
  const BarStyling = {background:"#F2F1F9", border:"none", padding:"0.7rem", margin:"10px 20px 10px 12px"};
  return (
    fieldType && fieldType && fieldType == "date" ?
    <input 
     style={BarStyling}
     className="search-bar"
     key="random1"
     value={keyword}
     placeholder={fieldType && fieldType == "date" ?  moment().format('DD/MM/YYYY')  : t("Select Date")}
     onChange={(e) => setKeyword(e.target.value)}
     type={"date"}
     required
     autoFocus
    />
    :
    <input 
     style={BarStyling}
     className="search-bar"
     key="search"
     value={keyword}
     placeholder={placeholder ? placeholder : t("Search Clients")}
     onChange={(e) => setKeyword(e.target.value)}
     required
     autoFocus
    />
  );
}

export default SearchBar