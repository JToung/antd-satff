import React, { memo } from 'react';
import { Table, Row, Col, Card, Tabs, DatePicker } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './Home.less';

const CashFlowCard = memo(
    ({ rangePickerValue, salesData, isActive, handleRangePickerChange, loading, selectDate }) => (
        <Card title="应收应付管理" extra={<a href="#">More</a>} style={{ marginTop: 16 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
        </Card>
    )
);

export default CashFlowCard;
