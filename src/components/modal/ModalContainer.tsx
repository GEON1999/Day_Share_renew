import { useState } from "react";
import AddCalendarModal from "@/components/modal/AddCalendar";
import ModalType from "@/keys/ModalType";
import ModalWrapper from "@/components/modal/ModalWrapper";
import CalendarImageSelect from "@/components/modal/CalendarImageSelect";
import CreateContentHome from "@/components/modal/CreateContentHome";

interface ModalContainerProps {
  setIsOpen: (isOpen: boolean) => void;
  initialModal?: string;
  img?: string;
  setImg?: (img: string) => void;
  contentType?: string;
}

const ModalContainer = ({
  setIsOpen,
  initialModal = ModalType.ADD_CALENDAR,
  img,
  setImg,
  contentType,
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
      case ModalType.CALENDAR_IMAGE_SELECT:
        return (
          <ModalWrapper isOpen={true} setIsOpen={setIsOpen}>
            {setImg && (
              <CalendarImageSelect setIsOpen={setIsOpen} setImg={setImg} />
            )}
          </ModalWrapper>
        );
      case ModalType.CREATE_CONTENT_HOME:
        return (
          <ModalWrapper isOpen={true} setIsOpen={setIsOpen}>
            <CreateContentHome
              setIsOpen={setIsOpen}
              contentType={contentType ?? ""}
            />
          </ModalWrapper>
        );
      default:
        return null;
    }
  };

  return renderModal();
};

export default ModalContainer;
