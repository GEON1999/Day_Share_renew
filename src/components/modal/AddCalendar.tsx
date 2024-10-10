import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import commonMutation from "@/queries/commonMutation";

const AddCalendarModal = ({ setIsOpen }: any) => {
  const [formSelect, setFormSelect] = useState("create");
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

  const onSubmit = (data: any) => {
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
  };

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
      <div className="bor  relative flex flex-col w-[600px] h-[550px] bg-[#EFDACC] rounded-xl p-8">
        <div className="flex justify-between p-4 items-center">
          <nav className="flex">
            <div
              className={`cursor-pointer px-2 py-1 rounded-md ${
                formSelect === "create"
                  ? "bg-gray-400 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => formChancher("create")}
            >
              달력 생성
            </div>
            <div
              className={`ml-2 cursor-pointer px-2 py-1 rounded-md ${
                formSelect === "invite"
                  ? "bg-gray-400 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => formChancher("invite")}
            >
              달력 참가하기
            </div>
          </nav>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="bg-[#E0CBB7] bor rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {formSelect === "create" ? (
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
              className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4 "
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
              className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4"
            >
              참가하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCalendarModal;
