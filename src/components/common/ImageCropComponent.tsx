import { useMutation } from "@tanstack/react-query";
import commonMutation from "@/queries/commonMutation";
import StaticKeys from "@/keys/StaticKeys";
import { IconCamera } from "@/icons";
import ModalWrapper from "@/components/modal/ModalWrapper";
import React, { useState, useRef, ChangeEvent } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImageCropComponent({ userImg, setUserImg }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { mutate: imageMutate } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  const handleImageUpload = () => {
    document.getElementById("imageUpload")?.click();
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
      setIsOpen(true);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    const size = Math.min(width, height) * 0.8;

    const initialCrop: PixelCrop = {
      unit: "px",
      width: size,
      height: size,
      x: (width - size) / 2,
      y: (height - size) / 2,
    };

    setCrop({
      ...initialCrop,
      aspect: 1,
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
              setUserImg(result.url);
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
        onClick={handleImageUpload}
        className={`rounded-full bg-gray-200 w-60 h-60 mb-4 mt-10 bor cur bg-whiten flex justify-center items-center`}
      >
        {userImg ? (
          <img
            src={userImg}
            alt="profile"
            className="rounded-full w-full h-full object-cover"
          />
        ) : (
          <IconCamera className="w-45 h-45 mb-5" />
        )}
      </div>
      <input
        onChange={onSelectFile}
        type="file"
        className="hidden"
        id="imageUpload"
      />
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex flex-col items-center bg-[#FFFCF0] py-15 px-40 rounded-md bor">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop({ ...c, aspect: 1 })}
            onComplete={onCropComplete}
            ruleOfThirds={true}
            circularCrop={true}
          >
            <img
              src={src ?? ""}
              onLoad={onImageLoad}
              alt="Source"
              style={{
                maxWidth: `${StaticKeys.MAX_WIDTH}px`,
                maxHeight: `${StaticKeys.MAX_HEIGHT}px`,
                width: "auto",
                height: "auto",
              }}
            />
          </ReactCrop>
          <button
            className="bg-[#F6BEBE] w-20 h-12 bor rounded-md text-white mt-15"
            onClick={handleCropUpload}
          >
            다음
          </button>
        </div>
      </ModalWrapper>
    </div>
  );
}

export default ImageCropComponent;
