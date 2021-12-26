import { useState } from "react";

export const RouteTypes = ({ onChangeHandler }) => {
  const [oneWay, setOneWay] = useState(true);
  const [round, setRoundTrip] = useState(false);

  const changeRoute = (type)=> {
    if(type == "oneWay") {
      setOneWay(true)
      setRoundTrip(false)
      onChangeHandler("oneWay")
    }else {
      setOneWay(false)
      setRoundTrip(true)
      onChangeHandler("roundTrip")
    }

    }
    
  return (
    <div >
      <button
        type="button"
        className="btn btn-secondary btn-sm trip-button"
        onClick={() => changeRoute("oneWay")}
      >
        One Way
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm trip-button"
        onClick={() => changeRoute("roundTrip")}
      >
        Round Trip
      </button>
      
    </div>
  );
};

export default RouteTypes;
