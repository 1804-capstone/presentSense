



/** INITIAL STATE **/

//one month default...do we want one week?
const getMonth = () => {
  const date = new Date()
  const month = +date.getMonth()
  const newDate = date.setMonth(month - 1)
  return moment(newDate).toDate()
}

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
}
