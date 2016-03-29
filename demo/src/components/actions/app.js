export const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
export const UPDATE_FOCUSED_ITEM = 'UPDATE_FOCUSED_ITEM';
export const UPDATE_FOCUSED_MENU = 'UPDATE_FOCUSED_MENU';

export function updateInputValue(exampleNumber, value) {
  return {
    type: UPDATE_INPUT_VALUE,
    exampleNumber,
    value
  };
}

export function updateFocusedItem(exampleNumber, focusedSectionIndex, focusedItemIndex) {
  return {
    type: UPDATE_FOCUSED_ITEM,
    exampleNumber,
    focusedSectionIndex,
    focusedItemIndex
  };
}

export function updateFocusedMenu(exampleNumber, focusedSectionIndex, focusedItemIndex, isPrimaryFocused, focusedSubItemIndex) {
  return {
    type: UPDATE_FOCUSED_MENU,
    exampleNumber,
    focusedSectionIndex,
    focusedItemIndex,
    isPrimaryFocused,
    focusedSubItemIndex
  };
}
