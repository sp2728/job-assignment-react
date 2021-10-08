import React from 'react'
import {Route, Redirect} from "react-router-dom";
import Dashboard from '../Dashboard/Dashboard';
import Header from '../Header/Header';
import Introduction from '../Introduction/Introduction';
import Sidebar from '../Sidebar/Sidebar';
import UserHistory from '../UserHistory/UserHistory';
import './Layout.css';
import Cookies from 'js-cookie';

const Layout = (props) => {
    console.log(props.location)
    if(Cookies.get('userid', {path: '/'})){ /* Later: use auth-token and perform authentication from backend*/
        return (
            <div>
                <Header />
                <div className="box">
                    <Sidebar />
                    <div className="content">
                        <Route path="/app/patient-finder" component={Dashboard} ></Route>
                        <Route path="/app/introduction" component={Introduction}></Route>
                        <Route path="/app/preference" component={UserHistory}></Route>
                    </div>
                </div>
            </div>
        )
    }else{
        return <Redirect to="/login" />;
    }
}

export default Layout