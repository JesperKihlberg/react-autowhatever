import React, { Component, PropTypes } from 'react';
import createSectionIterator from 'section-iterator';
import themeable from 'react-themeable';

function noop() {}

export default class Autowhatever extends Component {
  static propTypes = {
    id: PropTypes.string,                  // Used in aria-* attributes. If multiple Autowhatever's are rendered on a page, they must have unique ids.
    multiSection: PropTypes.bool,          // Indicates whether a multi section layout should be rendered.
    multiLevel: PropTypes.bool,            // Indicates whether a multi level layout should be rendered.
    items: PropTypes.array.isRequired,     // Array of items or sections to render.
    subItems: PropTypes.array,             // Array of submenu items to render.
    renderItem: PropTypes.func,            // This function renders a single item.
    renderSubItem: PropTypes.func,         // This function renders a single item.
    shouldRenderSection: PropTypes.func,   // This function gets a section and returns whether it should be rendered, or not.
    renderSectionTitle: PropTypes.func,    // This function gets a section and renders its title.
    getSectionItems: PropTypes.func,       // This function gets a section and returns its items, which will be passed into `renderItem` for rendering.
    inputProps: PropTypes.object,          // Arbitrary input props
    itemProps: PropTypes.oneOfType([       // Arbitrary item props
      PropTypes.object,
      PropTypes.func
    ]),
    focusedSectionIndex: PropTypes.number, // Section index of the focused item
    focusedItemIndex: PropTypes.number,    // Focused item index (within a section)
    focusedSubItemIndex: PropTypes.number, // Focused subitem index (within a section)
    isPrimaryFocused: PropTypes.bool,      // Is primary menu focused
    theme: PropTypes.object                // Styles. See: https://github.com/markdalgleish/react-themeable
  };

  static defaultProps = {
    id: '1',
    multiSection: false,
    multiLevel: false,
    shouldRenderSection: () => true,
    renderItem: () => {
      throw new Error('`renderItem` must be provided');
    },
    renderSubItem: () => {
      throw new Error('`renderSubItem` must be provided');
    },
    renderSectionTitle: () => {
      throw new Error('`renderSectionTitle` must be provided');
    },
    getSectionItems: () => {
      throw new Error('`getSectionItems` must be provided');
    },
    inputProps: {},
    itemProps: {},
    focusedSectionIndex: null,
    focusedItemIndex: null,
    focusedSubItemIndex: null,
    isPrimaryFocused: true,      // Is primary menu focused
    theme: {
      container: 'react-autowhatever__container',
      containerOpen: 'react-autowhatever__container--open',
      input: 'react-autowhatever__input',
      itemsContainer: 'react-autowhatever__items-container',
      item: 'react-autowhatever__item',
      itemFocused: 'react-autowhatever__item--focused',
      sectionContainer: 'react-autowhatever__section-container',
      sectionTitle: 'react-autowhatever__section-title',
      sectionItemsContainer: 'react-autowhatever__section-items-container',
      subItemsContainer: 'react-autowhatever__subitems-container',
      subItem: 'react-autowhatever__subitem',
      subItemFocused: 'react-autowhatever__subitem--focused'
    }
  };

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  getItemId(sectionIndex, itemIndex) {
    if (itemIndex === null) {
      return null;
    }

    const { id } = this.props;
    const section = (sectionIndex === null ? '' : `section-${sectionIndex}`);

    return `react-autowhatever-${id}-${section}-item-${itemIndex}`;
  }

  getSubItemId(subItemIndex) {
    if (subItemIndex === null) {
      return null;
    }

    const { id } = this.props;

    return `react-autowhatever-${id}-subitem-${subItemIndex}`;
  }

  getItemsContainerId() {
    const { id } = this.props;

    return `react-whatever-${id}`;
  }
  getSubItemsContainerId() {
    const { id } = this.props;

    return `react-whatever-sub-${id}`;
  }

  renderItemsList(theme, items, sectionIndex) {
    const { id, renderItem, multiLevel, focusedSectionIndex, focusedItemIndex } = this.props;
    const isItemPropsFunction = (typeof this.props.itemProps === 'function');
    const isPrimaryFocused = true;

    return items.map((item, itemIndex) => {
      const itemPropsObj = isItemPropsFunction
        ? this.props.itemProps({ sectionIndex, itemIndex })
        : this.props.itemProps;
      const { onMouseEnter, onMouseLeave, onMouseDown, onClick } = itemPropsObj;

      const onMouseEnterFn = onMouseEnter ?
        event => onMouseEnter(event, { sectionIndex, itemIndex, isPrimaryFocused }) :
        noop;
      const onMouseLeaveFn = onMouseLeave ?
        event => onMouseLeave(event, { sectionIndex, itemIndex, isPrimaryFocused }) :
        noop;
      const onMouseDownFn = onMouseDown ?
        event => onMouseDown(event, { sectionIndex, itemIndex, isPrimaryFocused }) :
        noop;
      const onClickFn = onClick ?
        event => onClick(event, { sectionIndex, itemIndex, isPrimaryFocused }) :
        noop;
      const sectionPrefix = (sectionIndex === null ? '' : `section-${sectionIndex}-`);
      const itemKey = `react-autowhatever-${id}-${sectionPrefix}item-${itemIndex}`;
      const itemProps = {
        id: this.getItemId(sectionIndex, itemIndex),
        role: 'option',
        ...theme(itemKey, 'item', sectionIndex === focusedSectionIndex &&
                                  itemIndex === focusedItemIndex &&
                                  'itemFocused'),
        ...itemPropsObj,
        onMouseEnter: onMouseEnterFn,
        onMouseLeave: onMouseLeaveFn,
        onMouseDown: onMouseDownFn,
        onClick: onClickFn
      };

      const renderedSubItems= multiLevel && (sectionIndex === focusedSectionIndex && itemIndex === focusedItemIndex) ? this.renderSubItems(theme):'';
      let remainingItemProps = {};

      Object.keys(itemProps).forEach(function(key) {
        if(key != 'className') {
          remainingItemProps[key] = itemProps[key];
        }
      });

      return (
        <li className={itemProps.className} key={itemIndex}>
          <div {...remainingItemProps}>
            {renderItem(item)}
          </div>
          {renderedSubItems}
        </li>
      );
    });
  }

  renderSubItemsList(theme, subItems) {
    const { renderSubItem, focusedSubItemIndex } = this.props;
    const isItemPropsFunction = (typeof this.props.itemProps === 'function');
    const isPrimaryFocused = false;

    return subItems.map((item, subItemIndex) => {
      const itemPropsObj = isItemPropsFunction
        ? this.props.itemProps({ subItemIndex })
        : this.props.itemProps;
      const { onMouseEnter, onMouseLeave, onMouseDown, onClick } = itemPropsObj;

      const onMouseEnterFn = onMouseEnter ?
        event => onMouseEnter(event, { subItemIndex, isPrimaryFocused }) :
        noop;
      const onMouseLeaveFn = onMouseLeave ?
        event => onMouseLeave(event, { subItemIndex, isPrimaryFocused }) :
        noop;
      const onMouseDownFn = onMouseDown ?
        event => onMouseDown(event, { subItemIndex, isPrimaryFocused }) :
        noop;
      const onClickFn = onClick ?
        event => onClick(event, { isPrimaryFocused, subItemIndex }) :
        noop;
      const itemProps = {
        id: this.getSubItemId(subItemIndex, true),
        role: 'option',
        ...theme(subItemIndex, 'subItem', subItemIndex === focusedSubItemIndex &&
                                    'subItemFocused'),
        ...itemPropsObj,
        onMouseEnter: onMouseEnterFn,
        onMouseLeave: onMouseLeaveFn,
        onMouseDown: onMouseDownFn,
        onClick: onClickFn
      };

      return (
        <li {...itemProps}>
          {renderSubItem(item)}
        </li>
      );
    });
  }

  renderSections(theme) {
    const { items, getSectionItems } = this.props;
    const sectionItemsArray = items.map(section => getSectionItems(section));
    const noItemsExist = sectionItemsArray.every(sectionItems => sectionItems.length === 0);

    if (noItemsExist) {
      return null;
    }
    const { id, shouldRenderSection, renderSectionTitle } = this.props;

    return (
      <div id={this.getItemsContainerId()}
           role="listbox"
           {...theme(`react-autowhatever-${id}-items-container`, 'itemsContainer')}>
        {
          items.map((section, sectionIndex) => {
            if (!shouldRenderSection(section)) {
              return null;
            }

            const sectionTitle = renderSectionTitle(items[sectionIndex]);

            return (
              <div {...theme(`react-autowhatever-${id}-section-${sectionIndex}-container`, 'sectionContainer')}>
                {
                  sectionTitle &&
                    <div {...theme(`react-autowhatever-${id}-section-${sectionIndex}-title`, 'sectionTitle')}>
                      {sectionTitle}
                    </div>
                }
                <ul {...theme(`react-autowhatever-${id}-section-${sectionIndex}-items-container`, 'sectionItemsContainer')}>
                  {this.renderItemsList(theme, sectionItemsArray[sectionIndex], sectionIndex)}
                </ul>
              </div>
            );
          })
        }
      </div>
    );
  }

  renderItems(theme) {
    const { items } = this.props;

    if (items.length === 0) {
      return null;
    }

    const id = this.props;

    return (
      <ul
        {...theme(`react-autowhatever-${id}-items-container`, 'itemsContainer')}
        role="listbox">
        {this.renderItemsList(theme, items, null)}
      </ul>
    );
  }

  renderSubItems(theme) {
    const { subItems, focusedItemIndex } = this.props;

    if (focusedItemIndex===null || !subItems || subItems.length === 0) {
      return null;
    }

    const id = this.props;

    return (
      <ul
        {...theme(`react-autowhatever-${id}-subitems-container`, 'subItemsContainer')}
        role="listbox">
        {this.renderSubItemsList(theme, subItems, null)}
      </ul>
    );
  }

  onKeyDown(event) {
    const { inputProps, focusedSectionIndex, focusedItemIndex, isPrimaryFocused, focusedSubItemIndex, multiLevel } = this.props;
    const { onKeyDown: onKeyDownFn } = inputProps; // Babel is throwing:
                                                   //   "onKeyDown" is read-only
                                                   // on:
                                                   //   const { onKeyDown } = inputProps;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        const { multiSection, items, getSectionItems, subItems } = this.props;
        let sectionIterator;
        const nextPrev = (event.key === 'ArrowDown' ? 'next' : 'prev');

        if (isPrimaryFocused) {
          sectionIterator = createSectionIterator({
            multiSection,
            data: multiSection ?
                items.map(section => getSectionItems(section).length) :
                items.length
          });
          const [newFocusedSectionIndex, newFocusedItemIndex] =
            sectionIterator[nextPrev]([focusedSectionIndex, focusedItemIndex]);

          onKeyDownFn(event, { focusedItemIndex, focusedSectionIndex, newFocusedSectionIndex, newFocusedItemIndex, isPrimaryFocused });
        } else {
          sectionIterator = createSectionIterator({
            multiSection: false,
            data: subItems.length
          });
          let [newFocusedSectionIndex, newFocusedSubItemIndex] =
            sectionIterator[nextPrev]([0, focusedSubItemIndex]);
          let newFocusedItemIndex = focusedItemIndex;

          newFocusedSectionIndex = focusedSectionIndex;
          onKeyDownFn(event, { focusedItemIndex, newFocusedItemIndex, focusedSectionIndex, newFocusedSectionIndex, focusedSubItemIndex, newFocusedSubItemIndex, isPrimaryFocused });
        }
        break;
      case 'ArrowRight':
        if (isPrimaryFocused && multiLevel) {
          const newFocusedSubItemIndex = 0;
          const isPrimaryFocused = false;
          let newFocusedItemIndex = focusedItemIndex;
          let newFocusedSectionIndex = focusedSectionIndex;

          onKeyDownFn(event, { focusedItemIndex, newFocusedItemIndex, focusedSectionIndex, newFocusedSectionIndex, focusedSubItemIndex, newFocusedSubItemIndex, isPrimaryFocused });
        }
        break;
      case 'ArrowLeft':
        if (!isPrimaryFocused && multiLevel) {
          const newFocusedSubItemIndex = null;
          const isPrimaryFocused = true;
          let newFocusedItemIndex = focusedItemIndex;
          let newFocusedSectionIndex = focusedSectionIndex;

          onKeyDownFn(event, { focusedItemIndex, newFocusedItemIndex, focusedSectionIndex, newFocusedSectionIndex, focusedSubItemIndex, newFocusedSubItemIndex, isPrimaryFocused });
        }
        break;
      default:
        onKeyDownFn(event, { focusedSectionIndex, focusedItemIndex, isPrimaryFocused, focusedSubItemIndex });
    }
  }

  render() {
    const { id, multiSection, focusedSectionIndex, focusedItemIndex } = this.props;
    const theme = themeable(this.props.theme);
    const renderedItems = multiSection ? this.renderSections(theme) : this.renderItems(theme);
    const isOpen = (renderedItems !== null);
    const ariaActivedescendant = this.getItemId(focusedSectionIndex, focusedItemIndex);
    const inputProps = {
      type: 'text',
      value: '',
      autoComplete: 'off',
      role: 'combobox',
      ref: 'input',
      'aria-autocomplete': 'list',
      'aria-owns': this.getItemsContainerId(),
      'aria-expanded': isOpen,
      'aria-activedescendant': ariaActivedescendant,
      ...theme(`react-autowhatever-${id}-input`, 'input'),
      ...this.props.inputProps,
      onKeyDown: this.props.inputProps.onKeyDown && this.onKeyDown
    };

    return (
      <div {...theme(`react-autowhatever-${id}-container`, 'container', isOpen && 'containerOpen')}>
        <input {...inputProps} />
        {renderedItems}
      </div>
    );
  }
}
