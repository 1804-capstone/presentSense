import firebase from "react-native-firebase";
const db = firebase.firestore();

/** ACTION TYPES **/
const FETCH_MOODS = 'FETCH_MOODS'

/** ACTION CREATORS **/
const fetchMoods = moods => ({type: FETCH_MOODS, moods})

/** THUNK CREATORS **/

export const fetchMoodsNearby = (lat, long) => {
  return async dispatch => {
    try {
      //find the lowest and greatest coords for area to query w/ 3 mile "radius"
      const lowerLat = lat - 0.0434782608
      const lowerLong = long - 0.5454545454
      const greaterLat = lat + 0.0434782608
      const greaterLong = long + 0.5454545454
      //create new geopoints
      const lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLong);
      const greaterGeopoint = new firebase.firestore.GeoPoint(greaterLat, greaterLong);
      //create query
      await db.collection('users')
        .where('location', '==', true)
        .where('coords', '>', lesserGeopoint)
        .where('coords', '<', greaterGeopoint)
        .get()
        .then( snapshot => {
          let moodsNearby = []
          snapshot.forEach(doc => {
            const data = {
              latitude: doc.data().coords._latitude,
              longitude: doc.data().coords._longitude,
              weight: Math.floor(doc.data().moodData.average * 25)
            }
            moodsNearby.push(data)
          })
          console.log('MOODS IN STORE', moodsNearby)
          dispatch(fetchMoods(moodsNearby))
        })
    } catch (err) {
      console.log('Error fetching moods nearby: ', err.message)
    }
  }
}

/** INITIAL STATE **/
const initialState = []


/** REDUCER **/
export default (moodsNearby = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MOODS:
      return action.moods
    default:
      return state
  }
})
