import firebase from "react-native-firebase";
const db = firebase.firestore();
import moment from 'moment'

/** ACTION TYPES **/
const FETCH_MOODS_OVER_TIME = 'FETCH_MOODS_OVER_TIME'

/** ACTION CREATORS **/
const fetchTheMoods = moods => ({type: FETCH_MOODS_OVER_TIME, moods})

/** THUNK CREATORS **/

export const fetchMoodsOverTime = (startDate, endDate) => {
  return async dispatch => {
    try {
      const user = firebase.auth().currentUser
      const id = user.uid
      //convert date to proper format for query
      const start = moment(startDate).valueOf()
      const end = moment(endDate).valueOf()
      //query db for moodlogs between selected dates
      await db.collection('users').doc(id).collection('moodLog')
        .where('date', '>=', start)
        .where('date', '<=', end)
        .orderBy('date')
        .get()
        .then(function(querySnapshot) {
          let moodsOverTime = []
          querySnapshot.forEach(function(doc) {
            let moodPoint = {
              startDate: moment(doc.data().date).toISOString(),
              endDate: moment(Date.now()).toISOString(),
              value: doc.data().mood
            }
            moodsOverTime.push(moodPoint)
        })
      // console.log("MOOOOOOD", moodsOverTime)
      dispatch(fetchTheMoods(moodsOverTime))
      })
    } catch (err) {
      console.log('Error fetching mood data: ', err.message)
    }
  }
}

/** INITIAL STATE **/
const initialState = []


/** REDUCER **/
export default (mood = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MOODS_OVER_TIME:
      return action.moods
    default:
      return state
  }
})
