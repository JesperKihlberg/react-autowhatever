import theme from '../theme.less';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue } from 'actions/app';
import Autowhatever from 'Autowhatever';
import SourceCodeLink from 'SourceCodeLink/SourceCodeLink';

const exampleId = '9';
const file = `demo/src/components/App/components/Example${exampleId}/Example${exampleId}.js`;

function mapStateToProps(state) {
  return {
    value: state[exampleId].value
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: event => dispatch(updateInputValue(exampleId, event.target.value))
  };
}

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

function renderItem(item) {
  return (
    <span>{item.text}</span>
  );
}

class CustomInput extends Component {
  render() {
    return <div> input: <br /> <input type="text"  {...this.props} /></div>;
  }
}

class Example extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { value, onChange } = this.props;
    const inputProps = { value, onChange };
    const input = CustomInput;

    return (
      <div>
        <Autowhatever id={exampleId}
                      items={items}
                      renderItem={renderItem}
                      inputProps={inputProps}
                      theme={theme}
                      input={input} />
        <SourceCodeLink file={file} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Example);
