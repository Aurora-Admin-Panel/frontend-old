import { SHOW_ERROR, CLEAR_ERROR } from "../actionTypes";

const initialState = {
  show: false,
  title: '',
  body: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_ERROR: {
      return {
        show: true,
        title: action.payload.title,
        body: action.payload.body
      };
    }
    case CLEAR_ERROR: {
      return {
        show: false,
        title: '',
        body: ''
      };
    }
    default:
      return state;
  }
}
