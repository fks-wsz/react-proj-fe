import React, { useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ImageUploader, Form, Input, Button } from 'antd-mobile'

import { useUploadOSS } from '@fe/shared'
import { useMount } from '@fe/shared'

import { FIND_USER, UPDATE_USER } from './graphql/user'

import './App.css'

function App() {
  useMount(() => {
    document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')
  })
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  const { loading, data } = useQuery(FIND_USER, {
    variables: { id: '7877f6ff-3765-496f-adda-17e677e16f57' },
  })

  const [mutateFn] = useMutation(UPDATE_USER)

  const handleNameInputChange = useCallback(
    (value: string) => {
      setName(value)
    },
    [setName],
  )

  const handleDescInputChange = useCallback(
    (value: string) => {
      setDesc(value)
    },
    [setDesc],
  )

  const handleUpdateBtnClick = useCallback(() => {
    mutateFn({
      variables: {
        id: '7877f6ff-3765-496f-adda-17e677e16f57',
        params: {
          name,
          desc,
        },
      },
    })
  }, [mutateFn])

  const { handleUploadOSS } = useUploadOSS()

  return (
    <>
      <div>data: {JSON.stringify(data)}</div>
      <div>{`${loading}`}</div>

      <div>
        <Form
          layout="horizontal"
          footer={
            <Button block type="submit" color="primary" size="large" onClick={handleUpdateBtnClick}>
              提交
            </Button>
          }
        >
          <Form.Item name="name" label="姓名">
            <Input value={name} onChange={handleNameInputChange}></Input>
          </Form.Item>
          <Form.Item name="desc" label="描述">
            <Input value={desc} onChange={handleDescInputChange}></Input>
          </Form.Item>
          <Form.Item name="avatar" label="头像">
            <ImageUploader upload={handleUploadOSS}></ImageUploader>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default App
