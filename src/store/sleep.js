import AppleHealthKit from "rn-apple-healthkit";
import { toggleFetching } from "./visMeta";

const GET_SLEEP_SAMPLES = "GET_SLEEP_SAMPLES";

const initialState = {
  sleep: []
};

const getSleepSamples = sleep => ({
  type: GET_SLEEP_SAMPLES,
  sleep
});

export const fetchSleep = sleepOptions => dispatch => {
  // dispatch(toggleFetching("sleep", true));
  AppleHealthKit.getSleepSamples(sleepOptions, (err, results) => {
    if (err) {
      console.log("error getting sleep from healtkit", err);
    } else {
      dispatch(getSleepSamples(results));
      dispatch(toggleFetching("sleep", false));
    }
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SLEEP_SAMPLES:
      return action.sleep;
    default:
      return state;
  }
};
