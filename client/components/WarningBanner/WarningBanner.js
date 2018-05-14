import React from 'react'
import { Alert } from 'antd'
import PropTypes from 'prop-types'

export default function WarningBanner(props) {
  const { msg, onClose, type } = props
  return (
    <div className="messageAlert">
      <Alert message={msg} type={type} closable onClose={onClose} />
    </div>
  )
}

WarningBanner.propTypes = {
  // showMsg: PropTypes.bool,
  // user: PropTypes.object,
  msg: PropTypes.string,
  onClose: PropTypes.func,
  type: PropTypes.string
  // onClose: PropTypes.func
}
