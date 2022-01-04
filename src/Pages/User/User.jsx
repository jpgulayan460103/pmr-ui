import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import UserTable from './UserTable'
import UserPermissions from './UserPermissions'
import RegistrationFormActive from '../Login/RegistrationFormActive';
import api from '../../api';



function mapStateToProps(state) {
    return {

    };
}

const User = () => {

    useEffect(() => {
        getUsers()
    }, []);

    const [formData, setFormData] = useState({});
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [editType, setEditType] = useState("");

    const selectUser = (selected, type) => {
        setSelectedUser(selected);
        selected.user_information.username = selected.username;
        setFormData(selected.user_information);
        setEditType(type);
    }

    const getUsers = () => {
        api.User.all()
        .then(res => {
            setUsers(res.data.data);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    
    return (
        <div className='row'>
            <div className='col-md-6'>
                <UserTable users={users} selectUser={selectUser} />
            </div>
            <div className='col-md-6'>
                { editType=="edit" ?  (
                    <RegistrationFormActive userInfo={formData} type="update" />
                ) : "" }
                { editType=="permissions" ?  (
                    <UserPermissions />
                ) : "" }
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(User);

