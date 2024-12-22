import React,{useState,useEffect} from 'react';
import Canvas from './pages/Canvas';
import Menu from './pages/Menu';
import Preloader from './pages/Preloader';
export default ()=>{
    const [loading, setLoading] = useState(true);
    useEffect(()=>{},[])
    return(
        <>
            <Canvas/>
            {loading && <Preloader/>}
            {!loading && <Menu/>}
        </>
    )
}