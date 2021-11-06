import React from 'react';
import { Table, Tag, Space } from 'antd';


const PurchaseOrdersTable = () => {

    const dataSource = [
        {
          key: '1',
          name: 'Mike',
          age: 32,
          address: '10 Downing Street',
        },
        {
          key: '2',
          name: 'John',
          age: 42,
          address: '10 Downing Street',
        },
      ];
      
      const columns = [
        {
          title: 'PO Number',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'PO (Link)',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Name of Supplier',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Inspection & Acceptance Report (Scanned Copy) and Receipt',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Receipt (Scanned Copy)',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Receipt No.',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Type of Equipment',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Attendance',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Certificate of Acceptance',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Certificate of Occupancy',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Certificate of Completion',
          dataIndex: 'name',
          key: 'name',
        },
      ];
    return (
    <div>
        <Table dataSource={dataSource} columns={columns} />
    </div>
    );
}
 
export default PurchaseOrdersTable;

/* 













*/