import _ from "lodash";
import { Stream } from "./RenderGame";

let streamIds = 0;

const distance = ([x1, y1], [x2, y2]) =>
  Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const createStream = (state, { touches }) => {
  touches.filter(t => t.type === "press").forEach(t => {
    if (_.size(state) < 5) {
      state[++streamIds] = {
        position: [t.event.pageX, t.event.pageY],
        renderer: Stream
      };
    }
  });
  return state;
};

const assignFinger = (state, { touches }) => {
  let allStreams = Object.keys(state).map(key => ({
    id: key,
    components: state[key]
  }));

  touches.filter(x => x.type === "start").forEach(t => {
    let touchStart = [t.event.pageX, t.event.pageY];
    let closestStream = _.minBy(
      allStreams.filter(w => !w.components.touchId).map(w =>
        Object.assign(w, {
          distance: distance(touchStart, w.components.position)
        })
      ),
      "distance"
    );
    if (closestStream) closestStream.components.touchId = t.id;
  });
  return state;
};

const moveStream = (state, { touches }) => {
  touches.filter(t => t.type === "move").forEach(t => {
    let streamId = Object.keys(state).find(key => state[key].touchId === t.id);
    let stream = state[streamId];
    if (stream) {
      stream.position = [
        stream.position[0] + t.delta.pageX,
        stream.position[1] + t.delta.pageY
      ];
    }
  });
  return state;
};

const releaseFinger = (state, { touches }) => {
  touches.filter(t => t.type === "end").forEach(t => {
    Object.keys(state)
      .filter(key => state[key].touchId === t.id)
      .forEach(key => delete state[key]["touchId"]);
  });
  return state;
};

const endStream = (state, { touches }) => {
  touches.filter(t => t.type === "long-press").forEach(t => {
    let touchStart = [t.event.pageX, t.event.pageY];
    let closestStream = _.sortBy(
      Object.keys(state)
        .map(key => ({
          id: key,
          distance: distance(state[key].position, touchStart)
        }))
        .filter(x => x.distance < 60),
      ["distance"]
    )[0];
    if (closestStream) delete state[closestStream.id];
  });
  return state;
};

export { createStream, assignFinger, moveStream, releaseFinger, endStream };
