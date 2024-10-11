import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import commonMutation from "@/queries/commonMutation";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useSearch from "@/hooks/useSearch";

const SettingModal = ({ setIsOpen }: any) => {
  const [formSelect, setFormSelect] = useState("profile");
  const [image, setImage] = useState("");
  const [myImage, setMyImage] = useState("");

  const id = useSearch.useSearchId();
  const { data: calendarUserData, isLoading: calendarUserIsLoading } =
    useCalendarQueries.useGetCalendarUserInfo(id);
  const { data: calendarData, isLoading: calendarIsLoading } =
    useCalendarQueries.useGetCalendarBasic(id);
  const { data: inviteCode, isLoading: inviteCodeLoading } =
    useCalendarQueries.useGetInviteCode(id);

  const { mutate: updateCalendar } = useMutation({
    mutationFn: useCalendarMutations.updateCalendar,
  });
  const { mutate: updateCalendarUserInfo } = useMutation({
    mutationFn: useCalendarMutations.updateCalendarUserInfo,
  });
  const { mutate: createInviteCode } = useMutation({
    mutationFn: useCalendarMutations.createInviteCode,
  });
  const { mutate: uploadImage } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  const { register, handleSubmit } = useForm();
  const {
    register: myProfileRegister,
    handleSubmit: myProfileSubmit,
    reset: resetProfile,
  } = useForm();

  useEffect(() => {
    if (calendarData?.img) {
      setImage(calendarData?.img);
    }
    if (calendarUserData?.img) {
      setMyImage(calendarUserData?.img);
    }

    resetProfile({
      name: calendarUserData?.name,
    });
  }, [
    calendarData,
    calendarUserData,
    calendarUserIsLoading,
    calendarIsLoading,
  ]);

  const onSubmit = (data: any) => {
    const formData = { ...data, img: image };
    updateCalendar(
      { calendarId: id, body: formData },
      {
        onSuccess: (result) => {
          if (result) {
            alert("달력이 수정 되었습니다.");
            window.location.reload();
          } else {
            alert(data?.data?.message ?? "달력 수정에 실패하였습니다.");
          }
        },
      }
    );
  };

  const onMyProfileSubmit = (data: any) => {
    const formData = { ...data, img: myImage };
    updateCalendarUserInfo(
      { calendarId: id, body: formData },
      {
        onSuccess: (result) => {
          if (result) {
            alert("프로필이 수정 되었습니다.");
            window.location.reload();
          } else {
            alert(data?.data?.message ?? "프로필 수정에 실패하였습니다.");
          }
        },
      }
    );
  };

  const formChancher = (form: any) => {
    setFormSelect(form);
  };

  const handleImage = (e: any) => {
    uploadImage(e.target.files[0], {
      onSuccess: async (result) => {
        setImage(result.url);
      },
    });
  };

  const handleImageBtn = () => {
    document.getElementById("imageUpload")!.click();
  };

  const handleMyProfileImage = (e: any) => {
    uploadImage(e.target.files[0], {
      onSuccess: async (result) => {
        setMyImage(result.url);
      },
    });
  };

  const handleMyProfileImageBtn = () => {
    document.getElementById("myProfileImageUpload")!.click();
  };

  const copyToClipboard = (e: any) => {
    const textToCopy = e.target.value;

    if (window.location.protocol === "https:" && navigator.clipboard) {
      // https 에서만 가능
      navigator.clipboard.writeText(textToCopy);
    } else {
      // 구형 브라우저 대응
      const textField = document.createElement("textarea");
      textField.innerText = textToCopy;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
    }

    alert("초대코드가 복사되었습니다.");
  };

  const handleInviteCode = () => {
    createInviteCode(id, {
      onSuccess: (result) => {
        if (result) {
          document.getElementById("inviteCode")!.value = result.code;
          alert("초대코드가 생성 되었습니다.");
        } else {
          alert("초대코드 생성에 실패하였습니다.");
        }
      },
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bor  relative flex flex-col w-[600px] h-[550px] bg-[#EFDACC] rounded-xl p-8">
        <div className="flex justify-between p-4 items-center">
          <nav className="flex">
            <div
              className={`cursor-pointer px-2 py-1 rounded-md ${
                formSelect === "profile"
                  ? "bg-gray-400 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => formChancher("profile")}
            >
              달력 프로필
            </div>
            <div
              className={`ml-2 cursor-pointer px-2 py-1 rounded-md ${
                formSelect === "invite"
                  ? "bg-gray-400 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => formChancher("invite")}
            >
              초대 코드
            </div>
            <div
              className={`ml-2 cursor-pointer px-2 py-1 rounded-md ${
                formSelect === "my_profile"
                  ? "bg-gray-400 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => formChancher("my_profile")}
            >
              내 프로필
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
        {calendarIsLoading ? (
          <div className="loading modal"></div>
        ) : (
          <>
            {formSelect === "profile" ? (
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
                  defaultValue={calendarData?.name}
                />
                <button
                  type="submit"
                  className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4 "
                >
                  저장
                </button>
              </form>
            ) : formSelect === "invite" ? (
              <div className="flex flex-col items-center mt-28 space-y-5">
                <input
                  id={"inviteCode"}
                  readOnly
                  onClick={copyToClipboard}
                  className="w-80 h-12 bor rounded-md bg-gray-200 p-3 outline-none text-black disabled:opacity-50 cur"
                  type="text"
                  placeholder="초대코드"
                  defaultValue={inviteCode?.code}
                />
                <button
                  onClick={handleInviteCode}
                  className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4"
                >
                  초대코드 생성
                </button>
              </div>
            ) : (
              <form
                onSubmit={myProfileSubmit(onMyProfileSubmit)}
                className="flex flex-col items-center mt-10 space-y-5"
              >
                <div className="flex flex-col items-center">
                  <input
                    id="myProfileImageUpload"
                    className="hidden"
                    onInput={handleMyProfileImage}
                    accept=".jpg, .png, .bmp, .gif, .svg, .webp"
                    type="file"
                  />
                  {myImage === "" ? (
                    <div
                      onClick={handleMyProfileImageBtn}
                      className="rounded-full bg-gray-200 w-40 h-40 mb-4 border-black border-2 bg-whiten"
                    />
                  ) : (
                    <img
                      src={myImage ?? ""}
                      onClick={handleMyProfileImageBtn}
                      className="bg-white  w-40 h-40 rounded-full cur bor"
                      alt="Calendar"
                    />
                  )}
                  <label htmlFor="imageUpload" className="mt-4">
                    프로필 이미지
                  </label>
                </div>
                <input
                  className="w-80 h-12 bor rounded-md bg-gray-200 p-3 outline-none text-black"
                  {...myProfileRegister("name", { required: true })}
                  type="text"
                  placeholder="프로필 이름"
                  defaultValue={calendarUserData?.name}
                />
                <button
                  type="submit"
                  className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4 "
                >
                  저장
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SettingModal;
