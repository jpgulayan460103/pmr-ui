import React from 'react';

import { Modal, Button, Tabs, Form, Input, message  } from 'antd';

const { Search } = Input;

const ProcurementFilters = ({setIsModalVisible, setFormType}) => {

    const showModal = () => {
        setIsModalVisible(true);
        setFormType("create");
    };
    return (
        <div>
            <Search placeholder="input search text" onSearch={() => {}} style={{ width: 200 }} />
            <Button type="primary" onClick={showModal}>
                Add
            </Button>
            <br />
            <br />
        </div>
    );
};

export default ProcurementFilters;