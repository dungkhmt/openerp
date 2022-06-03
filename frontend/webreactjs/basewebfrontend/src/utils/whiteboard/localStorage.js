export const updateLocalStorageData = (dataFromLS, newData, key) => {
  const dataIndex = dataFromLS.findIndex(data => Number(data.currentPage) === Number(key))
  if (dataIndex > -1) {
    dataFromLS[dataIndex] = { data: newData, currentPage: key }
  } else {
    dataFromLS.push({ data: newData, currentPage: key })
  }

  return dataFromLS 
}

export const mergeDrawData = (oldData, newData) => {
  const totalData = [...oldData, ...newData]
  const result = []
  for (let i = 0; i < totalData.length; ++i) {
    if (result.length === 0) {
      result.push(totalData[i])
      continue
    }
    const index = result.findIndex((item) => Number(item.currentPage) === Number(totalData[i].currentPage))
    if (index === -1) {
      result.push(totalData[i])
    } else {
      const totalDrawData = [...result[index].data, ...totalData[i].data]
      const resultData = []
      for (let j = 0; j < totalDrawData.length; ++j) {
        if (resultData.length === 0) {
          resultData.push(totalDrawData[j])
          continue
        }
        const index = resultData.findIndex((item) => Number(item.key) === Number(totalDrawData[j].key))
        if (index === -1) {
          resultData.push(totalDrawData[j])
        }
      }

      result[index] = { ...result[index], data: resultData }
    }
  }

  return result
}