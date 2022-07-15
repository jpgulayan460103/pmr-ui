import { AutoComplete, Col, Form, Input } from 'antd';
import React, { useState } from 'react';
import helpers from '../../Utilities/helpers';
const { TextArea } = Input;


const CreatePurchaseRequestItemName = ({changeTableFieldValue, item, index, formErrors}) => {
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setinputValue] = useState(item.item_name);
    const editItem = () => {
        setShowInput(true);
    }
    const saveItem = () => {
        setShowInput(false);
        changeTableFieldValue(inputValue, {}, 'item_name', index);
    }
    return (
        <Col xs={24} sm={24} md={8} lg={8} xl={8} onMouseEnter={editItem} onMouseLeave={saveItem}>
            <div>
            <Form.Item { ...helpers.displayError(formErrors, `items.${index}.item_name`) }>
                { (!item.is_common_item && showInput) ? (
                    <TextArea
                        autoSize
                        placeholder="Item Description"
                        onChange={(e) => {
                            setinputValue(e.target.value);
                        }}
                        value={inputValue}
                    />
                ) : (
                    <span style={{whiteSpace: "pre-line"}}>{item.item_name}</span>
                ) }
            </Form.Item>
            </div>
        </Col>
    );
}
export default CreatePurchaseRequestItemName;
