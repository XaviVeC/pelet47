import React, { useState, useEffect, useRef } from "react";
import CarRouteSearch from './CarRouteSearch';
import WalkRouteSearch from './WalkRouteSearch';

const RouteSearch = ({conquevoy, handleSearch, searchStart, setSearchStart, searchEnd, setSearchEnd }) => {
    if(conquevoy === "driving-car") {
        return (<CarRouteSearch handleSearch={handleSearch} searchStart={searchStart} setSearchStart={setSearchStart} searchEnd={searchEnd} setSearchEnd={setSearchEnd}/>)
    }

    if(conquevoy === "foot-walking") {
        return (<WalkRouteSearch handleSearch={handleSearch} searchStart={searchStart} setSearchStart={setSearchStart}/>)
    }
}

export default RouteSearch;



