import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { object, string, number, date, boolean } from 'yup';
import { useEffect, useState } from 'react';

const FormMain = () => {
  // Generate initial values from form configuration
  const [formConfig, setFormConfig] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    formApi();
  }, []);

  const formApi = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://sharejson.com/api/v1/uzjxOUc_5VccqT-1XiEYf');
      const data = await response.json();
      setFormConfig(data);
    } catch (error) {
      console.error('Error fetching form config:', error);
    } finally {
      setLoading(false);
    }
  };
  const generateInitialValues = () => {
    const initialValues = {};
    formConfig?.fields?.forEach((field) => {
      switch (field.type) {
        case 'checkbox':
          initialValues[field.id] = false;
          break;
        case 'number':
          initialValues[field.id] = '';
          break;
        default:
          initialValues[field.id] = '';
      }
    });
    return initialValues;
  };

  // Generate validation schema from form configuration
  const generateValidationSchema = () => {
    const schemaFields = {};

    formConfig?.fields?.forEach((field) => {
      let fieldSchema;

      switch (field.type) {
        case 'text':
          fieldSchema = string();
          break;
        case 'email':
          fieldSchema = string().email('Invalid email');
          break;
        case 'number':
          fieldSchema = number().typeError('Must be a number');
          break;
        case 'date':
          fieldSchema = date().typeError('Invalid date');
          break;
        case 'select':
          fieldSchema = string();
          break;
        case 'checkbox':
          fieldSchema = boolean();
          break;
        default:
          fieldSchema = string();
      }

      // Apply validation rules
      if (field.validation) {
        field.validation?.forEach((rule) => {
          switch (rule.type) {
            case 'required':
              fieldSchema = fieldSchema.required(rule.message);
              break;
            case 'minLength':
              fieldSchema = fieldSchema.min(rule.value, rule.message);
              break;
          }
        });
      } else if (field.required) {
        fieldSchema = fieldSchema.required(`${field.label} is required`);
      }

      schemaFields[field.id] = fieldSchema;
    });

    return object(schemaFields);
  };

  // Check if field should be visible based on dependencies
  const isFieldVisible = (field, values) => {
    if (!field.dependsOn) return true;

    const { fieldId, condition, value } = field.dependsOn;
    const dependentValue = values[fieldId];

    switch (condition) {
      case 'equals':
        return dependentValue === value;
      default:
        return true;
    }
  };

  // Render field based on type
  const renderField = (field, errors, touched, values) => {
    if (!isFieldVisible(field, values)) return null;

    const fieldError = Boolean(errors[field.id]) && Boolean(touched[field.id]);
    const helperText = Boolean(touched[field.id]) && errors[field.id];

    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth error={fieldError} key={field.id}>
            <InputLabel>{field.label}</InputLabel>
            <Field name={field.id}>
              {({ field: formikField }) => (
                <Select {...formikField} label={field.label} variant="outlined">
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Field>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Field name={field.id}>
                {({ field: formikField }) => <Checkbox {...formikField} checked={formikField.value} color="primary" />}
              </Field>
            }
            label={field.label}
          />
        );

      case 'date':
        return (
          <Field
            key={field.id}
            name={field.id}
            as={TextField}
            type="date"
            variant="outlined"
            color="primary"
            label={field.label}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={fieldError}
            helperText={helperText}
          />
        );

      case 'number':
        return (
          <Field
            key={field.id}
            name={field.id}
            as={TextField}
            type="number"
            variant="outlined"
            color="primary"
            label={field.label}
            placeholder={field.placeholder}
            fullWidth
            error={fieldError}
            helperText={helperText}
          />
        );

      default: // text, email, etc.
        return (
          <Field
            key={field.id}
            name={field.id}
            type={field.type}
            as={TextField}
            variant="outlined"
            color="primary"
            label={field.label}
            placeholder={field.placeholder}
            fullWidth
            error={fieldError}
            helperText={helperText}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        height={'100vh'}
        flexDirection="column"
        backgroundColor="#f5f5f5"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Loading form configuration...
        </Typography>
      </Box>
    );
  }

  return (
    formConfig && (
      <div className="MaterialForm">
        <Box width={'50%'} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={formApi}>
            Api Call
          </Button>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          {formConfig.title}
        </Typography>

        <Formik
          initialValues={generateInitialValues()}
          validationSchema={generateValidationSchema()}
          onSubmit={(values, formikHelpers) => {
            console.log('Form submitted:', values);
            setTimeout(() => {
              formikHelpers.setSubmitting(false);
              formikHelpers.resetForm();
            }, 2000);
          }}
        >
          {({ errors, isValid, touched, dirty, values, isSubmitting }) => (
            <Form>
              {formConfig?.fields?.map((field) => (
                <Box key={field.id}>
                  {renderField(field, errors, touched, values)}
                  <Box height={16} />
                </Box>
              ))}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!isValid || !dirty || isSubmitting}
                fullWidth
              >
                {isSubmitting ? formConfig?.submitButton?.loadingText : formConfig?.submitButton?.text}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    )
  );
};

export default FormMain;
