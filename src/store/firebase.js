import firebase from "react-native-firebase";
const db = firebase.firestore()


/** ACTION TYPES **/
const LOGIN = 'LOGIN'
const SIGNUP = 'SIGNUP'
const ERROR = 'ERROR'
const SIGNOUT = 'SIGNOUT'

/** ACTION CREATORS **/
const login = (user) => ({type: LOGIN, user})
//does this signup take user?
const signUp = (user) => ({type: SIGNUP, user})
const signOut = () => ({type: SIGNOUT})
const errorAction = (errMessage) => ({type: ERROR, errMessage})

/** THUNK CREATORS **/

export const signIn = (email, password, navigate) => {
  return async (dispatch) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      //this user obj passed into login may be changed
      //once we know how it comes back from the db
      dispatch(login({email, password}))
      navigate("HomeScreen")
    } catch (err) {
      console.log('Error signing in: ', err.message)
      dispatch(errorAction(err.message))
    }
  }
}

export const signUpUser = (email, password, navigate) => {
  return async (dispatch) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      db.collection("users").add({
        email: email
        })
      //this user obj passed into signUp may be changed
      //once we know how it comes back from the db
      dispatch(signUp({email, password}))
      navigate("HomeScreen")
    } catch (err) {
      console.log('Error signing up user: ', err.message)
      dispatch(errorAction(err.message))
    }
  }
}

export const signOutUser = (navigate) => {
  return async (dispatch) => {
    try {
        await firebase.auth().signOut();
        dispatch(signOut())
        navigate("LoginScreen")
    } catch (err) {
      console.log('Error logging out user: ', err.message)
      dispatch(errorAction(err.message))
    }
  }
}

/** INITIAL STATE **/
//ON PAUSE
const initialState = {
  name: '',
  email: '',
  password: '',
  errorMessage: null
}

/** FIREBASE REDUCER **/
export default firestoreStore = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP:
      return {...state, email: action.user.email, password: action.user.password}
    case LOGIN:
      return {...state, email: action.user.email, password: action.user.password}
    case SIGNOUT:
      return state
    case ERROR:
      return {...state, errorMessage: action.errMessage}
    default:
      return state
  }

}
