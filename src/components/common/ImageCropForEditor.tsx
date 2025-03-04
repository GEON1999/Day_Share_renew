import { useMutation } from "@tanstack/react-query";
import commonMutation from "@/queries/commonMutation";
import StaticKeys from "@/keys/StaticKeys";
import { IconAddPhoto, IconX } from "@/icons";
import ModalWrapper from "@/components/modal/ModalWrapper";
import React, { useState, useRef, ChangeEvent } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImageCropForEditor({ editor }: any) {
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
              if (result.url) {
                const img = result.url;

                editor
                  ?.chain()
                  .focus()
                  .setTextSelection(editor.state.doc.content.size)
                  .insertContent("<p></p>")
                  .setImage({ src: img })
                  .run();
              }
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
      <div onClick={handleImageUpload} className="cursor-pointer">
        <IconAddPhoto className="w-6 h-6" />
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
              onChange={(c) => setCrop({ ...c, aspect: 1 })}
              onComplete={onCropComplete}
              ruleOfThirds={true}
            >
              <img
                onClick={handleImageUpload}
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
          </div>
          <div className="confirm_btn_container mt-[30px]">
            <button className="cancel" onClick={() => setIsOpen(false)}>
              취소
            </button>
            <button className="confirm" onClick={handleCropUpload}>
              확인
            </button>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
}

export default ImageCropForEditor;
