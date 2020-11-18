import { SHOW_BANNER, CLEAR_BANNER } from "../actionTypes";

const initialState = {
  show: false,
  title: '',
  body: '',
  type: 'error'
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_BANNER: {
      return {
        ...state,
        ...action.payload,
        show: true,
      };
    }
    case CLEAR_BANNER: {
      return {
        show: false,
        title: '',
        body: '',
        type: 'error'
      };
    }
    default:
      return state;
  }
}
