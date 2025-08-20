export const formData = {
  title: 'Employee Registration',
  fields: [
    {
      id: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'First name is required',
        },
        {
          type: 'minLength',
          value: 2,
          message: 'Must be at least 2 characters',
        },
      ],
    },
    {
      id: 'department',
      type: 'select',
      label: 'Department',
      options: [
        {
          value: 'engineering',
          label: 'Engineering',
        },
        {
          value: 'marketing',
          label: 'Marketing',
        },
        {
          value: 'sales',
          label: 'Sales',
        },
      ],
      required: true,
    },
    {
      id: 'programmingLanguage',
      type: 'select',
      label: 'Primary Programming Language',
      options: [
        {
          value: 'javascript',
          label: 'JavaScript',
        },
        {
          value: 'python',
          label: 'Python',
        },
        {
          value: 'java',
          label: 'Java',
        },
      ],
      dependsOn: {
        fieldId: 'department',
        condition: 'equals',
        value: 'engineering',
      },
    },
    {
      id: 'experience',
      type: 'number',
      label: 'Years of Experience',
      placeholder: 'Enter years',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Experience is required',
        },
      ],
    },
    {
      id: 'remoteWork',
      type: 'checkbox',
      label: 'Open to remote work',
      required: false,
    },
    {
      id: 'startDate',
      type: 'date',
      label: 'Preferred Start Date',
      required: true,
      validation: [
        {
          type: 'required',
          message: 'Start date is required',
        },
      ],
    },
  ],
  submitButton: {
    text: 'Submit Registration',
    loadingText: 'Submitting...',
  },
};
