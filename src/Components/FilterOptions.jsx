import React, {useState, useEffect} from 'react';
import { Input, Checkbox, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';

const FilterOptions = (
    {
        setSelectedKeys,
        selectedKeys,
        confirm,
        filters,
        setTableFilter,
        dataIndex,
        getData,
        tableFilter
    }
) => {
    useEffect(() => {
        console.log("rerender");
    }, []);
    const [searchStr, setSearchStr] = useState("");
    const changeSearchStr = (e) => {
        let val = e.target.value;
        setSearchStr(val);
    }
    const resetSelected = () => {
        let clonedFilter = cloneDeep(tableFilter);
        setSelectedKeys([]);
        setTableFilter({...clonedFilter, [dataIndex]: []});
    }
    const setFilterOptions = () => {
        let clonedFilter = cloneDeep(tableFilter);
        confirm({ closeDropdown: true });
        setTableFilter({...clonedFilter, [dataIndex]: selectedKeys});
        getData();
    }
    const selectOption = (e, option) => {
        let clonedFilter = cloneDeep(tableFilter);
        if(e.target.checked){
            if(selectedKeys && selectedKeys.indexOf(option.value) > -1){
            }else{
                if(selectedKeys){
                    setSelectedKeys([...selectedKeys, option.value]);
                    setTableFilter({...clonedFilter, [dataIndex]: [...selectedKeys, option.value]});
                }else{
                    setSelectedKeys([option.value]);
                    setTableFilter({...clonedFilter, [dataIndex]: [option.value]});
                }
            }
        }else{
            setSelectedKeys(selectedKeys.filter(i => i != option.value));
            setTableFilter({...clonedFilter, [dataIndex]: selectedKeys.filter(i => i != option.value)});
        }
    }
    return (
        <div className='p-2' style={{ minHeight: 100, maxHeight: 400, width: "100%" }}>
            <div className='px-1 mb-2'>
                <Input placeholder="search in filters" prefix={<SearchOutlined />} onChange={changeSearchStr} />
            </div>
            <div className='px-1 mb-2'style={{maxHeight: 200, overflow: "scroll", overflowX: "hidden"}}>
                <Checkbox.Group style={{ width: '100%' }} value={selectedKeys} >
                { filters.filter(i => i.text.toLocaleLowerCase().search(searchStr.toLocaleLowerCase()) >=0 ).map((option, index) => (<div key={index} className="filter-options"><Checkbox onChange={(e) => selectOption(e, option)} value={option.value}>{option.text}</Checkbox></div>)) }
                </Checkbox.Group>
            </div>
            <div className='px-1'>
                <span className='custom-pointer' onClick={resetSelected}>Reset</span>
                <Button type='primary' size='small' className='float-right' onClick={() => setFilterOptions()}>OK</Button>
            </div>
        </div>
    );
}

export default FilterOptions;
