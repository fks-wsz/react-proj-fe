import { UploadOutlined } from '@ant-design/icons'
import { useQuery } from '@apollo/client'
import { GET_UPLOAD_OSS_SIGNATURE } from '@fe/shared'
import type { UploadFile, UploadProps } from 'antd'
import { Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useMemo } from 'react'

interface OSSDataType {
  dir: string
  expire: string
  host: string
  ossAccessKeyId: string
  policy: string
  signature: string
}

interface OSSUploadProps {
  value?: UploadFile[]
  maxCount?: number
  aspect?: number
  label?: string
  onChange?: (fileList: UploadFile[]) => void
}

const OSSUpload = ({
  value = [],
  label = '上传图片',
  maxCount = 1,
  aspect = 9 / 16,
  onChange = () => {},
}: OSSUploadProps) => {
  const { data: OSSSignatureData, refetch } = useQuery(GET_UPLOAD_OSS_SIGNATURE)
  // const uploadKeyRecord = useRef<Map<string, string>>(new Map())

  const OSSData = useMemo<OSSDataType>(() => {
    return OSSSignatureData?.ossSignature?.data
  }, [OSSSignatureData])

  const getFileKey = (file: UploadFile) => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'))
    const key = OSSData?.dir + file.uid + suffix
    const url = OSSData?.host + '/' + key

    return { key, url }
  }

  // 每次文件上传状态改变时，更新文件列表
  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    fileList.forEach((f) => {
      if (f.status === 'done') {
        f.url = f.url || getFileKey(f).url
      }
    })
    onChange?.([...fileList])
  }

  const onRemove = (file: UploadFile) => {
    const files = (value || []).filter((v) => v.url !== file.url)
    onChange?.(files)
  }

  const getExtraData: UploadProps['data'] = (file) => {
    return {
      key: getFileKey(file).key,
      OSSAccessKeyId: OSSData?.ossAccessKeyId,
      policy: OSSData?.policy,
      Signature: OSSData?.signature,
    }
  }

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) {
      return false
    }
    const expire = Number(OSSData.expire) * 1000

    if (expire < Date.now()) {
      await refetch()
    }

    return file
  }

  return (
    <ImgCrop rotationSlider aspect={aspect}>
      <Upload
        name="file"
        listType="picture-card"
        fileList={value}
        action={OSSData?.host}
        maxCount={maxCount}
        onChange={handleChange}
        onRemove={onRemove}
        data={getExtraData}
        beforeUpload={beforeUpload}
      >
        {(value?.length ?? 0) < maxCount && (
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>{label}</div>
          </div>
        )}
      </Upload>
    </ImgCrop>
  )
}

export default OSSUpload
