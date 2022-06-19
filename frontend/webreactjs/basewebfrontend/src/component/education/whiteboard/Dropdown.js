import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  dropdownWrapper: {
    position: 'relative',
    display: 'inline-block',
    background: '#ebebeb',
    cursor: 'pointer',
    padding: '6px 10px',
    margin: '0 10px',
  },
  title: {
    margin: 0,
  },
  dropdown: {
    position: 'absolute',
    background: '#ebebeb',
    padding: '6px 10px',
    top: 40,
    left: -16,
    zIndex: 10,
    display: 'flex',
    columnGap: 6,
  },
}))

export const Dropdown = React.memo(({ pendingList, onApproveRequest, onRejectRequest }) => {
  const classes = useStyles()
  const [isAppear, setIsAppear] = React.useState(false)

  return (
    <div className={classes.dropdownWrapper} onClick={() => setIsAppear(!isAppear)}>
      <p className={classes.title}>List pending request</p>
      {isAppear &&
        pendingList.map((item) => (
          <div className={classes.dropdown} key={item.userId}>
            <div>{item.userId}</div>
            <button type="button" style={{ cursor: 'pointer' }} onClick={() => onApproveRequest(item)}>
              Approve
            </button>
            <button type="button" style={{ cursor: 'pointer' }} onClick={() => onRejectRequest(item)}>
              Reject
            </button>
          </div>
        ))}
    </div>
  )
})
