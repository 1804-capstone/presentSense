import AppleHealthKit from "rn-apple-healthkit";

//action types
const GET_HR = "GET_HR";
const GET_HR_OVER_TIME = "GET_HR_OVER_TIME";

const initialState = {
  lastHr: {},
  hrSamples: []
};
//action creator
const getHeartRate = heartRate => ({ type: GET_HR, heartRate });
const getHeartRateOverTime = heartRateSamples => ({
  type: GET_HR_OVER_TIME,
  heartRateSamples
});
//thunk creator
// const heartOptions = {
//   unit: "bpm", // optional; default 'bpm'
//   startDate: new Date(2017, 6, 20).toISOString(), // required
//   endDate: new Date().toISOString(), // optional; default now
//   ascending: false, // optional; default false
//   limit: 10 // optional; default no limit
// };
export const fetchLatestHeartRate = heartOptions => dispatch =>
  AppleHealthKit.getHeartRateSamples(heartOptions, (err, results) => {
    if (err) {
      console.log("error getting heartrate from healthkit");
    } else {
      dispatch(getHeartRate(results[0]));
    }
  });
export const fetchHeartRateOverTime = heartOptions => dispatch =>
  AppleHealthKit.getHeartRateSamples(heartOptions, (err, results) => {
    if (err) {
      console.log("error getting heartrate from healthkit");
    } else {
      dispatch(getHeartRateOverTime(results));
    }
  });

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_HR:
      return { ...state, lastHr: action.heartRate };
    case GET_HR_OVER_TIME:
      return { ...state, hrSamples: action.heartRateSamples };
    default:
      return state;
  }
};
