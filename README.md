This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

PresentSense is an app for tracking and visualizing mental and physical wellness.

## Implementing a Mood Map:
![mood map](https://media.giphy.com/media/5Sx7HI8fXeO8ePoSmz/giphy.gif)
  * Follow directions for weight-based heatmap here: https://github.com/pjamrozowicz/react-native-heatmaps
  * In the component that loads the map, get user's location:
  ```javascript
    componentDidMount() {
      navigator.geolocation.setRNConfiguration({setRNConfiguration: true})
      navigator.geolocation.requestAuthorization()
      navigator.geolocation.getCurrentPosition(location => {
        this.setState({
           latitude: location.coords.latitude,
           longitude: location.coords.longitude
        })
      })
    }
  ```
  * Since this app uses Cloud Firestore, create new Geopoints for the range to search. Users in the database should also have their coordinate stored.
  ```javascript
      import firebase from "react-native-firebase"
      //find the lowest and greatest coords for area to query w/ 3 mile "radius"
      const lowerLat = lat - 0.0434782608
      const lowerLong = long - 0.5454545454
      const greaterLat = lat + 0.0434782608
      const greaterLong = long + 0.5454545454
      //create new geopoints
      const lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLong);
      const greaterGeopoint = new firebase.firestore.GeoPoint(greaterLat, greaterLong);
      //create query (you may have to create a custom index maually in Firestore)
      await db.collection('users')
        .where('location', '==', true)
        .where('coords', '>', lesserGeopoint)
        .where('coords', '<', greaterGeopoint)
        .get()
        .then( snapshot => {
          //the heatmap expects an array of objects, which we will build here
          let moodsNearby = []
          snapshot.forEach(doc => {
            const data = {
              latitude: doc.data().coords._latitude,
              longitude: doc.data().coords._longitude,
              weight: Math.floor(doc.data().moodData.average * 25)
            }
            moodsNearby.push(data)
          })
  ```
  * Then, in the MapView.Heatmap, you can use your data from the database for the points prop
