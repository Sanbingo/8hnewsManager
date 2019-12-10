import React, { Component } from 'react';
import { groupBy, chunk } from 'lodash';
import style from './list.less';
const MAX_COLUMNS = 6;

export default class List extends Component {
    render() {
        const { list = [], onViewMessage } = this.props
        
        const groupList = chunk(list, list.length/MAX_COLUMNS);
        return (
            <div style={{ display: 'flex'}}>
               {
                   groupList.map(item => (
                    <div className={style.wrapper}>
                        { item.map( sub => <span style={{ cursor: 'pointer'}} key={sub.id} onClick={()=> onViewMessage(sub)} className={style.wrapper_item}>{sub.siteName}</span>)}
                    </div>
                   ))
               }
            </div>
            
        );
    }
}