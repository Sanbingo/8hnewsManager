
export const getTranslateType = (translateType) => {
    let loadingType = '';
    if (translateType === 'jinshan') {
      loadingType = 'translate'
    } else if (translateType === 'youdaopay') {
      loadingType = 'translateByYoudao'
    } else if (translateType === 'so') {
      loadingType = 'translateBySo'
    }
    return loadingType
}
