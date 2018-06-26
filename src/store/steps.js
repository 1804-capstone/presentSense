import AppleHealthKit from "rn-apple-healthkit";

const GET_STEPS_OVER_TIME = "GET_STEPS_OVER_TIME";

const initialState = {
  steps: []
};

const getStepsOverTime = steps => ({
  type: GET_STEPS_OVER_TIME,
  steps
});

export const fetchLatestSteps = stepOptions => dispatch =>
  AppleHealthKit.getDailyStepCountSamples(stepOptions, (err, results) => {
    if (err) {
      console.log("error getting steps from healthkit", err);
    } else {
      dispatch(getStepsOverTime(results));
    }
  });

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STEPS_OVER_TIME:
      return action.steps;
    default:
      return state;
  }
};
