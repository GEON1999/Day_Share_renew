import { createPortal } from "react-dom";

const ModalWrapper = ({ children, isOpen, setIsOpen }: any) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleBackgroundClick = (e: any) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <>
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleBackgroundClick}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

export default ModalWrapper;
