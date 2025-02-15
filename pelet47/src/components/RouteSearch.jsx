import React, { useState, useEffect, useRef } from "react";
import CarRouteSearch from './CarRouteSearch';
import WalkRouteSearch from './WalkRouteSearch';


const RouteSearch = ({conquevoy, handleSearch, searchStart, setSearchStart, searchEnd, setSearchEnd }) => {
    function cleanMarker() {
        setSearchEnd("");
        setSearchStart("");
    }
    

    if(conquevoy[1] === 0) {
        return (
            <div>
                <CarRouteSearch handleSearch={handleSearch} searchStart={searchStart} setSearchStart={setSearchStart} searchEnd={searchEnd} setSearchEnd={setSearchEnd}/>
            </div>
        )
    }

    if(conquevoy[1] === 2) {
        return (
            <div>
                <WalkRouteSearch handleSearch={handleSearch} searchStart={searchStart} setSearchStart={setSearchStart}/>
            </div>
        )
    }

    if(conquevoy[1] === 1) {
        return (
            <div>
                <CarRouteSearch handleSearch={handleSearch} searchStart={searchStart} setSearchStart={setSearchStart} searchEnd={searchEnd} setSearchEnd={setSearchEnd}/>
            </div>
        )
    }
}

export default RouteSearch;



