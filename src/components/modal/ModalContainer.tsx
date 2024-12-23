import { useState } from "react";
import AddCalendarModal from "@/components/modal/AddCalendar";
import CalendarImgCrop from "@/components/common/CalendarImgCrop";
import ModalType from "@/keys/ModalType";
import LeaveCalendarModal from "@/components/modal/LeaveCalendar";
import SecessionModal from "@/components/modal/SecessionConfirmModal";
import ModalWrapper from "@/components/modal/ModalWrapper";

interface ModalContainerProps {
  setIsOpen: (isOpen: boolean) => void;
  initialModal?: string;
  img?: string;
  setImg?: (img: string) => void;
}

const ModalContainer = ({
  setIsOpen,
  initialModal = ModalType.ADD_CALENDAR,
  img,
  setImg,
}: ModalContainerProps) => {
  const [currentModal, setCurrentModal] = useState(initialModal);

  const renderModal = () => {
    switch (currentModal) {
      case ModalType.ADD_CALENDAR:
        return (
          <ModalWrapper isOpen={true} setIsOpen={setIsOpen}>
            <AddCalendarModal setIsOpen={setIsOpen} />
          </ModalWrapper>
        );
      case ModalType.LEAVE_CALENDAR:
        return (
          <ModalWrapper isOpen={true} setIsOpen={setIsOpen}>
            <LeaveCalendarModal />
          </ModalWrapper>
        );
      case ModalType.SECESSION:
        return (
          <ModalWrapper isOpen={true} setIsOpen={setIsOpen}>
            <SecessionModal />
          </ModalWrapper>
        );
      default:
        return null;
    }
  };

  return renderModal();
};

export default ModalContainer;
