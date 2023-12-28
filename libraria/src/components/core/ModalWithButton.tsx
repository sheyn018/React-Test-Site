import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";

function ModalWithButton({
  onDelete,
  header,
  cta,
  modalCta,
  children,
  modalButtonStyle,
  buttonStyle,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = React.useState(false);
  const toast = useToast();

  return (
    <>
      <Button onClick={onOpen} {...buttonStyle}>
        {cta}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} variant="internal">
        <ModalOverlay />
        <ModalContent fontFamily={"Calibre"} zIndex={2147483647}>
          <ModalHeader fontSize="lg">{header}</ModalHeader>
          <ModalCloseButton size="sm" />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              isLoading={isLoading}
              onClick={async () => {
                setLoading(true);
                try {
                  const x = await onDelete();
                  toast({
                    title: "Success",
                    status: "success",
                    duration: 9000,
                  });
                } catch (e) {
                  toast({
                    title: "Error",
                    description: (e as any)?.response?.data?.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                } finally {
                  setLoading(false);
                }
                setLoading(false);
                onClose();
              }}
              {...modalButtonStyle}
            >
              {modalCta}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalWithButton;
