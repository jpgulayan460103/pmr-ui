import React, { useState, useEffect } from 'react';
import { Tree, Button, notification, Radio } from 'antd';
import { isEmpty, map } from 'lodash';
import api from '../../api';

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

    const treeData = [
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
            title: 'Forwarded Forms Module',
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
                disabled: office != "PSAMS",
              },
            ],
          },

          {
            title: 'Inventory Module',
            key: 'inventories.all',
            disabled: office != "PSAMS",
            children: [
              {
                title: 'Permission to view the list of items in the inventory.',
                key: 'inventories.items.view',
                disabled: office != "PSAMS",
              },
              {
                title: 'Permission to create items in the inventory.',
                key: 'inventories.items.create',
                disabled: office != "PSAMS",
              },
              {
                title: 'Permission to update items in the inventory.',
                key: 'inventories.items.update',
                disabled: office != "PSAMS",
              },
              {
                title: 'Permission to update quantity of items in the inventory.',
                key: 'inventories.items.quantity.update',
                disabled: office != "PSAMS",
              },
            ],
          },

          {
            title: 'Libraries Module',
            key: 'libraries.all',
            children: [
              {
                title: 'Permission to view the list of user positions.',
                key: 'libraries.positions.view',
              },
              {
                title: 'Permission to add the list of user positions.',
                key: 'libraries.positions.add',
              },
              {
                title: 'Permission to update the list of user positions.',
                key: 'libraries.positions.update',
              },
              {
                title: 'Permission to delete the list of user positions.',
                key: 'libraries.positions.delete',
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
                disabled: office != "BS",
              },
              {
                title: 'Permission to add the list of UACS Codes.',
                key: 'libraries.uacs.add',
                disabled: office != "BS",
              },
              {
                title: 'Permission to update the list of UACS Codes.',
                key: 'libraries.uacs.update',
                disabled: office != "BS",
              },
              {
                title: 'Permission to delete the list of UACS Codes.',
                key: 'libraries.uacs.delete',
                disabled: office != "BS",
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
            key: 'purchase.requests.all',
            children: [
              {
                title: 'Permission to view the list of purchase requests.',
                key: 'purchase.requests.view',
              },
              {
                title: 'Permission to create a purchase request.',
                key: 'purchase.requests.create',
              },
              {
                title: 'Permission to update a purchase request.',
                key: 'purchase.requests.update',
              },
              {
                title: 'Permission to delete a purchase request.',
                key: 'purchase.requests.delete',
              },
              {
                title: 'Permission to have full access of attachments in the purchase request module.',
                key: 'purchase.requests.attachments',
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
            children: [
              {
                title: 'Permission to view the list of users.',
                key: 'users.view',
              },
              {
                title: 'Permission to update a user.',
                key: 'users.update',
              },
              {
                title: 'Permission to update the permissions of a user.',
                key: 'users.permissions',
              },
              {
                title: 'Permission to delete a user.',
                key: 'users.delete',
              },
            ],
          },



      ];


      const [role, setRole] = useState("");

      const handleChangeRole = e => {
        let selectedRole = e.target.value;
        setPermissionsOnRole(selectedRole)
      };

      const setPermissionsOnRole = (selectedRole) => {

        switch (selectedRole) {
          case "admin":
          case "super-admin":
            setCheckedKeys([
              'activitylogs.all',
              'form.routing.approved.all',
              'form.routing.disapproved.all',
              'form.routing.pending.all',
              'libraries.all',
              'procurement.all',
              'purchase.requests.all',
              'users.all',
              'procurement.plan.all',
              'requisition.issue.all',
            ]);
            break;
          case "user":
            setCheckedKeys([
              'purchase.requests.view',
              'purchase.requests.create',
              'libraries.uom.view',
              'libraries.uacs.view',
            ]);
            break;
        
          default:
            break;
        }
        setRole(selectedRole);
      }

      const savePermission = () => {
        setLoading(true);
        let permissions = checkedKeys.map((perm, index) => {
          let position = perm.search(".all");
          if(position > 0){
            perm = "";
          }
          return perm;
        })
        let formData = {
          user_id: props.user.key,
          permissions,
          role: role,
        };
        api.User.updatePermission(formData)
        .then(res => {
            if (unmounted.current) { return false; }
            setLoading(false);
            props.getUsers();
            notification.success({
                message: 'Done',
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
          'activitylogs.all',
          'form.routing.approved.all',
          'form.routing.disapproved.all',
          'form.routing.pending.all',
          'libraries.all',
          'inventories.all',
          'procurement.all',
          'procurement.plan.all',
          'requisition.issue.all',
          'purchase.requests.all',
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
            // checkedKeys={['users.delete', 'purchase.requests.all']}
            checkedKeys={checkedKeys}
            treeData={treeData}
            // disabled={role != 'user'}
            />
            <Button type='primary' loading={loading} disabled={loading} onClick={() => {
              savePermission()
            }}>Save</Button>
        </div>
    );
}

export default UserPermissions;
