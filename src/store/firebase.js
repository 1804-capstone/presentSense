import firebase from "react-native-firebase";
const db = firebase.firestore();

/** ACTION TYPES **/
const LOGIN = "LOGIN";
const SIGNUP = "SIGNUP";
const ERROR = "ERROR";
const SIGNOUT = "SIGNOUT";
const UPDATE_PREFS = "UPDATE_PREFS";
const FETCH_USER = "FETCH_USER"

/** ACTION CREATORS **/
const login = user => ({ type: LOGIN, user });
const signUp = user => ({ type: SIGNUP, user });
const signOut = () => ({ type: SIGNOUT });
const errorAction = errMessage => ({ type: ERROR, errMessage });
const updatePrefs = (preferences, id) => ({ type: UPDATE_PREFS, preferences, id });
const fetchUser = user => ({type: FETCH_USER, user})

/** THUNK CREATORS **/

export const signIn = (email, password, navigate) => {
  return async dispatch => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // console.log("LOGGED IN: ", user.uid)
          const { uid } = user
          db.collection("users").doc(uid).get().then( doc => {
            let { id } = doc
            let data = doc.data()
            dispatch(login({ data, password, id }))
          })
      navigate("HomeScreen");
        }})
    } catch (err) {
      console.log("Error signing in: ", err.message);
      dispatch(errorAction(err.message));
    }
  };
};

export const fetchUserInfo = navigate => {
  return async dispatch => {
    try {
      await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("LOGGED IN: ", user.uid)
          const { uid } = user
          db.collection("users").doc(uid).get().then( doc => {
            let { id } = doc
            let data = doc.data()
            dispatch(fetchUser({ data, id }))
          })
        } else {
          navigate("LoginScreen")
        }
      });
    } catch (err) {
      console.log("Error fetching user info: ", err.message);
      dispatch(errorAction(err.message));
    }
  }
}

export const signUpUser = (email, password, navigate) => {
  return async dispatch => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = firebase.auth().currentUser
      // console.log("IN SIGN UP, USER UID", user.uid)
      db.collection("users").doc(user.uid).set({
          email: email,
          name: "",
          heartRate: true,
          steps: true,
          sleep: true,
          mood: true,
          share: true,
          location: true
      })
      db.collection("users").doc(user.uid).collection("moodLog").add({
            accomplishment: "",
            advice: "",
            journalEntry: "",
            mood: 0,
            outerInfluences: 0,
            struggle: ""
      })
      const id = user.uid
      dispatch(signUp({ email, password, id }));
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
      const user = firebase.auth().currentUser
      const id = user.uid
      await db.collection("users").doc(id).update(preferences);
      dispatch(updatePrefs(preferences, id));
      navigate("HomeScreen");
    } catch (err) {
      console.log("Error updating preferences: ", err.message);
      dispatch(errorAction(err.message));
    }
  };
};

/** INITIAL STATE **/
const initialState = {
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
        email: action.user.data.email,
        password: action.user.password,
        preferences: action.user.data,
        userDocId: action.user.id
      };
    case FETCH_USER:
      return {
        ...state,
        preferences: action.user.data,
        userDocId: action.user.id
      }
    case SIGNOUT:
      return state;
    case ERROR:
      return { ...state, errorMessage: action.errMessage };
    case UPDATE_PREFS:
      return { ...state, preferences: action.preferences, userDocId: action.id };
    default:
      return state;
  }
});
