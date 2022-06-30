import React, { useCallback, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";

import { Modal } from "antd";

export function RouterPrompt(props) {
  const { when, onOK, onCancel, title, content, type, okText, cancelText } = props;

  const history = useHistory();

  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  const unblockRef = useRef();
  useEffect(() => {
    unblockRef.current = history.block((location) => {
        if (when) {
            setCurrentPath(location.pathname);
            setShowPrompt(true);
            return false;
        }
        return true;
    });
    return () => {
        unblockRef.current && unblockRef.current();
    };
}, [when]);

  const handleOK = useCallback(async () => {
    if (onOK) {
      const canRoute = await Promise.resolve(onOK());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
  }, [currentPath, history, onOK]);

  const handleCancel = useCallback(async () => {
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
    setShowPrompt(false);
  }, [currentPath, history, onCancel]);
  
  if(showPrompt){
    switch (type) {
      case "warning":
        Modal.warning({
          title: title,
          content: content,
        });
        return null;
        break;
      case 'confirm':
        return (
            <Modal
              title={title}
              visible={showPrompt}
              onOk={handleOK}
              okText={okText}
              onCancel={handleCancel}
              cancelText={cancelText}
              closable={true}
            >
                { props.content }
              {/* There are unsaved changes. Are you sure want to leave this page ? */}
            </Modal>
          );
        break;
      default:
        return null;
        break;
    }
  }
  return null;
}