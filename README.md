This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

PresentSense is an app for tracking and visualizing mental and physical wellness.

## Implementing a Mood Map:

![](https://thumbs.gfycat.com/AntiqueFatherlyCanary-size_restricted.gif)

- Follow directions for weight-based heatmap here: https://github.com/pjamrozowicz/react-native-heatmaps
- In the component that loads the map, get user's location:

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

- Since this app uses Cloud Firestore, create new Geopoints for the range to search. Users in the database should also have their coordinate stored.

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

- Then, in the MapView.Heatmap, you can use your data from the database for the points prop

## Creating the line graph

- To construct the line graph representing health and mood data, we used D3.js along with the [ART library](https://github.com/sebmarkbage/art/). The ART library exposes four core rendering classes: Surface, Group, Shape, and Text. For our line graph, we used Surface (a required rectangular container), Group (container for other ART components), and Shape (to render our SVG paths).

* To render the lines, we used several libraries from the larger [D3.js](https://d3js.org/) library: [d3-time](https://github.com/d3/d3-time), [d3-scale](https://github.com/d3/d3-scale), and [d3-shape](https://github.com/d3/d3-shape).

We faced the unique challenge of needing unique Y-scales for each of the data points, as each data point was measured by vastly different metrics (users take many more steps in a day than heartbeats per minute, one would hope!). We kept our code as DRY as possible by creating an individualGraphMaker function, which took in a start and end date (from passed down props), as well as a data type (from our AppleHealthKit Data).

Here is a breakdown of our individualGraphMaker function:

- Using d3-scale's **scaleTime** function, we constructed an x-scale for our data points based on user input (passed down as props), which we formatted using the JavaScript Date object (domain), as well as the width of the window on render (range).
  ```javascript
  const min = new Date(this.props.startDate);
  const max = new Date(this.props.endDate);
  const { width, height } = Dimensions.get("window");
  const x = scaleTime()
    .domain([min, max])
    .range([0, width * 0.8]);
  ```

* We then constructed a Y-scale for each data point. We did this through d3-scale's **scaleeLinear** function. The domain was set to the maximum value in the dataset (so the graph can fit that one day you walked 30,000 steps), and the range is based on the height of the screen.
  ```javascript
    const values = data.map(datum => datum.value);
    const maxVal = values.sort((a, b) => a - b)[values.length - 1];
    let y;
    y = scaleLinear()
      .domain([0, maxVal])
      .range([0, height * 0.5]);
    }
  ```
* Finally, with our X and Y-scales constructed, we created path logic via d3-shape's **line** function:
  ```javascript
  const path = line()
    .x(d => x(d.startDate))
    .y(d => y(d.value));
  ```
  line() returns a function which takes in a dataset and converts it into an svg based on the given scales. Our individualGraphMaker function returns this svg path, along with a unique color for each dataset:
  ```javascript
  return {
    path: path(newData),
    color
  };
  ```
* We created an X-axis ticks using small vertical svgs that, when rendered, looked like ticks. We created one for every day between the user's given start date and end date using the **timeDay** function from d3-time, along with a Y-value of 0 (to create a vertical line). We then returned the path function and the set of ticks (x and y here come from similar d3-scale functions as described above).
  ```javascript
  const ticks = x.ticks(timeDay.every(1));
  const dates = ticks.map(tick => [
    {
      tick,
      y: 0
    },
    { tick, y: height * 0.1 }
  ]);
  const path = line()
    .x(d => x(d.tick))
    .y(d => y(d.y));
  return {
    path,
    points
  };
  ```
  - To actually render the graph, we used ART's Shape component, passing in the svg paths from each dataset into Shape's "d" prop, and the colors of each dataset into the "stroke" prop:
  ```javascript
  {
    linePaths.map(path => (
      <Shape
        key={path.color}
        d={path.path}
        stroke={path.color}
        strokeWidth={2}
      />
    ));
  }
  ```
  - We then did the same for each tick to create the X-axis of our graph:
  ```javascript
  {
    points.map(point => (
      <Shape d={path(point)} stroke="#D3D3D3" strokeWidth={3} />
    ));
  }
  ```
  And voila, a React-Native line graph with minimal external libraries!
