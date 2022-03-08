import React, { useState, useEffect } from 'react';
import { Tree, Button } from 'antd';
import { map } from 'lodash';
import api from '../../api';

const UserPermissions = (props) => {

    const treeData = [
        {
          title: 'Users',
          key: 'users.all',
          children: [
            {
              title: 'users.delete',
              key: 'users.delete',
            },
            {
              title: 'users.permission.update',
              key: 'users.permission.update',
            },
            {
              title: 'users.permission.view',
              key: 'users.permission.view',
            },
            {
              title: 'users.update',
              key: 'users.update',
            },
            {
              title: 'users.view',
              key: 'users.view',
            },
          ],
        },
        {
            title: 'Purchase Requests',
            key: 'purchase.requests.all',
            children: [
              {
                title: 'purchase.requests.approve',
                key: 'purchase.requests.approve',
              },
              {
                title: 'purchase.requests.attachments.create',
                key: 'purchase.requests.attachments.create',
              },
              {
                title: 'purchase.requests.attachments.delete',
                key: 'purchase.requests.attachments.delete',
              },
              {
                title: 'purchase.requests.attachments.view',
                key: 'purchase.requests.attachments.view',
              },
              {
                title: 'purchase.requests.create',
                key: 'purchase.requests.create',
              },
              {
                title: 'purchase.requests.delete',
                key: 'purchase.requests.delete',
              },
              {
                title: 'purchase.requests.update',
                key: 'purchase.requests.update',
              },
              {
                title: 'purchase.requests.view',
                key: 'purchase.requests.view',
              },
            ],
          },
          {
            title: 'Procurement',
            key: 'procurement.all',
            children: [
              {
                title: 'procurement.attachment.create',
                key: 'procurement.attachment.create',
              },
              {
                title: 'procurement.attachment.delete',
                key: 'procurement.attachment.delete',
              },
              {
                title: 'procurement.attachment.view',
                key: 'procurement.attachment.view',
              },
              {
                title: 'procurement.view',
                key: 'procurement.view',
              },
            ],
          },

          {
            title: 'Activity Logs',
            key: 'activitylogs.all',
            children: [
              {
                title: 'activitylogs.view',
                key: 'activitylogs.view',
              },
            ],
          },

          {
            title: 'Approved Forms',
            key: 'form.routing.approved.all',
            children: [
              {
                title: 'form.routing.approved.update',
                key: 'form.routing.approved.update',
              },
              {
                title: 'form.routing.approved.view',
                key: 'form.routing.approved.view',
              },
            ],
          },

          {
            title: 'Disapproved Forms',
            key: 'form.routing.disapproved.all',
            children: [
              {
                title: 'form.routing.disapproved.view',
                key: 'form.routing.disapproved.view',
              },
            ],
          },

          {
            title: 'Approved Forms',
            key: 'form.routing.pending.all',
            children: [
              {
                title: 'form.routing.pending.approve',
                key: 'form.routing.pending.approve',
              },
              {
                title: 'form.routing.pending.attachment.create',
                key: 'form.routing.pending.attachment.create',
              },
              {
                title: 'form.routing.pending.attachment.delete',
                key: 'form.routing.pending.attachment.delete',
              },
              {
                title: 'form.routing.pending.attachment.view',
                key: 'form.routing.pending.attachment.view',
              },
              {
                title: 'form.routing.pending.disapprove',
                key: 'form.routing.pending.disapprove',
              },
              {
                title: 'form.routing.pending.view',
                key: 'form.routing.pending.view',
              },
            ],
          },

          {
            title: 'Libraries',
            key: 'libraries.all',
            children: [
              {
                title: 'libraries.items.categories.view',
                key: 'libraries.items.categories.view',
              },
              {
                title: 'libraries.items.view',
                key: 'libraries.items.view',
              },
              {
                title: 'libraries.office.divisions.view',
                key: 'libraries.office.divisions.view',
              },
              {
                title: 'libraries.office.sections.view',
                key: 'libraries.office.sections.view',
              },
              {
                title: 'libraries.signatories.administrators.view',
                key: 'libraries.signatories.administrators.view',
              },
              {
                title: 'libraries.uom.view',
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
