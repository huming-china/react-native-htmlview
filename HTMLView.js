import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import htmlToElement from './htmlToElement';
import { Linking, Platform, StyleSheet, View, ViewPropTypes } from 'react-native';

const boldStyle = {color:'red', fontWeight: '500' };
const italicStyle = {color:'red', fontStyle: 'italic' };
const underlineStyle = { color:'red',textDecorationLine: 'underline' };
const codeStyle = {color:'red', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' };

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  u: underlineStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF',
  },
  body: {
    fontWeight: '500',
    color: 'red',
  },
  h1: { fontWeight: '500', fontSize: 36 },
  h2: { fontWeight: '500', fontSize: 30 },
  h3: { fontWeight: '500', fontSize: 24 },
  h4: { fontWeight: '500', fontSize: 18 },
  h5: { fontWeight: '500', fontSize: 14 },
  h6: { fontWeight: '500', fontSize: 12 },
  tag18: { fontSize: 18 },
  tag20: { fontSize: 20 },
  tag22: { fontSize: 22 },
  tag24: { fontSize: 24 },
  tag26: { fontSize: 26 },
  tag28: { fontSize: 28 },
  tag30: { fontSize: 30 },
  tag32: { fontSize: 32 },
  tag34: { fontSize: 34 },
  tag36: { fontSize: 36 },
  tag38: { fontSize: 38 },
  tag40: { fontSize: 40 },
  tag42: { fontSize: 42 },
  tag44: { fontSize: 44 },
  tag46: { fontSize: 46 },
  tag48: { fontSize: 48 },
  tag50: { fontSize: 50 },
  tag52: { fontSize: 52 },
});

const htmlToElementOptKeys = [
  'lineBreak',
  'paragraphBreak',
  'bullet',
  'TextComponent',
  'textComponentProps',
  'NodeComponent',
  'nodeComponentProps',
];

class HtmlView extends PureComponent {
  constructor() {
    super();
    this.state = {
      element: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.startHtmlRender(this.props.values);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.values !== nextProps.values || this.props.stylesheet !== nextProps.stylesheet||this.props.diyFontStyle!==nextProps.diyFontStyle) {
      this.startHtmlRender(nextProps.values, nextProps.stylesheet,nextProps.diyFontStyle);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  startHtmlRender(values, style,fontstyle) {
    const {
      addLineBreaks,
      onLinkPress,
      onLinkLongPress,
      stylesheet,
      renderNode,
      onError,
      fontStyle,
    } = this.props;

    if (!values) {
      this.setState({ element: null });
    }

    const opts = {
      addLineBreaks,
      linkHandler: onLinkPress,
      linkLongPressHandler: onLinkLongPress,
      styles: { ...baseStyles, ...stylesheet, ...style },
      customRenderer: renderNode,
      diyFontStyle:fontstyle,
    };

    htmlToElementOptKeys.forEach(key => {
      if (typeof this.props[key] !== 'undefined') {
        opts[key] = this.props[key];
      }
    });
    if(fontstyle==null){
    opts['diyFontStyle']=this.props.fontStyle
    }else{
      opts['diyFontStyle']=fontstyle
    }
    htmlToElement(values, opts,this.props.imageClick, (err, element) => {
      if (err) {
        onError(err);
      }
      if (this.mounted) {
        this.setState({ element });
      }
    });
  }

  render() {
    const { RootComponent, style } = this.props;
    const { element } = this.state;
    console.log('element')
    console.log(element);
    console.log(style)
    console.log(this.props)
    if (element) {
      return (
        <RootComponent
          {...this.props.rootComponentProps}
          style={[style,{flexDirection:'row',flexWrap:'wrap'}]}
        >
          {element}
        </RootComponent>
      );
    }
    return (
      <RootComponent
        {...this.props.rootComponentProps}
        style={[style,{flexDirection:'row',flexWrap:'wrap'}]}
        />
    );
  }
}

HtmlView.propTypes = {
  addLineBreaks: PropTypes.bool,
  bullet: PropTypes.string,
  lineBreak: PropTypes.string,
  NodeComponent: PropTypes.func,
  nodeComponentProps: PropTypes.object,
  onError: PropTypes.func,
  fontStyle:PropTypes.any,
  onLinkPress: PropTypes.func,
  onLinkLongPress: PropTypes.func,
  paragraphBreak: PropTypes.string,
  renderNode: PropTypes.func,
  RootComponent: PropTypes.func,
  rootComponentProps: PropTypes.object,
  style: ViewPropTypes.style,
  stylesheet: PropTypes.object,
  TextComponent: PropTypes.func,
  textComponentProps: PropTypes.object,
  values: PropTypes.string,
};

HtmlView.defaultProps = {
  addLineBreaks: true,
  onLinkPress: url => Linking.openURL(url),
  onLinkLongPress: null,
  onError: console.error.bind(console),
  RootComponent: View,
};

export default HtmlView;
