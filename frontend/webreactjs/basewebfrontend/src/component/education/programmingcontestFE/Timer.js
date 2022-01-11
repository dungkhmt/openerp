import {useEffect, useRef, useState} from "react";
import * as React from "react";
import {request} from "./Request";
import PropTypes from "prop-types";

Timer.propTypes = {
  contestId: PropTypes.string.isRequired,
  contestTime: PropTypes.number.isRequired,
  timoutSubmit: PropTypes.func.isRequired
}

export function Timer(props){
  const contestId = props.contestId;
  const contestTime = props.contestTime;
  const timoutSubmit = props.timoutSubmit;

  const timeoutSubmisFunction = () =>{
    timoutSubmit();
  }

  const [timer, setTimer] = useState('00:00:00');
  const Ref = useRef(null);

  useEffect(() =>{
    // setContestTime(res.data.contestTime);
    //
    // console.log("res ", res.data);
    //
    let a = "startTime-"+contestTime.toString()+"-"+contestId;

    if(localStorage.getItem(a) == null){
      console.log("set start time");
      let now = new Date();
      now.setMinutes(now.getMinutes()+contestTime%60);
      now.setHours(now.getHours()+contestTime/60);
      localStorage.setItem(a, now);
      clearTimer(now);
    }else{
      let now = new Date();
      if(localStorage.getItem(a) + contestTime < now.getHours()*60 + now.getMinutes()){
        // localStorage.removeItem(a);
      }else{
        clearTimer(new Date(localStorage.getItem(a)));
      }
    }
  }, []);




  const clearTimer = (e) => {

    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000)
    console.log("done");

    Ref.current = id;

  }

  const startTimer = (e) => {
    // console.log("start timer ", e);
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {

      // update the timer
      // check if less than 10 then we need to
      // add '0' at the begining of the variable
      let a = (hours > 9 ? hours : '0' + hours) + ':' +
        (minutes > 9 ? minutes : '0' + minutes) + ':' +
        (seconds > 9 ? seconds : '0' + seconds);
      setTimer(a);


      // setTest(a);
      // setTimer(
      //   (hours > 9 ? hours : '0' + hours) + ':' +
      //   (minutes > 9 ? minutes : '0' + minutes) + ':'
      //   + (seconds > 9 ? seconds : '0' + seconds)
      // );
    }else{
      //  submit
      timeoutSubmisFunction();
      clearInterval(Ref.current);
      // this.props.timoutSubmit();
    }
  }

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    return {
      total, hours, minutes, seconds
    };
  }

  return(
    <div>
      <b><span style={{color:"#FFFFFF"}}>{`${timer}`}</span></b>
    </div>
  )
}