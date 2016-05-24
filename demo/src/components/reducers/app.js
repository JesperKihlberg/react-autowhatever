import { UPDATE_INPUT_VALUE, UPDATE_FOCUSED_ITEM, UPDATE_FOCUSED_MENU } from 'actions/app';

const initialState = {
  0: {
    value: 'Items not displayed'
  },
  1: {
    value: 'No focused item'
  },
  2: {
    value: 'Focused item'
  },
  3: {
    value: 'Multi section - No focused item'
  },
  4: {
    value: 'Multi section - focused item'
  },
  5: {
    value: 'Hover and click items',
    focusedSectionIndex: null,
    focusedItemIndex: null
  },
  6: {
    value: 'Up/Down',
    focusedSectionIndex: null,
    focusedItemIndex: null
  },
  7: {
    value: 'Multi section - Up/Down/Enter',
    focusedSectionIndex: null,
    focusedItemIndex: null
  },
  8: {
    value: 'Multi level',
    focusedSectionIndex: null,
    focusedItemIndex: null
  },
  9: {
    value: 'Custom input'
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_INPUT_VALUE:
      return {
        ...state,
        [action.exampleNumber]: {
          ...state[action.exampleNumber],
          value: action.value
        }
      };

    case UPDATE_FOCUSED_ITEM:
      return {
        ...state,
        [action.exampleNumber]: {
          ...state[action.exampleNumber],
          focusedSectionIndex: action.focusedSectionIndex,
          focusedItemIndex: action.focusedItemIndex
        }
      };

    case UPDATE_FOCUSED_MENU:
      return {
        ...state,
        [action.exampleNumber]: {
          ...state[action.exampleNumber],
          focusedSectionIndex: action.focusedSectionIndex,
          focusedItemIndex: action.focusedItemIndex,
          isPrimaryFocused: action.isPrimaryFocused,
          focusedSubItemIndex: action.focusedSubItemIndex

        }
      };

    default:
      return state;
  }
}
