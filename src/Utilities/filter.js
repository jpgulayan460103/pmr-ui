import React, { useState, useCallback, useEffect } from 'react';
import { Input, DatePicker, Select, Button, Tag } from 'antd';
import { SearchOutlined, FilterFilled } from '@ant-design/icons';
import moment from 'moment';
import { cloneDeep, isEmpty } from 'lodash';
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
const searchInput = (e, dataIndex, type, setTableFilter, tableFilter = {}) => {
    let clonedFilter = cloneDeep(tableFilter);
    if(type == "date_range"){
        if(!isEmpty(e)){
            e = e.map(i => moment(i).format("YYYY-MM-DD"))
        }
        setTableFilter({...clonedFilter, [dataIndex]: e, page: 1});
    }else if(type == "number_range"){
        setTableFilter({...clonedFilter, [dataIndex]: e.value, [`${dataIndex}_op`]: e.operand, page: 1 });
    }else{
        setTableFilter({...clonedFilter, [dataIndex]: e.target.value, page: 1});
    }
}

const NumberRange = ({defaultValue, searchInput, dataIndex, type, setTableFilter, getData, tableFilter}) => {
    const [range, setRange] = useState(">=");
    const [value, setValue] = useState(null);
    const handleChange = useCallback((e) => {
        searchInput({ operand: range, value: e.target.value }, dataIndex, type, setTableFilter, tableFilter);
        setValue(e.target.value);
    },[value]);
    const handleSelect = useCallback((e) => {
        searchInput({ operand: e, value }, dataIndex, type, setTableFilter, tableFilter);
        setRange(e);
        setValue(null);
    },[range])
    const selectBefore = (
        <Select value={range} onChange={handleSelect} className="select-before">
          <Option value=">=">Greater than</Option>
          <Option value="<=">Less than</Option>
        </Select>   
    );
    return (
        <Input.Group compact>
            <Input addonBefore={selectBefore} type="number" value={defaultValue} placeholder="input search number" allowClear onChange={handleChange} onPressEnter={() => getData() } style={{ width: 300 }} />
            <Button type="default" icon={<SearchOutlined />}  onClick={() => getData() } />
        </Input.Group>
    )
}

const ExtraDateRangeFooter = ({selectFilter, getData}) => {
    return (
        <React.Fragment>
            <Tag className='custom-pointer' onClick={() => selectFilter("now")}>Now</Tag>
            <Tag className='custom-pointer' onClick={() => selectFilter("this_week")}>This Week</Tag>
            <Tag className='custom-pointer' onClick={() => selectFilter("this_month")}>This Month</Tag>
            <Tag className='custom-pointer' onClick={() => selectFilter("three_month")}>3 months</Tag>
            <Tag className='custom-pointer' onClick={() => selectFilter("six_month")}>6 months</Tag>
            <Tag className='custom-pointer' onClick={() => selectFilter("this_year")}>This Year</Tag>
            <Tag className='custom-pointer' onClick={() => selectFilter("last_year")}>Last Year</Tag>
            <Tag className='custom-pointer' onClick={() => getData()} ><SearchOutlined /></Tag>
        </React.Fragment>
    );
}

const DateRange = ({defaultValue, searchInput, dataIndex, type, setTableFilter, getData, tableFilter}) => {
    const [value, setValue] = useState([]);
    useEffect(() => {
        setValue(defaultValue?.map(i => moment(i, "YYYY-MM-DD")));
    }, [defaultValue]);
    const selectFilter = useCallback((selected) => {
        var currentDate = moment();
        var dateStart;
        var dateEnd;
        switch (selected) {
            case "now":
                searchInput([currentDate, currentDate], dataIndex, type, setTableFilter, tableFilter)
                break;
        
            case "this_week":
                dateStart = currentDate.clone().startOf('isoWeek');
                dateEnd = currentDate.clone().endOf('isoWeek');
                searchInput([dateStart, dateEnd], dataIndex, type, setTableFilter, tableFilter)
                break;
        
            case "this_month":
                dateStart = currentDate.clone().startOf('month');
                dateEnd = currentDate.clone().endOf('month');
                searchInput([dateStart, dateEnd], dataIndex, type, setTableFilter, tableFilter)
                break;
        
            case "three_month":
                dateStart = currentDate.clone().subtract(2, 'month');
                dateEnd = currentDate.clone();
                searchInput([dateStart, dateEnd], dataIndex, type, setTableFilter, tableFilter)
                break;
        
            case "six_month":
                dateStart = currentDate.clone().subtract(5, 'month');
                dateEnd = currentDate.clone();
                searchInput([dateStart, dateEnd], dataIndex, type, setTableFilter, tableFilter)
                break;
        
            case "this_year":
                dateStart = currentDate.clone().startOf('year');
                dateEnd = currentDate.clone().endOf('year');
                searchInput([dateStart, dateEnd], dataIndex, type, setTableFilter, tableFilter)
                break;
            case "last_year":
                dateStart = currentDate.clone().subtract(1, 'year').startOf('year');
                dateEnd = currentDate.clone().subtract(1, 'year').endOf('year');
                searchInput([dateStart, dateEnd], dataIndex, type, setTableFilter, tableFilter)
                break;
        
            default:
                break;
        }
    }, []);
    return (
        <Input.Group compact>
            <RangePicker value={value} format={'YYYY-MM-DD'} style={{width: "90%"}} onChange={(e) => searchInput(e, dataIndex, type, setTableFilter, tableFilter)} renderExtraFooter={() => <ExtraDateRangeFooter selectFilter={selectFilter} getData={getData} />} />
            <Button type="default" icon={<SearchOutlined />}  onClick={() => getData() } />
        </Input.Group>
    );
}

const search = (dataIndex, type, setTableFilter, tableFilter, getData) => ({
    filterDropdown: ({ }) => (
      <div style={{ padding: 8 }}>
          { type == "text" ? <Search placeholder="input search text" value={tableFilter[dataIndex]} allowClear onChange={(e) => searchInput(e, dataIndex, type, setTableFilter, tableFilter)} onSearch={(e, event) => handleSearch(event, getData)} style={{ width: 200 }} /> : "" }
          { type == "number" ? <Input type="number" value={tableFilter[dataIndex]} placeholder="input search text" allowClear onChange={(e) => searchInput(e, dataIndex, type, setTableFilter, tableFilter)} onPressEnter={() => getData() } style={{ width: 200 }} /> : "" }
          { type == "number_range" ? <NumberRange defaultValue={tableFilter[dataIndex]} searchInput={searchInput} dataIndex={dataIndex} type={type} setTableFilter={setTableFilter} getData={getData} tableFilter={tableFilter} /> : "" }
          { type == "date_range" ? <DateRange defaultValue={tableFilter[dataIndex]} searchInput={searchInput} dataIndex={dataIndex} type={type} setTableFilter={setTableFilter} getData={getData} tableFilter={tableFilter} /> : "" }
      </div>
    ),
    filterIcon: filtered => <FilterFilled className={filtered ? 'table-active-filter' : null} />,
    filteredValue: tableFilter[dataIndex] || null,
    onFilterDropdownVisibleChange: visible => {
        if (!visible) {
            // getData();
        }
      },
});

const list = (dataIndex, type, setTableFilter, tableFilter, getData) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, filters }) => {
        return <FilterOptions 
            setSelectedKeys={setSelectedKeys}
            selectedKeys={selectedKeys}
            confirm={confirm}
            filters={filters}
            setTableFilter={setTableFilter}
            dataIndex={dataIndex}
            getData={getData}
        />;
    },
    filteredValue: tableFilter[dataIndex] || null,
    filterIcon: filtered => <FilterFilled className={filtered ? 'table-active-filter' : null} />,
});
export default {
    search,
    list
}