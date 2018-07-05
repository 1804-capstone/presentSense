import moment from "moment";

const SET_START_DATE = "SET_START_DATE";
const SET_END_DATE = "SET_END_DATE";
const TOGGLE_MOOD = "TOGGLE_MOOD";
const TOGGLE_HEART_RATE = "TOGGLE_HEART_RATE";
const TOGGLE_STEP_COUNT = "TOGGLE_STEP_COUNT";
const TOGGLE_SLEEP = "TOGGLE_SLEEP";
const TOGGLE_FETCHING = "TOGGLE_FETCHING";

export const setStartDate = startDate => ({
  type: SET_START_DATE,
  startDate
});

export const setEndDate = endDate => ({
  type: SET_END_DATE,
  endDate
});

export const toggleMood = value => ({
  type: TOGGLE_MOOD,
  value
});

export const toggleHeartRate = value => ({
  type: TOGGLE_HEART_RATE,
  value
});

export const toggleStepCount = value => ({
  type: TOGGLE_STEP_COUNT,
  value
});

export const toggleSleep = value => ({
  type: TOGGLE_SLEEP,
  value
});

export const toggleFetching = (metric, value) => ({
  type: TOGGLE_FETCHING,
  metric,
  value
});

/** INITIAL STATE **/

//one month default...do we want one week?
const getMonth = () => {
  const date = new Date();
  const month = +date.getMonth();
  const newDate = date.setMonth(month - 1);
  return moment(newDate).toDate();
};

const initialState = {
  startDate: new Date(getMonth()),
  endDate: new Date(),
  heartrate: true,
  stepCount: true,
  sleep: true,
  mood: true,
  isFetching: {
    heartrate: true,
    stepCount: true,
    sleep: true,
    mood: true
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_START_DATE:
      return { ...state, startDate: action.startDate };
    case SET_END_DATE:
      return { ...state, endDate: action.endDate };
    case TOGGLE_MOOD:
      return { ...state, mood: action.value };
    case TOGGLE_HEART_RATE:
      return { ...state, heartrate: action.value };
    case TOGGLE_STEP_COUNT:
      return { ...state, stepCount: action.value };
    case TOGGLE_SLEEP:
      return { ...state, sleep: action.value };
    case TOGGLE_FETCHING:
      return {
        ...state,
        isFetching: { ...state.isFetching, [action.metric]: action.value }
      };
    default:
      return state;
  }
};
