import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import commonMutation from "@/queries/commonMutation";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";
import { IconNextBig, IconX } from "@/icons";

const AddCalendarModal = ({ setIsOpen }: any) => {
  const [formSelect, setFormSelect] = useState("empty");
  const [image, setImage] = useState("");
  const { mutate: createCalendar } = useMutation({
    mutationFn: useCalendarMutations.createCalendar,
  });
  const { mutate: getInvtedCalendar } = useMutation({
    mutationFn: useCalendarMutations.joinCalendar,
  });
  const { mutate: uploadImage } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  const { register, handleSubmit } = useForm();
  const { register: inviteRegister, handleSubmit: inviteHandleSubmit } =
    useForm();

  const onSubmit = debounce((data: any) => {
    const formData = { ...data, img: image };
    createCalendar(formData, {
      onSuccess: (result) => {
        console.log("result:", result);
        if (result) {
          alert("달력이 생성되었습니다.");
          window.location.reload();
        } else {
          alert(data?.data?.message ?? "달력 생성에 실패하였습니다.");
        }
      },
    });
  }, StaticKeys.DEBOUNCE_TIME);

  const onInviteSubmit = (data: any) => {
    getInvtedCalendar(data.code, {
      onSuccess: (result) => {
        console.log("result:", result);
        if (result) {
          alert("달력에 참가되었습니다.");
          window.location.reload();
        } else {
          alert(data?.data?.message ?? "달력 참가에 실패하였습니다.");
        }
      },
    });
  };

  const formChancher = (form: any) => {
    setFormSelect(form);
  };

  const handleImage = async (e: any) => {
    await uploadImage(e.target.files[0], {
      onSuccess: async (result) => {
        setImage(result.url);
      },
    });
  };

  const handleImageBtn = () => {
    document.getElementById("imageUpload")!.click();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      {formSelect === "empty" ? (
        <div className="bor w-[520px] h-[210px] bg_depp rounded-xl p-[20px] text-[20px]">
          <IconX
            className="w-[10px] h-[10px] ml-auto cur"
            onClick={() => setIsOpen(false)}
          />
          <h1 className="-mt-[5px] font-bold">달력 참여 방식</h1>
          <div className="flex flex-col w-full space-y-[10px] mt-[27px]">
            <div
              className="flex items-center justify-between px-[14px] w-[470px] h-[50px] bor rounded-md cur hover:bg-[#f7eeab] transition-all duration-300"
              onClick={() => formChancher("create")}
            >
              <p className="ml-1">달력 생성</p>
              <IconNextBig className="w-[5px] h-[10px]" />
            </div>
            <div
              className="flex items-center justify-between px-[14px] w-[470px] h-[50px] bor rounded-md cur hover:bg-[#f7eeab] transition-all duration-300"
              onClick={() => formChancher("invite")}
            >
              <p className="ml-1">달력 참가</p>
              <IconNextBig className="w-[5px] h-[10px]" />
            </div>
          </div>
        </div>
      ) : formSelect === "create" ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-10 space-y-5"
        >
          <div className="flex flex-col items-center">
            <input
              id="imageUpload"
              className="hidden"
              onInput={handleImage}
              accept=".jpg, .png, .bmp, .gif, .svg, .webp"
              type="file"
            />
            {image === "" ? (
              <div
                onClick={handleImageBtn}
                className="rounded-full bg-gray-200 w-40 h-40 mb-4 border-black border-2 bg-whiten"
              />
            ) : (
              <img
                src={image ?? ""}
                onClick={handleImageBtn}
                className="bg-white  w-40 h-40 rounded-full cur bor"
                alt="Calendar"
              />
            )}
            <label htmlFor="imageUpload" className="mt-4">
              달력 이미지
            </label>
          </div>
          <input
            className="w-80 h-12 bor rounded-md bg-gray-200 p-3 outline-none text-black"
            {...register("name", { required: true })}
            type="text"
            placeholder="달력 이름"
          />
          <button
            type="submit"
            className="bg_deeper bor text-black w-32 h-12 rounded-md mt-4 "
          >
            생성
          </button>
        </form>
      ) : (
        <form
          onSubmit={inviteHandleSubmit(onInviteSubmit)}
          className="flex flex-col items-center mt-28 space-y-5"
        >
          <input
            className="w-80 h-12 bor rounded-md bg-gray-200 p-3 outline-none text-black"
            {...inviteRegister("code", { required: true })}
            type="text"
            placeholder="초대코드"
          />
          <button
            type="submit"
            className="bg_deeper bor text-black w-32 h-12 rounded-md mt-4"
          >
            참가하기
          </button>
        </form>
      )}
    </div>
  );
};

export default AddCalendarModal;
