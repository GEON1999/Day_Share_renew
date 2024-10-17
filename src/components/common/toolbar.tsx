import commonMutation from "@/queries/commonMutation";
import { useMutation } from "@tanstack/react-query";

const Toolbar = ({ editor }: any) => {
  const { mutate: uploadImage } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  const addImage = async () => {
    const input = document.getElementById("imageUpload");

    input?.click();

    try {
      const url = await new Promise((resolve, reject) => {
        const handler = async (event: any) => {
          const file = event.target.files[0];
          if (file) {
            uploadImage(file, {
              onSuccess: (result) => {
                resolve(result.url);
              },
              onError: (error) => {
                reject(error);
              },
            });
          } else {
            reject(new Error("파일이 선택되지 않았습니다."));
          }

          input?.removeEventListener("change", handler);
        };

        input?.addEventListener("change", handler);
      });

      if (url) {
        editor?.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={() => {
          editor?.chain().focus().toggleBold().run();
        }}
      >
        <img
          className="w-6 h-6"
          src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241018021810_641ba864004b4f5f88d451edef7506dc.png"
        />
      </button>
      <button
        type="button"
        onClick={() => {
          editor?.chain().focus().undo().run();
        }}
      >
        <img
          className="w-6 h-6"
          src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241018021855_6898cca959b8456684aebd46d5b8efd5.png"
        />
      </button>
      <button
        type="button"
        onClick={() => {
          editor?.chain().focus().redo().run();
        }}
      >
        <img
          className="w-6 h-6"
          src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241018021932_ad337c3d1cba4088adeea831b417ffc9.png"
        />
      </button>
      <input
        id="imageUpload"
        className="hidden"
        accept=".jpg, .png, .bmp, .gif, .svg, .webp"
        type="file"
      />
      <button type="button" onClick={addImage}>
        <img
          className="w-6 h-6"
          src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241018021654_ecb0a0f3df30450d9e44b54e266eb87d.png"
        />
      </button>
    </div>
  );
};

export default Toolbar;
