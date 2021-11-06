import React from 'react';
import { Table, Tag, Space } from 'antd';


const DeliveryTables = ({setOpenedImage, setOpenImage}) => {

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
          title: 'Date of Delivery',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Delivery Completion',
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
 
export default DeliveryTables;