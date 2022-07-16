import { Button } from '@material-ui/core'
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
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    display: 'flex',
    background: '#ebebeb',
    padding: '10px 16px',
    top: 40,
    left: -28,
    zIndex: 10,
    columnGap: 12,
    rowGap: 4,
    alignItems: 'center',
  },
  userId: {
    fontSize: 16,
  },
}))

export const Dropdown = React.memo(({ pendingList, onApproveRequest, onRejectRequest }) => {
  const classes = useStyles()
  const [isAppear, setIsAppear] = React.useState(false)

  return (
    <div className={classes.dropdownWrapper} onClick={() => setIsAppear(!isAppear)}>
      <p className={classes.title}>Danh sách yêu cầu</p>
      {isAppear &&
        pendingList.map((item) => (
          <div className={classes.dropdown} key={item.userId}>
            <div className={classes.userId}>{item.userId}</div>
            <Button
              variant="contained"
              color="primary"
              style={{ cursor: 'pointer', fontSize: '14px' }}
              onClick={() => onApproveRequest(item)}
            >
              Chấp nhận
            </Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ cursor: 'pointer', fontSize: '14px' }}
              onClick={() => onRejectRequest(item)}
            >
              Từ chối
            </Button>
          </div>
        ))}
    </div>
  )
})
