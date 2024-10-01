import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Upload Image
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.UPLOAD_IMAGE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export default {
  uploadImage,
};
