import { Button, ButtonProps } from "@nextui-org/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import React from "react";
import { ReactNode } from "react";

export interface ConfirmationDialogProps extends Omit<ModalProps, "children"> {
  header?: ReactNode;
  message?: ReactNode;

  onCancel?: () => Promise<void>;
  onConfirm: () => Promise<void>;

  cancelProps?: ButtonProps;
  confirmProps?: ButtonProps;
}

/**
 * A confirmation dialog component that displays a modal with a header, message, and two buttons for confirming or canceling an action.
 *
 * @param {string} header - The header text to display in the modal.
 * @param {string} message - The message text to display in the modal body. Defaults to "Are you sure?" if not provided.
 * @param {() => Promise<void>} onConfirm - The function to call when the confirm button is pressed. This function can be asynchronous.
 * @param {() => Promise<void>} onCancel - The function to call when the cancel button is pressed. This function can be asynchronous.
 * @param {object} cancelProps - Additional props to pass to the cancel button.
 * @param {object} confirmProps - Additional props to pass to the confirm button.
 * @param {object} props - Additional props to pass to the modal component.
 *
 * @returns {JSX.Element} The rendered confirmation dialog component.
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  header,
  message,
  onConfirm,
  onCancel,
  cancelProps,
  confirmProps,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            {header && <ModalHeader>{header}</ModalHeader>}
            <ModalBody>{message || "Are you sure?"}</ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                {...cancelProps}
                onPress={async () => {
                  await onCancel?.();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                {...confirmProps}
                onPress={async () => {
                  setLoading(true);
                  try {
                    await onConfirm();
                  } finally {
                    setLoading(false);
                    onClose();
                  }
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
