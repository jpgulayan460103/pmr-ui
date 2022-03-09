import React, { useState, useEffect } from 'react';
import { Tree, Button } from 'antd';
import { map } from 'lodash';
import api from '../../api';

const UserPermissions = (props) => {

    const treeData = [
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
              title: 'Permission to view the list of permissions of a user.',
              key: 'users.permission.view',
            },
            {
              title: 'Permission to update permissions a user.',
              key: 'users.permission.update',
            },
            {
              title: 'Permission to delete a user.',
              key: 'users.delete',
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
                title: 'Permission to finalize and approve the created purchase request.',
                key: 'purchase.requests.approve',
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
                title: 'Permission to view the list of purchase request.',
                key: 'purchase.requests.attachments.view',
              },
              {
                title: 'Permission to add attachments to a purchase request.',
                key: 'purchase.requests.attachments.create',
              },
              {
                title: 'Permission to remove attachments to a purchase request.',
                key: 'purchase.requests.attachments.delete',
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
              {
                title: 'Permission to view the list of purchase request in the procurement module.',
                key: 'procurement.attachment.view',
              },
              {
                title: 'Permission to add attachments to a purchase request in the procurement module.',
                key: 'procurement.attachment.create',
              },
              {
                title: 'Permission to remove attachments to a purchase request in the procurement module.',
                key: 'procurement.attachment.delete',
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
              {
                title: 'Permission to update approved forms.',
                key: 'form.routing.approved.update',
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
                title: 'Permission to approve forwarded forms.',
                key: 'form.routing.pending.approve',
              },
              {
                title: 'Permission to disapprove the forwarded form.',
                key: 'form.routing.pending.disapprove',
              },
              {
                title: 'Permission to view the attachments of the forwarded form.',
                key: 'form.routing.pending.attachment.view',
              },
              {
                title: 'Permission to add attachments to the forwarded form.',
                key: 'form.routing.pending.attachment.create',
              },
              {
                title: 'Permission to remove attachments to the forwarded form.',
                key: 'form.routing.pending.attachment.delete',
              },
            ],
          },

          {
            title: 'Libraries Module',
            key: 'libraries.all',
            children: [
              {
                title: 'Permission to view the list of item categories.',
                key: 'libraries.items.categories.view',
              },
              {
                title: 'Permission to view the list of items.',
                key: 'libraries.items.view',
              },
              {
                title: 'Permission to view the list of office divisions.',
                key: 'libraries.office.divisions.view',
              },
              {
                title: 'Permission to view the list of office sections.',
                key: 'libraries.office.sections.view',
              },
              {
                title: 'Permission to view the list of administrators signatories',
                key: 'libraries.signatories.administrators.view',
              },
              {
                title: 'Permission to view the list of unit of measures.',
                key: 'libraries.uom.view',
              },
            ],
          },




      ];
      const [expandedKeys, setExpandedKeys] = useState();
      const [checkedKeys, setCheckedKeys] = useState();
      const [selectedKeys, setSelectedKeys] = useState([]);
      const [autoExpandParent, setAutoExpandParent] = useState(true);

      const savePermission = () => {
        let formData = {
          user_id: props.user.key,
          permissions: checkedKeys
        };
        api.User.updatePermission(formData);
      }

      useEffect(() => {
        setCheckedKeys(map(props.user.permissions.data, 'name'));
        setExpandedKeys([
          'activitylogs.all',
          'form.routing.approved.all',
          'form.routing.disapproved.all',
          'form.routing.pending.all',
          'libraries.all',
          'procurement.all',
          'purchase.requests.all',
          'users.all',
        ]);
      }, [props.user]);
    
      const onExpand = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
    
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
      };
    
      const onCheck = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
      };
    
      const onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
      };

    return (
        
        <div>
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
            />
            <Button type='primary' onClick={() => {
              savePermission()
            }}>Save</Button>
        </div>
    );
}

export default UserPermissions;
