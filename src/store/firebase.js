import firebase from "react-native-firebase";
const db = firebase.firestore();

/** ACTION TYPES **/
const LOGIN = "LOGIN";
const SIGNUP = "SIGNUP";
const ERROR = "ERROR";
const SIGNOUT = "SIGNOUT";
const UPDATE_PREFS = "UPDATE_PREFS";

/** ACTION CREATORS **/
const login = user => ({ type: LOGIN, user });
//does this signup take user?
const signUp = user => ({ type: SIGNUP, user });
const signOut = () => ({ type: SIGNOUT });
const errorAction = errMessage => ({ type: ERROR, errMessage });
const updatePrefs = preferences => ({ type: UPDATE_PREFS, preferences });

/** THUNK CREATORS **/

export const signIn = (email, password, navigate) => {
  return async dispatch => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      //this user obj passed into login may be changed
      //once we know how it comes back from the db
      dispatch(login({ email, password }));
      navigate("HomeScreen");
    } catch (err) {
      console.log("Error signing in: ", err.message);
      dispatch(errorAction(err.message));
    }
  };
};

export const signUpUser = (email, password, navigate) => {
  return async dispatch => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      db.collection("users")
        .add({
          email: email,
          name: "",
          heartRate: true,
          steps: true,
          sleep: true,
          mood: true,
          share: true,
          location: true
        })
        .then(function(docRef) {
          console.log("DOCREFFFFFF!!!!!!", docRef.id);
          docRef.collection("moodLog").add({
            accomplishment: "",
            advice: "",
            journalEntry: "",
            mood: 0,
            outerInfluences: 0,
            struggle: ""
          });
          let { id } = docRef;
          dispatch(signUp({ email, password, id }));
        });
      navigate("Preferences");
    } catch (err) {
      console.log("Error signing up user: ", err.message);
      dispatch(errorAction(err.message));
    }
  };
};

export const signOutUser = navigate => {
  return async dispatch => {
    try {
      await firebase.auth().signOut();
      dispatch(signOut());
      navigate("LoginScreen");
    } catch (err) {
      console.log("Error logging out user: ", err.message);
      dispatch(errorAction(err.message));
    }
  };
};

export const updateUserPrefs = (docId, preferences, navigate) => {
  return async dispatch => {
    try {
      console.log("NAVNAV??", navigate);
      await db
        .collection("users")
        .doc(docId)
        .update(preferences);
      dispatch(updatePrefs(preferences));
      navigate("HomeScreen");
    } catch (err) {
      console.log("Error updating preferences: ", err.message);
      dispatch(errorAction(err.message));
    }
  };
};

/** INITIAL STATE **/
//ON PAUSE
const initialState = {
  name: "",
  email: "",
  password: "",
  errorMessage: null,
  userDocId: "",
  preferences: {}
};

/** FIREBASE REDUCER **/
export default (firestoreStore = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP:
      return {
        ...state,
        email: action.user.email,
        password: action.user.password,
        userDocId: action.user.id
      };
    case LOGIN:
      return {
        ...state,
        email: action.user.email,
        password: action.user.password
      };
    case SIGNOUT:
      return state;
    case ERROR:
      return { ...state, errorMessage: action.errMessage };
    case UPDATE_PREFS:
      return { ...state, preferences: action.preferences };
    default:
      return state;
  }
});
