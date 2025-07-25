import React from 'react';
import CountDown from 'react-countdown';
const Timer = ({ time, setOtpExpire }) => {
   // console.log(time);
    return (

        <div>
            <CountDown onComplete={ ()=> setOtpExpire(true) } date={Date.now() + Number(time) } />
        </div>
    )
}
export default Timer;
