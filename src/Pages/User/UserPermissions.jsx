import React, { useState, useEffect } from 'react';
import { Tree, Button, notification, Radio } from 'antd';
import { isEmpty, map } from 'lodash';
import api from '../../api';
import helpers from '../../Utilities/helpers';

const UserPermissions = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => { unmounted.current = true }
    }, []);
    const [expandedKeys, setExpandedKeys] = useState();
    const [checkedKeys, setCheckedKeys] = useState();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [loading, setLoading] = useState(false);
    const [office, setOffice] = useState("");
    const [role, setRole] = useState("");

    const treeData = [
          {
            title: 'User Profile',
            key: 'profile.all',
            children: [
              {
                title: 'Permission to update user information.',
                key: 'profile.information.update',
              },
              {
                title: 'Permission to update user technical working group.',
                key: 'profile.twg.update',
              },
            ],
          },
          {
            title: 'Activity Logs Module',
            key: 'activitylogs.all',
            children: [
              {
                title: 'Permission to view activity logs of the users.',
                key: 'activitylogs.view',
              },
            ],
          },

          {
            title: 'Approved Forms Module',
            key: 'form.routing.approved.all',
            children: [
              {
                title: 'Permission to view the list of approved forms.',
                key: 'form.routing.approved.view',
              },
            ],
          },

          {
            title: 'Disapproved Forms Module',
            key: 'form.routing.disapproved.all',
            children: [
              {
                title: 'Permission to view the list of disapproved forms.',
                key: 'form.routing.disapproved.view',
              },
            ],
          },

          {
            title: 'Pending Forms Module',
            key: 'form.routing.pending.all',
            children: [
              {
                title: 'Permission to view the list of forwarded forms.',
                key: 'form.routing.pending.view',
              },
              {
                title: 'Permission to review and finailize created project procurement plans.',
                key: 'form.routing.pending.review.procurement.plan',
              },
              {
                title: 'Permission to approve or disapprove project procurement plans.',
                key: 'form.routing.pending.approve.procurement.plan',
              },
              {
                title: 'Permission to review and finailize created purchase requests.',
                key: 'form.routing.pending.review.purchase.request',
              },
              {
                title: 'Permission to approve or disapprove purchase requests.',
                key: 'form.routing.pending.approve.purchase.request',
              },
              {
                title: 'Permission to review and finailize created requisition and issue slips.',
                key: 'form.routing.pending.review.requisition.issue',
              },
              {
                title: 'Permission to approve or disapprove requisition and issue slips.',
                key: 'form.routing.pending.approve.requisition.issue',
              },
              {
                title: 'Permission to issue items using requisition and issue slips. (Inventory permission is required)',
                key: 'form.routing.pending.issue.requisition.issue',
                disabled: office != "PSAMS" && role != "super-admin",
              },
            ],
          },

          {
            title: 'Inventory Module',
            key: 'inventories.all',
            disabled: office != "PSAMS" && role != "super-admin",
            children: [
              {
                title: 'Permission to view the list of items in the inventory.',
                key: 'inventories.items.view',
                disabled: office != "PSAMS" && role != "super-admin",
              },
              {
                title: 'Permission to create items in the inventory.',
                key: 'inventories.items.create',
                disabled: office != "PSAMS" && role != "super-admin",
              },
              {
                title: 'Permission to update items in the inventory.',
                key: 'inventories.items.update',
                disabled: office != "PSAMS" && role != "super-admin",
              },
              {
                title: 'Permission to update quantity of items in the inventory.',
                key: 'inventories.items.quantity.update',
                disabled: office != "PSAMS" && role != "super-admin",
              },
            ],
          },

          {
            title: 'Libraries Module',
            key: 'libraries.all',
            children: [
              {
                title: 'Permission to view the list of office signatories.',
                key: 'libraries.user.signatories.view',
              },
              {
                title: 'Permission to add the list of office signatories.',
                key: 'libraries.user.signatories.add',
                disabled: role != 'super-admin',
              },
              {
                title: 'Permission to update the list of office signatories.',
                key: 'libraries.user.signatories.update',
                disabled: role != 'super-admin',
              },
              {
                title: 'Permission to delete the list of office signatories.',
                key: 'libraries.user.signatories.delete',
                disabled: role != 'super-admin',
              },
              {
                title: 'Permission to view the list of unit of measures.',
                key: 'libraries.uom.view',
              },
              {
                title: 'Permission to add the list of unit of measures.',
                key: 'libraries.uom.add',
              },
              {
                title: 'Permission to update the list of unit of measures.',
                key: 'libraries.uom.update',
              },
              {
                title: 'Permission to delete the list of unit of measures.',
                key: 'libraries.uom.delete',
              },
              {
                title: 'Permission to view the list of UACS Codes.',
                key: 'libraries.uacs.view',
                disabled: office != "BS" && role != "super-admin",
              },
              {
                title: 'Permission to add the list of UACS Codes.',
                key: 'libraries.uacs.add',
                disabled: office != "BS" && role != "super-admin",
              },
              {
                title: 'Permission to update the list of UACS Codes.',
                key: 'libraries.uacs.update',
                disabled: office != "BS" && role != "super-admin",
              },
              {
                title: 'Permission to delete the list of UACS Codes.',
                key: 'libraries.uacs.delete',
                disabled: office != "BS" && role != "super-admin",
              },
            ],
          },
          {
            title: 'Procurement Module',
            key: 'procurement.all',
            children: [
              {
                title: 'Permission to view procument module.',
                key: 'procurement.view',
              },
            ],
          },

          {
            title: 'Project Procurement Plan Module',
            key: 'procurement.plan.all',
            children: [
              {
                title: 'Permission to view project procument plan.',
                key: 'procurement.plan.view',
              },
              {
                title: 'Permission to create project procument plan.',
                key: 'procurement.plan.create',
              },
              {
                title: 'Permission to update project procument plan.',
                key: 'procurement.plan.update',
              },
              {
                title: 'Permission to delete project procument plan.',
                key: 'procurement.plan.delete',
              },
              {
                title: 'Permission to have full access of attachments in the project procument plan module.',
                key: 'procurement.plan.attachments',
              },
            ],
          },

          {
            title: 'Purchase Requests Module',
            key: 'purchase.request.all',
            children: [
              {
                title: 'Permission to view the list of purchase requests.',
                key: 'purchase.request.view',
              },
              {
                title: 'Permission to create a purchase request.',
                key: 'purchase.request.create',
              },
              {
                title: 'Permission to update a purchase request.',
                key: 'purchase.request.update',
              },
              {
                title: 'Permission to delete a purchase request.',
                key: 'purchase.request.delete',
              },
              {
                title: 'Permission to have full access of attachments in the purchase request module.',
                key: 'purchase.request.attachments',
              },
            ],
          },

          {
            title: 'Requisition and Issue Module',
            key: 'requisition.issue.all',
            children: [
              {
                title: 'Permission to view the list of requisition and issue slips.',
                key: 'requisition.issue.view',
              },
              {
                title: 'Permission to create a requisition and issue slip.',
                key: 'requisition.issue.create',
              },
              {
                title: 'Permission to update a requisition and issue slip.',
                key: 'requisition.issue.update',
              },
              {
                title: 'Permission to delete a requisition and issue slip.',
                key: 'requisition.issue.delete',
              },
              {
                title: 'Permission to have full access of attachments in the requisition and issue slip module.',
                key: 'requisition.issue.attachments',
              },
            ],
          },

          {
            title: 'Users Module',
            key: 'users.all',
            disabled: role == 'user',
            children: [
              {
                title: 'Permission to view the list of users.',
                key: 'users.view',
                disabled: role == 'user',
              },
              {
                title: 'Permission to update a user.',
                key: 'users.update',
                disabled: role == 'user',
              },
              {
                title: 'Permission to update the permissions of a user.',
                key: 'users.permissions',
                disabled: role == 'user',
              },
              {
                title: 'Permission to delete a user.',
                key: 'users.delete',
                disabled: role == 'user',
              },
            ],
          },



      ];

      const handleChangeRole = e => {
        let selectedRole = e.target.value;
        setPermissionsOnRole(selectedRole)
      };

      const setPermissionsOnRole = (selectedRole) => {

        switch (selectedRole) {
          case "admin":
          case "super-admin":
            let perms = [
              'profile.information.update',
              'profile.twg.update',
              'activitylogs.view',
              'form.routing.approved.view',
              'form.routing.disapproved.view',
              'form.routing.pending.view',
              'form.routing.pending.review.procurement.plan',
              'form.routing.pending.approve.procurement.plan',
              'form.routing.pending.review.purchase.request',
              'form.routing.pending.approve.purchase.request',
              'form.routing.pending.review.requisition.issue',
              'form.routing.pending.approve.requisition.issue',
              'libraries.user.signatories.view',
              'libraries.uom.view',
              'libraries.uom.add',
              'libraries.uom.update',
              'libraries.uom.delete',
              'procurement.view',
              'procurement.plan.view',
              'procurement.plan.create',
              'procurement.plan.update',
              'procurement.plan.delete',
              'procurement.plan.attachments',
              'purchase.request.view',
              'purchase.request.create',
              'purchase.request.update',
              'purchase.request.delete',
              'purchase.request.attachments',
              'requisition.issue.view',
              'requisition.issue.create',
              'requisition.issue.update',
              'requisition.issue.delete',
              'requisition.issue.attachments',
              'users.view',
              'users.update',
              'users.delete',
              'users.permissions',
            ]

            if(office == "PSAMS" || selectedRole == "super-admin"){
              perms.push('form.routing.pending.issue.requisition.issue');
              perms.push('inventories.items.view');
              perms.push('inventories.items.create');
              perms.push('inventories.items.update');
              perms.push('inventories.items.quantity.update');
            }
            if(office == "BS" || selectedRole == "super-admin"){
              perms.push('libraries.uacs.view');
              perms.push('libraries.uacs.add');
              perms.push('libraries.uacs.update');
              perms.push('libraries.uacs.delete');
            }

            if(selectedRole == 'super-admin'){
              perms.push('libraries.user.signatories.add');
              perms.push('libraries.user.signatories.delete');
              perms.push('libraries.user.signatories.update');
            }
            setCheckedKeys(perms);
            break;
          case "user":
            setCheckedKeys([
              'purchase.request.view',
              'requisition.issue.view',
              'procurement.plan.view',
              'libraries.user.signatories.view',
              'libraries.uom.view',
            ]);
            break;
        
          default:
            break;
        }
        setRole(selectedRole);
      }

      const savePermission = () => {
        setLoading(true);
        let mapped = checkedKeys.map((perm, index) => {
          let position = perm.search(".all");
          if(position > 0){
            perm = "";
          }
          return perm;
        })
        let permissions = mapped.filter(perm => perm != "");
        let formData = {
          user_id: props.user.key,
          permissions,
          role: role,
        };
        api.User.updatePermission(formData)
        .then(res => {
            // if (unmounted.current) { return false; }
            setLoading(false);
            props.getUsers();
            notification.success({
                message: 'Success',
                description:
                  'Your changes have been successfully saved!',
            });
        })
        .catch(err => {
          setLoading(false);
        })
        .then(res => {})
        ;
      }

      useEffect(() => {
        let officeTitle = props.user?.user_offices?.data[0]?.office?.title;
        setOffice(officeTitle);

        let propUserRoles = props.user.roles?.data[0]?.name;
        setRole(propUserRoles);
        setPermissionsOnRole(propUserRoles);

        setExpandedKeys([
          'profile.all',
          'activitylogs.all',
          'form.routing.approved.all',
          'form.routing.disapproved.all',
          'form.routing.pending.all',
          'libraries.all',
          'inventories.all',
          'procurement.all',
          'procurement.plan.all',
          'requisition.issue.all',
          'purchase.request.all',
          'users.all',
        ]);
        // console.log(props.user.permissions.data);
        if(!isEmpty(props.user)){
          setCheckedKeys(map(props.user.permissions.data, 'name'));
        }
        if(propUserRoles == "user"){
        }

        // if(officeTitle == "PSAMS")
      }, [props.user]);
    
      const onExpand = (expandedKeysValue) => {
        // console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
    
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
      };
    
      const onCheck = (checkedKeysValue) => {
        // console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
      };
    
      const onSelect = (selectedKeysValue, info) => {
        // console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
      };

    return (
        
        <div>

            Role: &nbsp;
            <Radio.Group onChange={handleChangeRole} value={role}>
              <Radio value="user">User</Radio>
              <Radio value="admin">Admin</Radio>
              { props.allowSuperAdmin && <Radio value="super-admin">Super Admin</Radio> }
            </Radio.Group>
            <br />
            <br />
            Permissions:
            <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            // checkedKeys={checkedKeys}
            onSelect={onSelect}
            // checkedKeys={['users.delete', 'purchase.request.all']}
            checkedKeys={checkedKeys}
            treeData={treeData}
            // disabled={role != 'user'}
            />
            <br />
            <Button type='primary' loading={loading} disabled={loading} onClick={() => {
                savePermission()
              }}>Save</Button>
        </div>
    );
}

export default UserPermissions;
