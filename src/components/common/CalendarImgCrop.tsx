import { useMutation } from "@tanstack/react-query";
import commonMutation from "@/queries/commonMutation";
import StaticKeys from "@/keys/StaticKeys";
import { IconAddCalendar, IconCamera, IconCameraRounded, IconX } from "@/icons";
import ModalWrapper from "@/components/modal/ModalWrapper";
import React, { useState, useRef, ChangeEvent } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ModalContainer from "../modal/ModalContainer";
import ModalType from "@/keys/ModalType";

interface CalendarImgCropProps {
  calendarImg: string;
  setCalendarImg: (img: string) => void;
  type?: string;
}

function CalendarImgCrop({
  calendarImg,
  setCalendarImg,
  type = StaticKeys.EDIT_TYPE,
}: CalendarImgCropProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenImgSelectModal, setIsOpenImgSelectModal] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50 / StaticKeys.CALENDAR_ASPECT_RATIO, // 높이를 비율에 맞게 조정
    aspect: StaticKeys.CALENDAR_ASPECT_RATIO, // 195:130 비율 고정
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { mutate: imageMutate } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  const handleOpenImgSelectModal = () => setIsOpenImgSelectModal(true);

  const handleImageUpload = () => {
    document.getElementById("imageUpload")?.click();
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
      setIsOpen(true);
      e.target.value = "";
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    const size = Math.min(width, height) * 0.8;

    const initialCrop: PixelCrop = {
      unit: "px",
      width: size,
      height: size / StaticKeys.CALENDAR_ASPECT_RATIO, // ASPECT_RATIO에 맞게 높이 조정
      x: (width - size) / 2,
      y: (height - size / StaticKeys.CALENDAR_ASPECT_RATIO) / 2, // 높이도 ASPECT_RATIO 반영
    };

    setCrop({
      ...initialCrop,
      aspect: StaticKeys.CALENDAR_ASPECT_RATIO,
    });
    setCompletedCrop(initialCrop);
  };

  const onCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const handleCropUpload = () => {
    if (completedCrop && imageRef.current) {
      generateCroppedImage(imageRef.current, completedCrop);
      setIsOpen(false);
    }
  };

  const generateCroppedImage = (image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped_image.jpg", {
            type: "image/jpeg",
          });
          imageMutate(file, {
            onSuccess: (result: any) => {
              setCalendarImg(result.url);
            },
            onError: () => {
              alert("이미지 업로드에 실패했습니다.");
            },
          });
        }
      }, "image/jpeg");
    }
  };

  return (
    <div>
      <div
        onClick={handleOpenImgSelectModal}
        className={`rounded-md cur bg-[#D9D9D9] flex justify-center items-center ${
          type === StaticKeys.EDIT_TYPE
            ? "w-[195px] h-[130px]"
            : "w-[250px] h-[170px] lg:w-[299.42px] lg:h-[200px]"
        }`}
      >
        {calendarImg ? (
          <div className="relative">
            <img
              src={calendarImg}
              alt="profile"
              className={`rounded-md object-cover bor ${
                type === StaticKeys.EDIT_TYPE
                  ? "w-[195px] h-[130px]"
                  : "w-[250px] h-[170px] lg:w-[299.42px] lg:h-[200px]"
              }`}
            />
            <IconCameraRounded className="w-[30px] h-[30px] absolute bottom-[12px] right-[17px] transform translate-x-1/4 translate-y-1 /4" />
          </div>
        ) : (
          <div className="relative">
            <div
              className={`overflow-hidden rounded-md flex justify-center items-center bor ${
                type === StaticKeys.EDIT_TYPE
                  ? "w-[195px] h-[130px]"
                  : "w-[250px] h-[170px] lg:w-[299.42px] lg:h-[200px]"
              }`}
            >
              <IconAddCalendar
                className={`mt-[28px] ${
                  type === StaticKeys.EDIT_TYPE
                    ? "w-[100.95px] h-[128.88px]"
                    : "w-[141.64px] h-[181.18px] lg:w-[170px] lg:h-[189.46px]"
                }`}
              />
            </div>
            <IconCameraRounded className="w-[30px] h-[30px] absolute bottom-[12px] right-[17px] transform translate-x-1/4 translate-y-1 /4" />
          </div>
        )}
      </div>
      <input
        onChange={onSelectFile}
        type="file"
        accept="image/*"
        className="hidden"
        id="imageUpload"
      />
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="bg_depp p-[20px] rounded-md bor">
          <div
            className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <IconX className="w-full h-full" />
          </div>
          <h2 className="text-[20px] noto-sans-text font-bold  mb-[30px] ml-[5px] -mt-[5px]">
            이미지 자르기
          </h2>
          <div className="px-[5px]">
            <ReactCrop
              crop={crop}
              onChange={(c) =>
                setCrop({ ...c, aspect: StaticKeys.CALENDAR_ASPECT_RATIO })
              }
              onComplete={onCropComplete}
              ruleOfThirds={true}
            >
              <img
                onClick={handleImageUpload}
                className="object-contain bor bg-white crop-max-size"
                src={src ?? ""}
                onLoad={onImageLoad}
                alt="Source"
              />
            </ReactCrop>
          </div>
          <div className="confirm_btn_container mt-[30px]">
            <button className="cancel" onClick={() => setIsOpen(false)}>
              취소
            </button>
            <button className="confirm" onClick={handleCropUpload}>
              다음
            </button>
          </div>
        </div>
      </ModalWrapper>
      {isOpenImgSelectModal && (
        <ModalContainer
          setIsOpen={setIsOpenImgSelectModal}
          initialModal={ModalType.CALENDAR_IMAGE_SELECT}
          setImg={setCalendarImg}
        />
      )}
    </div>
  );
}

export default CalendarImgCrop;
