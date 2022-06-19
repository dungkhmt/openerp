import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ROLE_STATUS } from 'utils/whiteboard/constants'

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

export const ListParticipantDropdown = React.memo(({ list, onRejectRequest }) => {
  const classes = useStyles()
  const [isAppear, setIsAppear] = React.useState(false)

  return (
    <div className={classes.dropdownWrapper} onClick={() => setIsAppear(!isAppear)}>
      <p className={classes.title}>List participant</p>
      {isAppear &&
        list.map((item) => (
          <div className={classes.dropdown} key={item.userId}>
            <div>{item.userId}</div>
            {item.roleId === ROLE_STATUS.WRITE && item.status === ROLE_STATUS.ACCEPTED && (
              <button type="button" style={{ cursor: 'pointer' }} onClick={() => onRejectRequest(item)}>
                Cancel draw
              </button>
            )}
          </div>
        ))}
    </div>
  )
})
