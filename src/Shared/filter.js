import React from 'react';
import { Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { RangePicker } = DatePicker;

const handleSearch = (event, getData) => {
    if(event.target.nodeName == "INPUT" && event.type=="click"){
        return false
    }
    getData();
}
const searchInput = (e, dataIndex, type, setFilters) => {
    if(type == "date_range"){
        setFilters(prev => ({...prev, [dataIndex]: e}));
    }else{
        setFilters(prev => ({...prev, [dataIndex]: e.target.value}));
    }
}

const filter = (dataIndex, type, setFilters, filters, getData) => ({
    filterDropdown: ({ }) => (
      <div style={{ padding: 8 }}>
          { type == "text" ? <Search placeholder="input search text" allowClear onChange={(e) => searchInput(e, dataIndex, type, setFilters)} onSearch={(e, event) => handleSearch(event, getData)} style={{ width: 200 }} /> : "" }
          { type == "number" ? <Input type="number" placeholder="input search text" allowClear onChange={(e) => searchInput(e, dataIndex, type, setFilters)} onPressEnter={() => getData() } style={{ width: 200 }} /> : "" }
          { type == "date_range" ? <RangePicker format={'YYYY-MM-DD'} style={{width: "100%"}} onChange={(e) => searchInput(e, dataIndex, type, setFilters)} /> : "" }
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    filteredValue: filters[dataIndex] || null,
    onFilterDropdownVisibleChange: visible => {
        if (!visible) {
            getData();
        }
    }
});
export default filter