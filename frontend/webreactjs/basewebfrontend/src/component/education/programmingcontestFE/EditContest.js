import React, {useEffect, useState} from "react";
// import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import {request} from "./Request";
import {API_URL} from "../../../config/config";
import Pagination from "@material-ui/lab/Pagination";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import {Button, Card, CardActions, TextField} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import {makeStyles} from "@material-ui/core/styles";
import {TableFooter} from "@mui/material";
import lib, {sleep} from "./lib";
import {SubmitSuccess} from "./SubmitSuccess";
import {useHistory, useParams} from "react-router-dom";
import {getColorLevel} from "./lib";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "30%",
      minWidth: 120,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'problemName',
    numeric: false,
    disablePadding: true,
    label: 'Title',
  },
  {
    id: 'levelOrder',
    numeric: true,
    disablePadding: false,
    label: 'Difficulty',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Choose Problem
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
export default function EditContest(props){
  const {contestId} = useParams();
  const history = useHistory();
  const [contestName, setContestName] = useState("");
  const [contestTime, setContestTime] = useState(Number(0));
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [contestProblems, setContestProblems] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [problemSelected, setProblemSelected] =useState([]);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const isSelected = (name) => problemSelected.indexOf(name) !== -1;

  const classes = useStyles();
  const handleClick = (event, name) => {
    const selectedIndex = problemSelected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(problemSelected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(problemSelected.slice(1));
    } else if (selectedIndex === problemSelected.length - 1) {
      newSelected = newSelected.concat(problemSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        problemSelected.slice(0, selectedIndex),
        problemSelected.slice(selectedIndex + 1),
      );
    }
    console.log("newSelected ", newSelected);
    setProblemSelected(newSelected);
  };
  const handlePageChange = (event, value) => {
    setPage(value);
    // getProblemContestList();
  };
  function handleSubmit(){
    let body = {
      contestName: contestName,
      contestSolvingTime: contestTime,
      problemIds: problemSelected,
    }
    request(
      "post",
      API_URL+"/edit-contest/"+contestId,
      (res)=>{
        // console.log("problem list", res.data);
        setShowSubmitSuccess(true);
        sleep(1000).then(r => {
          history.push("/programming-contest/list-contest");
        });

      },
      {}
      ,
      body
    ).then();
  }

  useEffect(() =>{
    request(
      "get",
      API_URL+"/get-contest-problem-paging?size="+pageSize+"&page="+(page-1),
      (res)=>{
        // console.log("problem list", res.data);
        setTotalPages(res.data.totalPages);
        setContestProblems(res.data.content);
      }
    ).then();

    request(
      "get",
      "/get-contest-detail/"+contestId,
      (res) =>{
        setContestTime(res.data.contestTime);
        let arr = [];
        res.data.list.map((p) => {
          arr.push(p.problemId);
        });
        console.log("arr ", arr);
        setProblemSelected(arr);
        setContestName(res.data.contestName);
        console.log("res ", res.data);
      }
    ).then();
  }, [page])


  return(
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Edit Contest {contestId}
            </Typography>
            <br/>
            <form className={classes.root} noValidate autoComplete="off">


              <TextField
                autoFocus
                required
                value={contestName}
                id="contestName"
                label="Contest Name"
                placeholder="Contest Name"
                onChange={(event) => {
                  setContestName(event.target.value);
                }}
              >
              </TextField>

              <TextField
                autoFocus
                value={contestTime}
                required
                id="timeLimit"
                label="Time Limit"
                placeholder="Time Limit"
                onChange={(event) => {
                  setContestTime(Number(event.target.value));
                }}
              >
              </TextField>

            </form>


            <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={problemSelected.length} />
                <TableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'medium'}
                  >
                    <EnhancedTableHead
                      numSelected={problemSelected.length}
                      // order={order}
                      // orderBy={orderBy}
                      // onSelectAllClick={handleSelectAllClick}
                      // onRequestSort={handleRequestSort}
                      // rowCount={rows.length}
                    />
                    <TableBody>
                      {contestProblems.map((p, index) =>{
                        const isItemSelected = isSelected(p.problemId);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return(
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, p.problemId)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={p.problemId}
                            selected={isItemSelected}
                          >

                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {p.problemName}
                            </TableCell>
                            <TableCell align="right"><span style={{color:getColorLevel(`${p.levelId}`)}}>{`${p.levelId}`}</span></TableCell>
                          </TableRow>
                        );
                      })}

                    </TableBody>
                    {/*<TableFooter>*/}
                    {/*<TableRow>*/}


                    {/*</TableRow>*/}
                    {/*</TableFooter>*/}
                  </Table>
                  <TableRow>
                    <TableCell align={"right"}>
                      <Pagination
                        className="my-3"
                        count={totalPages}
                        page={page}
                        siblingCount={1}
                        boundaryCount={1}
                        variant="outlined"
                        shape="rounded"
                        onChange={handlePageChange}
                      />
                    </TableCell>
                  </TableRow>

                </TableContainer>


              </Paper>
            </Box>


          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="light"
              style={{marginLeft:"45px"}}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <SubmitSuccess
              showSubmitSuccess={showSubmitSuccess}
              content={"You have saved contest"}/>
          </CardActions>
        </Card>
      </MuiPickersUtilsProvider>


    </div>
  );


}