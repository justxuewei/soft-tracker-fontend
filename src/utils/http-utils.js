export default {

  /**
   * 根据axios返回的response解析出真正的data
   * @param response
   * @returns {*}
   */
  getResponseData(response) {
    let data
    // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
    if (response.data === undefined) {
      data = JSON.parse(response.request.responseText)
    } else {
      data = response.data
    }
    return data
  }

}
