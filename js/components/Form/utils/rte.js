import React, { Component } from "react";
import { asField } from "informed";
import RichTextEditor from "react-rte";

const rteToolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ["INLINE_STYLE_BUTTONS", "LINK_BUTTONS"],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD", className: "custom-css-class" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" }
  ]
};

class RteField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localValue:
        props.value || props.initialValue
          ? RichTextEditor.createValueFromString(
              props.value || props.initialValue,
              "html"
            )
          : RichTextEditor.createEmptyValue()
    };

    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  clear() {
    this.setState({ localValue: RichTextEditor.createEmptyValue() });
  }

  render() {
    const { fieldApi, fieldState, ...props } = this.props;
    const { value } = fieldState;
    const { setValue, setTouched } = fieldApi;
    const { onChange, onBlur, forwardedRef, ...rest } = props;

    return (
      <RichTextEditor
        value={this.state.localValue}
        ref={forwardedRef}
        onChange={e => {
          this.setState({ localValue: e });
          setValue(e.toString("html"));
          if (onChange) {
            onChange(e.toString("html"));
          }
        }}
        toolbarConfig={rteToolbarConfig}
      />
    );
  }
}

export default asField(RteField);
