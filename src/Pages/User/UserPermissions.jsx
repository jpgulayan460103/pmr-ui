import React, { useState } from 'react';
import { Tree } from 'antd';

const UserPermissions = () => {

    const treeData = [
        {
          title: 'Users',
          key: 'users-all',
          children: [
            {
              title: 'View',
              key: 'users-view',
            },
            {
              title: 'Add',
              key: 'users-add',
            },
            {
              title: 'Update',
              key: 'users-update',
            },
            {
                title: 'Delete',
                key: 'users-delete',
              },
          ],
        },
        {
            title: 'Purchase Requests',
            key: 'purchase-requests-all',
            children: [
              {
                title: 'Approve',
                key: 'purchase-requests-approve',
              },
              {
                title: 'View',
                key: 'purchase-requests-view',
              },
              {
                title: 'Add',
                key: 'purchase-requests-add',
              },
              {
                title: 'Update',
                key: 'purchase-requests-update',
              },
              {
                title: 'Delete',
                key: 'purchase-requests-delete',
              },
            ],
          },
      ];
      const [expandedKeys, setExpandedKeys] = useState();
      const [checkedKeys, setCheckedKeys] = useState();
      const [selectedKeys, setSelectedKeys] = useState([]);
      const [autoExpandParent, setAutoExpandParent] = useState(true);
    
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
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={treeData}
            />
        </div>
    );
}

export default UserPermissions;
