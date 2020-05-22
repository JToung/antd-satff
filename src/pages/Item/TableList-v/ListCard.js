import React, { memo } from 'react';
import { Table, Row, Col, Card, Tabs, DatePicker } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './Item.less';


const ListCardItem = memo(
    ({ rangePickerValue, salesData, isActive, handleRangePickerChange, loading, selectDate }) => (
        <Card title="单品列表" extra={<a href="/item/list">More</a>} style={{ marginTop: 16 }}>

        </Card>
    )
);

export default ListCardItem;
