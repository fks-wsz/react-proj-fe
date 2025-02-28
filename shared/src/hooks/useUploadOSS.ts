import { useQuery } from "@apollo/client";
import { GET_UPLOAD_OSS_SIGNATURE } from "@/graphql/upload";

export const useUploadOSS = () => {
  const { loading, data } = useQuery(GET_UPLOAD_OSS_SIGNATURE);

  const handleUploadOSS = async (file: File) => {
    const ossSignature = data.ossSignature;
    const filename = file.name;
    const key = ossSignature.dir + filename;
    const formData = new FormData();
    formData.append("name", filename);
    formData.append("policy", ossSignature.policy);
    formData.append("OSSAccessKeyId", ossSignature.ossAccessKeyId);
    formData.append("success_action_status", "200");
    formData.append("signature", ossSignature.signature);
    formData.append("key", key);
    // file必须为最后一个表单域，除file以外的其他表单域无顺序要求。
    formData.append("file", file);
    return fetch(ossSignature.host, {
      method: "POST",
      body: formData,
    }).then((res) => {
      console.log(res);
      alert("文件已上传");
      console.log(res.url + key);
      return {
        url: res.url + key,
      };
    });
  };

  return {
    loading,
    data,
    handleUploadOSS,
  };
};
