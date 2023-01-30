const App = () => {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(
    new Audio("../sound/BEEP_Bip de censure 3 (ID 2943)_LS.mp3")
  );

  // playBreakSound
  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  // format time
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let secondes = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (secondes < 10 ? "0" + secondes : secondes)
    );
  };


  const formatTimeLength = (time) => {
    let minutes = Math.floor(time / 60);
    
    return (
      minutes
    );
  };
  // changeTime
  const changeTime = (amount, type) => {
    if (type == "break") {
      if (breakTime <= 60 && amount < 0) {
        // do nothing
        return;
      }
      setBreakTime(breakTime + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        // do nothing
        return;
      }
      setSessionTime(sessionTime + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };
  // controlTime
  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = date + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();

        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }

            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      //store interval as a global variable
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }

    // change timerOn
    setTimerOn(!timerOn);
  };

  // resetTime
  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);

  };

  return (
    <div>
      <h1 className="center-align">Pomodoro Clock</h1>
      <div className="dual-container">
        <Length
          idLabel={"break-label"}
          idDecrement={"break-decrement"}
          idIncrement={"break-increment"}
          idLength={"break-length"}
          title={"Break length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTimeLength}
          color={"red"}
        />
        <Length
          idLabel={"session-label"}
          idDecrement={"session-decrement"}
          idIncrement={"session-increment"}
          idLength={"session-length"}
          title={"Session length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTimeLength}
          color={"aqua"}
        />
      </div>
      <h3 className="center-align" id="timer-label" style={{ color: "#00e278" }}>
        {onBreak ? "Break" : "Session"}
      </h3>
      <h1 className="center-align" id="time-left" style={{ color: "#00e278" }}>
        {" "}
        {formatTime(displayTime)}
      </h1>
      <div className="btns center-align">
        <button id="start_stop"
          className="btn-large deep-purple lighten-2"
          onClick={controlTime}
        >
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>

        <button className="btn-large deep-purple lighten-2" id="reset" onClick={resetTime}>
          <i className="material-icons">autorenew</i>
        </button>
      </div>
    </div>
  );
};

function Length({idLabel,idDecrement,idIncrement,idLength, title, changeTime, type, time, formatTime, color }) {
  return (
    <div style={{ color: color }}>
      <h3 id={idLabel}>{title}</h3>
      <div className="time-sets">
        <button id={idDecrement}
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3 id={idLength}>{formatTime(time)}</h3>
        <button id={idIncrement}
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
