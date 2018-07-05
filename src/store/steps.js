import AppleHealthKit from "rn-apple-healthkit";
import { toggleFetching } from "./visMeta";

const GET_STEPS_OVER_TIME = "GET_STEPS_OVER_TIME";

const initialState = [];

const getStepsOverTime = steps => ({
  type: GET_STEPS_OVER_TIME,
  steps
});

export const fetchLatestSteps = stepOptions => dispatch => {
  // dispatch(toggleFetching("stepCount", true));
  AppleHealthKit.getDailyStepCountSamples(stepOptions, (err, results) => {
    if (err) {
      console.log("error getting steps from healthkit", err);
    } else {
      console.log("IN THUNK, STEPS?", results);
      dispatch(getStepsOverTime(results));
      dispatch(toggleFetching("stepCount", false));
    }
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STEPS_OVER_TIME:
      return action.steps;
    default:
      return state;
  }
};
