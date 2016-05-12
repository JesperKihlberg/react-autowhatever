import theme from '../theme.less';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue, updateFocusedMenu } from 'actions/app';
import Autowhatever from 'Autowhatever';
import SourceCodeLink from 'SourceCodeLink/SourceCodeLink';

const exampleId = '8';
const file = `demo/src/components/App/components/Example${exampleId}/Example${exampleId}.js`;

const items = [{
  text: 'Apple'
}, {
  text: 'Banana'
}, {
  text: 'Cherry'
}, {
  text: 'Grapefruit'
}, {
  text: 'Lemon'
}];

const subItems = [{
  text: 'Tea'
}, {
  text: 'Coffee'
}, {
  text: 'Hot chocolate'
}
];

function shouldRenderSection(section) {
  return section.items && section.items.length > 0;
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionItems(section) {
  return section.items;
}

function renderItem(item) {
  return (
    <span>{item.text}</span>
  );
}

function renderSubItem(item) {
  return (
    <span>{item.text}</span>
  );
}

function mapStateToProps(state) {
  return {
    value: state[exampleId].value,
    focusedSectionIndex: state[exampleId].focusedSectionIndex,
    focusedItemIndex: state[exampleId].focusedItemIndex,
    isPrimaryFocused: state[exampleId].isPrimaryFocused,
    focusedSubItemIndex: state[exampleId].focusedSubItemIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: event => {
      dispatch(updateInputValue(exampleId, event.target.value));
    },
    onKeyDown: (event, { focusedItemIndex, newFocusedSectionIndex, newFocusedItemIndex, focusedSubItemIndex, newFocusedSubItemIndex, isPrimaryFocused }) => {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          dispatch(updateFocusedMenu(exampleId, newFocusedSectionIndex, newFocusedItemIndex, isPrimaryFocused, newFocusedSubItemIndex));
          break;
        case 'ArrowRight':
          event.preventDefault();
          dispatch(updateFocusedMenu(exampleId, null, focusedItemIndex, false, 0));
          break;
        case 'ArrowLeft':
          event.preventDefault();
          dispatch(updateFocusedMenu(exampleId, null, focusedItemIndex, true, null));
          break;
        case 'Enter':
          if (isPrimaryFocused) {
            dispatch(updateInputValue(exampleId, items[focusedItemIndex].text + '  selected'));
          } else {
            dispatch(updateInputValue(exampleId, subItems[focusedSubItemIndex].text + '  selected'));
          }
          break;
      }
    },
    onMouseEnter: (event, { sectionIndex, itemIndex, isPrimaryFocused, subItemIndex }) => {
      dispatch(updateFocusedMenu(exampleId, sectionIndex, itemIndex, isPrimaryFocused, subItemIndex));
    },
    onMouseLeave: () => {
      dispatch(updateFocusedMenu(exampleId, null, null, null, null));
    },
    onMouseDown: (event, { itemIndex, isPrimaryFocused, subItemIndex }) => {
      if (isPrimaryFocused) {
        dispatch(updateInputValue(exampleId, items[itemIndex].text + ' clicked'));
      } else {
        dispatch(updateInputValue(exampleId, subItems[subItemIndex].text + ' clicked'));
      }
    }

  };
}

class Example extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    focusedSectionIndex: PropTypes.number,
    focusedItemIndex: PropTypes.number,
    isPrimaryFocused: PropTypes.bool,
    focusedSubItemIndex: PropTypes.number,

    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
  };

  render() {
    const { value, focusedSectionIndex, focusedItemIndex, onChange, onKeyDown, onMouseEnter, onMouseLeave, onMouseDown, isPrimaryFocused, focusedSubItemIndex } = this.props;
    const inputProps = { value, onChange, onKeyDown };
    const itemProps = { onMouseEnter, onMouseLeave, onMouseDown };

    return (
      <div>
        <Autowhatever id={exampleId}
                      multiSection={false}
                      multiLevel={true}
                      items={items}
                      subItems={subItems}
                      isPrimaryFocused={isPrimaryFocused}
                      focusedSubItemIndex={focusedSubItemIndex}
                      shouldRenderSection={shouldRenderSection}
                      renderSectionTitle={renderSectionTitle}
                      getSectionItems={getSectionItems}
                      renderItem={renderItem}
                      renderSubItem={renderSubItem}
                      inputProps={inputProps}
                      itemProps={itemProps}
                      focusedSectionIndex={focusedSectionIndex}
                      focusedItemIndex={focusedItemIndex}
                      theme={theme} />
        <SourceCodeLink file={file} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Example);
