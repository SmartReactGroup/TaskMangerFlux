import { message } from 'antd'

const makeAlertMessage = (instance) => {
  // message.success(content, [duration], onClose)
  // message.error(content, [duration], onClose)
  // message.info(content, [duration], onClose)
  // message.warning(content, [duration], onClose)
  // message.warn(content, [duration], onClose) // alias of warning
  // message.loading(content, [duration], onClose)

  // content: content of the message string|ReactNode
  // duration:time(seconds) before auto-dismiss, don't dismiss if set to 0 number 1.5
  // onClose: Specify a function that will be called when the message is closed Function
  instance.config({
    top: 100,
    duration: 2,
    maxCount: 3,
  })

  return instance
}

export default makeAlertMessage(message)
