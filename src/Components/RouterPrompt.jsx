import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";

import { Modal } from "antd";

export function RouterPrompt(props) {
  const { when, onOK, onCancel, title, okText, cancelText } = props;

  const history = useHistory();

  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (when) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname);

        if(props.hasConfirm){
            setShowPrompt(true);
        }else{
            Modal.warning({
                title: props.title,
                content: props.content,
            });
        }
        return "true";
      });
    } else {
      history.block(() => {});
    }

    return () => {
      history.block(() => {});
    };
  }, [history, when]);

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

  return showPrompt ? (
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
  ) : null;
}