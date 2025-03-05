import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import StaticKeys from "@/keys/StaticKeys";
import { IconNextBig, IconX } from "@/icons";
import CalendarImgCrop from "@/components/common/CalendarImgCrop";
import { useAlert } from "@/components/alert/AlertContext";

const AddCalendarModal = ({ setIsOpen }: any) => {
  const { showAlert } = useAlert();
  const [formSelect, setFormSelect] = useState("empty");
  const [image, setImage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const { mutate: createCalendar } = useMutation({
    mutationFn: useCalendarMutations.createCalendar,
  });
  const { mutate: getInvtedCalendar } = useMutation({
    mutationFn: useCalendarMutations.joinCalendar,
  });

  const { register, handleSubmit } = useForm();
  const { register: inviteRegister, handleSubmit: inviteHandleSubmit } =
    useForm();

  const onSubmit = (data: any) => {
    if (isSubmit) return;
    if (data?.name === "") {
      showAlert("달력 이름을 입력해주세요.", "error");
      return;
    }
    if (data?.name.length > 8) {
      showAlert("달력 이름은 8자 이하로 입력해주세요.", "error");
      return;
    }
    setIsSubmit(true);
    const formData = { ...data, img: image };
    createCalendar(formData, {
      onSuccess: (result) => {
        showAlert("달력이 생성되었습니다.", "success");
        window.location.reload();
        setIsSubmit(false);
      },
      onError: () => {
        setIsSubmit(false);
      },
    });
  };

  const onInviteSubmit = (data: any) => {
    if (data?.code === "") {
      showAlert("초대코드를 입력해주세요.", "error");
      return;
    }
    getInvtedCalendar(data.code, {
      onSuccess: (result) => {
        console.log(result);
        showAlert("달력에 참가되었습니다.", "success");
        window.location.reload();
      },
      onError: (e: any) => {
        showAlert(
          e?.response?.data?.message ?? "초대코드를 확인해주세요.",
          "error"
        );
      },
    });
  };

  const formChancher = (form: any) => {
    setFormSelect(form);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center noto-sans-text">
      {formSelect === "empty" ? (
        <div className="bor w-[300px] lg:w-[520px] h-[210px] bg_depp rounded-md p-[20px] text-[20px]">
          <div
            className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <IconX className="w-full h-full" />
          </div>
          <h1 className="-mt-[17px] lg:-mt-[5px]  font-bold">달력 추가하기</h1>
          <div className="flex flex-col w-full space-y-[10px] mt-[27px]">
            <div
              className="flex items-center justify-between px-[14px] w-[260px] lg:w-[470px] h-[50px] bor rounded-md cur hover:bg-[#f7eeab] transition-colors duration-200 ease-in-out"
              onClick={() => formChancher("create")}
            >
              <p className="ml-1">달력 생성</p>
              <IconNextBig className="w-[5px] h-[10px]" />
            </div>
            <div
              className="flex items-center justify-between px-[14px] w-[260px] lg:w-[470px] h-[50px] bor rounded-md cur hover:bg-[#f7eeab] transition-colors duration-200 ease-in-out"
              onClick={() => formChancher("invite")}
            >
              <p className="ml-1">달력 참가</p>
              <IconNextBig className="w-[5px] h-[10px]" />
            </div>
          </div>
        </div>
      ) : formSelect === "create" ? (
        <div className="bor w-[300px] lg:w-[520px] h-[400px] lg:h-[450px] bg_depp rounded-md p-[20px] text-[20px]">
          <div
            className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <IconX className="w-full h-full" />
          </div>
          <div className="flex items-center -mt-[17px] lg:-mt-[5px] space-x-[10px]">
            <h1 className=" font-bold">달력 생성</h1>
            <span className="text-[15px] text-[#95927C] mb-[3px]">|</span>
            <p
              className="text-[15px] text-[#95927C] cur"
              onClick={() => setFormSelect("empty")}
            >
              이전으로 돌아가기
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center mt-[30px] lg:mt-10"
          >
            <CalendarImgCrop
              calendarImg={image}
              setCalendarImg={setImage}
              type={StaticKeys.ADD_TYPE}
            />
            <input
              className="w-[260px] lg:w-[300px] h-[50px] text-[20px] bor rounded-md p-3 outline-none my-[10px] text-center placeholder:text-[#C2BFBC]"
              type="text"
              placeholder="달력 이름"
            />
            <button
              type="submit"
              className="btn_hilight bor w-[260px] lg:w-[300px] h-[50px] rounded-md"
            >
              생성
            </button>
          </form>
        </div>
      ) : (
        <div className="bor w-[300px] lg:w-[520px] h-[220px] lg:h-[240px] bg_depp rounded-md p-[20px] text-[20px]">
          <div
            className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <IconX className="w-full h-full" />
          </div>
          <div className="flex items-center -mt-[17px] lg:-mt-[5px] space-x-[10px]">
            <h1 className=" font-bold">달력 참가</h1>
            <span className="text-[15px] text-[#95927C] mb-[3px]">|</span>
            <p
              className="text-[15px] text-[#95927C] cur"
              onClick={() => setFormSelect("empty")}
            >
              이전으로 돌아가기
            </p>
          </div>
          <form
            onSubmit={inviteHandleSubmit(onInviteSubmit)}
            className="flex flex-col items-center mt-[20px]"
          >
            <input
              className="w-[260px] lg:w-[300px] h-[50px] text-[20px] bor rounded-md p-3 outline-none text-black my-[10px] text-center placeholder:text-[#C2BFBC]"
              {...inviteRegister("code", { required: true })}
              type="text"
              placeholder="초대코드"
            />
            <button
              type="submit"
              className="btn_hilight bor w-[260px] lg:w-[300px] h-[50px] rounded-md"
            >
              참가
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddCalendarModal;
