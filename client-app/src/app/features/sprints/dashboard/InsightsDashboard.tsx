import React, { useEffect, useState } from 'react';
import {observer} from 'mobx-react-lite';
import Filters from './Filters/Filters';
import _ from 'lodash';
import IssueStatusRadar from './Charts/IssueStatusRadar';



export default observer(function InsightsDashboard() {
    return(
        <div>
            <Filters />
            <div>
                <p>This page is in development.</p>
            </div>
            <div style={{width: '40%', height: '400px'}} >
                <IssueStatusRadar />
            </div>
        </div>
    )
})