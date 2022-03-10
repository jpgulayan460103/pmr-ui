import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import api from '../../api';
import { Table, Card, Col, Row  } from 'antd';


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        item_categories: state.library.item_categories,
        unit_of_measures: state.library.unit_of_measures,
        user_divisions: state.library.user_divisions,
        user_sections: state.library.user_sections,
        user_sections: state.library.user_sections,
        user_signatory_names: state.library.user_signatory_names,
    };
}

const ListLibrary = (props) => {

    useEffect(() => {
        if(props.isInitialized){

        }
    }, [props.isInitialized]);

    const dataSource = props[props.libraryType].map(i => {
            return {
                key: i.key,
                name: i.name,
                title: i.title,
                library_type: i.library_type,
                library_type_str: i.library_type_str,
                parent: i.parent,
            };
        }
    );

    const defaultColumns = [
        {
            title: 'Library',
            dataIndex: 'library_type_str',
            key: 'library_type_str',
            width: 50,
        },
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
    ];
    const columns = () => {
        let cols =  [
            ...defaultColumns,
        ]
        if(props.options.title){
            cols.push(
                {
                    title: 'title',
                    dataIndex: 'title',
                    key: 'title',
                    width: 150,
                    sorter: (a, b) => a.title.localeCompare(b.title)
                },
            );
        }
        if(props.options.parent){
            cols.push(
                {
                    title: props.options.parentLabel,
                    key: 'parent-key',
                    width: 150,
                    sorter: (a, b) => a.parent?.name.localeCompare(b.parent?.name),
                    render: (text, item, index) => (
                        <span>
                            { item.parent?.name }
                        </span>
                    ),
                }
            );
        }
        return cols;
    };
    return (
        <Row gutter={[16, 16]} className="mb-3">
            <Col sm={24} md={16} lg={14} xl={14}>
                <Card size="small" title="Users" bordered={false}  >
                    <div className='user-card-content'>
                        <Table
                            dataSource={dataSource}
                            columns={ columns() }
                            size={"small"}
                            pagination={{showSizeChanger:false}}
                        />
                    </div>
                </Card>
            </Col>
            <Col sm={24} md={8} lg={10} xl={10}>
                <Card size="small" title="Update User" bordered={false}>
                    <div className='user-card-content'>
                        {/* <UserForm userInfo={formData} type="update" getUsers={getUsers} /> */}
                    </div>
                </Card>
            </Col>
        </Row>
    );
}

ListLibrary.defaultProps = {
    options: {
        parent: false,
        title: false,
        parentLabel: "Parent",
        titleLabel: "Parent",

    }
}

export default connect(
    mapStateToProps,
  )(ListLibrary);
