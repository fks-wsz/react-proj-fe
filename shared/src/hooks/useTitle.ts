import { useMount } from './useMount'

export const useTitle = (title: string) => {
  useMount(() => {
    document.title = title
  })
}
