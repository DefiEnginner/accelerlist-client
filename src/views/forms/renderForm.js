import React from "react";
import {
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Col
} from "reactstrap";

export default class RenderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: {},
      formValues: {},
      errors: {}
    };
  }
  handleChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState(
      {
        formValues: {
          ...this.state.formValues,
          [name]: value
        }
      },
      () => {
        this.detectErrorInField(name);
      }
    );
  };
  detectErrorInField = name => {
    let hasError = false;
    const formValues = this.state.formValues;
    const fieldSpecs = this.props.formSpecs.fields;
    let errors = this.state.errors;

    for (
      let i = 0;
      i < this.props.formSpecs.fields[name].validations.length;
      i++
    ) {
      const validation = fieldSpecs[name].validations[i];
      switch (validation.type) {
        case "required":
          if (
            formValues[name] === null ||
            typeof formValues[name] === "undefined" ||
            formValues[name] === ""
          ) {
            errors = {
              ...errors,
              [name]: validation.messsage || "Field is mandatory"
            };
            hasError = true;
          }
          break;
        case "pattern":
          if (!new RegExp(validation.value).test(formValues[name])) {
            errors = {
              ...errors,
              [name]: validation.messsage || "Format is invalid"
            };
            hasError = true;
          }
          break;
        default:
          break;
      }
      if (hasError) {
        break;
      }
    }

    this.setState(prevState => {
      if (hasError) {
        prevState.errors[name] = errors[name];
      } else if (prevState.errors[name]) {
        delete prevState.errors[name];
      }
      return {
        errors: {
          ...prevState.errors
        }
      };
    });
    return hasError;
  };
  handleBlur = field => evt => {
    this.setState({
      touched: { ...this.state.touched, [field]: true }
    });
    this.handleChange(evt);
  };
  shouldMarkError = field => {
    const shouldShow =
      !!this.state.touched[field] || this.state.submittedAtleastOnce;
    const hasError = this.state.errors[field];
    return hasError ? shouldShow : false;
  };
  renderInput = (name, inputSpecs) => {
    switch (inputSpecs.type) {
      case "select":
        return (
          <Input
            type="select"
            disabled={this.props.disableForm}
            name={name}
            id={name}
            onChange={this.handleChange}
            invalid={this.shouldMarkError(name) ? true : undefined}
            onBlur={this.handleBlur(name)}
          >
            <option value="" />
            {inputSpecs.options.map(opt => {
              return (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              );
            })}
          </Input>
        );
      default:
        return (
          <Input
            name={name}
            disabled={this.props.disableForm}
            id={name}
            onChange={this.handleChange}
            invalid={this.shouldMarkError(name) ? true : undefined}
            onBlur={this.handleBlur(name)}
            placeholder={inputSpecs.placeholder}
          />
        );
    }
  };
  submitForm = e => {
    e.preventDefault();
    if (this.props.disableForm) {
      return;
    }
    this.setState({
      submittedAtleastOnce: true
    });
    const formValues = this.state.formValues;
    const fieldSpecs = this.props.formSpecs.fields;
    const fields = Object.keys(fieldSpecs);

    let hasError = false;

    fields.forEach(field => {
      hasError = this.detectErrorInField(field) || hasError;
    });

    if (hasError) {
      return;
    }
    this.props.submitFormValues(formValues);
  };
  render() {
    const { formSpecs } = this.props;
    return (
      <Form id={formSpecs.form.id}>
        {formSpecs.form.rows.map((row, rowIndex) => {
          return (
            <FormGroup row key={rowIndex}>
              {row.fields.map((field, columnIndex) => {
                return (
                  <Col sm={field.span} key={rowIndex + "-" + columnIndex}>
                    <Label for={field.name} sm={12}>
                      {formSpecs.fields[field.name].label}
                    </Label>
                    <Col sm={12}>
                      {this.renderInput(
                        field.name,
                        formSpecs.fields[field.name]
                      )}
                      {this.state.errors[field.name] && (
                        <FormFeedback>
                          {this.state.errors[field.name]}
                        </FormFeedback>
                      )}
                    </Col>
                  </Col>
                );
              })}
            </FormGroup>
          );
        })}
        <FormGroup row>
          <Col sm={12} className="text-center">
            <Button
              type="button"
              disabled={this.props.disableForm}
              color="success"
              onClick={this.submitForm}
            >
              {formSpecs.form.submitLabel}
            </Button>{" "}
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
