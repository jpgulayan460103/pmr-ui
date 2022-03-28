import React, { useState } from 'react';
import { Input, DatePicker, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { isEmpty } from 'lodash';
import FilterOptions from './../Components/FilterOptions'


const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const handleSearch = (event, getData) => {
    if(event.target.nodeName == "INPUT" && event.type=="click"){
        return false
    }
    getData();
}
const searchInput = (e, dataIndex, type, setFilters) => {
    if(type == "date_range"){
        if(!isEmpty(e)){
            e = e.map(i => moment(i).format("YYYY-MM-DD"))
        }
        setFilters(prev => ({...prev, [dataIndex]: e}));
    }else if(type == "number_range"){
        setFilters(prev => ({...prev, [dataIndex]: e.value, [`${dataIndex}_op`]: e.operand }));
    }else{
        setFilters(prev => ({...prev, [dataIndex]: e.target.value}));
    }
}

const NumberRange = ({searchInput, dataIndex, type, setFilters, getData}) => {
    const [range, setRange] = useState(">=");
    const selectBefore = (
        <Select value={range} onChange={setRange} className="select-before">
          {<Option value=">=">Greater than</Option>}
          {<Option value="<=">Less than</Option>}
          {/* <Option value=">=" label=">="><div className="demo-option-label-item">Greater than or equal to</div></Option> */}
          {/* <Option value="<=" label="<="><div className="demo-option-label-item">Less than or equal to</div></Option> */}
        </Select>   
    );
    return (
        <Input addonBefore={selectBefore} type="number" placeholder="input search number" allowClear onChange={(e) => searchInput({ operand: range, value: e.target.value }, dataIndex, type, setFilters)} onPressEnter={() => getData() } style={{ width: 300 }} />
    )
}

const search = (dataIndex, type, setFilters, filterData, getData) => ({
    filterDropdown: ({ }) => (
      <div style={{ padding: 8 }}>
          { type == "text" ? <Search placeholder="input search text" allowClear onChange={(e) => searchInput(e, dataIndex, type, setFilters)} onSearch={(e, event) => handleSearch(event, getData)} style={{ width: 200 }} /> : "" }
          { type == "number" ? <Input type="number" placeholder="input search text" allowClear onChange={(e) => searchInput(e, dataIndex, type, setFilters)} onPressEnter={() => getData() } style={{ width: 200 }} /> : "" }
          { type == "number_range" ? <NumberRange searchInput={searchInput} dataIndex={dataIndex} type={type} setFilters={setFilters} getData={getData} /> : "" }
          { type == "date_range" ? <RangePicker format={'YYYY-MM-DD'} style={{width: "100%"}} onChange={(e) => searchInput(e, dataIndex, type, setFilters)} /> : "" }
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    filteredValue: filterData[dataIndex] || null,
    onFilterDropdownVisibleChange: visible => {
        if (!visible && type=='date_range') {
            getData();
        }
      },
});

const list = (dataIndex, type, setFilters, filterData, getData) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, filters }) => {
        return <FilterOptions 
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            filters={filters}
            setFilters={setFilters}
            dataIndex={dataIndex}
            getData={getData}
        />;
    },
    filteredValue: filterData[dataIndex] || null,
});
export default {
    search,
    list
}