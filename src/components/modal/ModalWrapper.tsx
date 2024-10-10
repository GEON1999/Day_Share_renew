import { useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";

const ModalWrapper = ({ children, isOpen, setIsOpen }: any) => {
  const router = useRouter();
  const pathname = usePathname();

  const openModal = () => setIsOpen(true);
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
