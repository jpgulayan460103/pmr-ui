import React from 'react';
import { Table, Tag, Space } from 'antd';


const VoucherTables = ({setOpenedImage, setOpenImage}) => {

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
          title: 'Voucher No.',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Status',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Out from Budget Section / Status Remarks',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Out from Accounting Section / Status Remarks',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Receipt of Payment',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'OBR by Budget (link)',
          dataIndex: 'name',
          key: 'name',
        },
      ];
      
    return (
    <div>
        <Table dataSource={dataSource} columns={columns}
        onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setOpenedImage("https://guillaumejaume.github.io/FUNSD/img/form_example.png");
              }, // click row
              onDoubleClick: event => {}, // double click row
              onContextMenu: event => {}, // right button click row
              onMouseEnter: event => {}, // mouse enter row
              onMouseLeave: event => {}, // mouse leave row
            };
          }}
        />
    </div>
    );
}
 

/* 









*/
export default VoucherTables;