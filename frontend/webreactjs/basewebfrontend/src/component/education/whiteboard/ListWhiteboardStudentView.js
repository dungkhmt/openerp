import { Button, Tooltip } from '@material-ui/core'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { Link, useRouteMatch, useParams, useHistory } from 'react-router-dom'
import { request } from '../../../api'

export default function ListWhiteBoardStudentView() {
  const { url } = useRouteMatch()
  const { sessionId } = useParams()
  const [listWhiteboard, setListWhiteboard] = useState([])
  const columns = [
    {
      title: 'WhiteboardId',
      field: 'id',
      render: (rowData) => <Link to={`${url}/whiteboard/${rowData['id']}?page=1`}>{rowData['id']}</Link>,
    },
    { title: 'Name', field: 'name', render: (rowData) => <p>{rowData['name'] || `Whiteboard ${rowData['id']}`}</p> },
    { title: 'Total page', field: 'page', render: (rowData) => <p>{rowData['totalPage']}</p> },
    { title: 'Created user', field: 'createdUser', render: (rowData) => <p>{rowData['createdBy']}</p> },
  ]

  useEffect(() => {
    void (async () => {
      await request(
        'get',
        `/whiteboards/${sessionId}`,
        (res) => {
          setListWhiteboard(res.data)
        },
        {},
        {},
      )
    })()
  }, [])

  return (
    <div>
      <MaterialTable
        title="Whiteboard List"
        columns={columns}
        data={listWhiteboard}
        localization={{
          header: {
            actions: '',
          },
          body: {
            emptyDataSourceMessage: 'Không có bản ghi nào để hiển thị',
            filterRow: {
              filterTooltip: 'Lọc',
            },
          },
        }}
        options={{
          search: true,
          sorting: false,
          actionsColumnIndex: -1,
          pageSize: 8,
          tableLayout: 'fixed',
        }}
        style={{
          fontSize: 14,
        }}
      />
    </div>
  )
}
