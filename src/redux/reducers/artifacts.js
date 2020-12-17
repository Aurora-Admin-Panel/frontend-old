import { ADD_ARTIFACTS } from "../actionTypes";

const initialState = {
    
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_ARTIFACTS: {
      return {
        ...state,
        [`${action.payload.server_id}-${action.payload.port_id}`]: action.payload
      };
    }
    default:
      return state;
  }
}
