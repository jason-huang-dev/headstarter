
const colorsForEvent = [
    { color: "#15803d", label: "1" },
    { color: "#FFC876", label: "2" },
    { color: "#FF776F", label: "3" },
    { color: "#7ADB78", label: "4" },
    { color: "#858DFF", label: "5" },
    { color: "#FF98E2", label: "6" },
];
  
const calendarForm = [
    {
      label: 'Calendar Name',
      type: 'text',
      name: 'title',
      placeholder: 'Enter calendar name',
      maxLength: 15, // Add maxLength here
      validate: (value) => value.trim() !== '' || 'Calendar Name is required.',
      required: true,
    },
    {
      label: 'Add People?',
      labelAfter: true,
      name: 'addPeople',
      type: 'checkbox',
      className:"flex items-center",
      onChange: (e, formDetails, setFormDetails) => {
        const { name, checked } = e.target;
        setFormDetails({ ...formDetails, addPeople: e.target.checked });
        if (name === 'addPeople' && !checked) {
          setFormDetails({ ...formDetails, emails: '', addPeople: e.target.checked });
        }
      },
    },
    {
      label: 'Send Email Invitations:',
      name: 'emails',
      type: 'email',
      ifPrev: true,
      placeholder: 'Enter emails and press Enter',
      validate: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
      },
      onKeyDown: (e, formDetails, setFormDetails, validate) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (formDetails.emails.trim() && validate(formDetails.emails.trim())) {
            setFormDetails({
              ...formDetails,
              email_list: [...formDetails.email_list, formDetails.emails.trim()],
              emails: ''
            });
          } else {
            alert("Please enter a valid email address.");
          }
        }
      }
    },
];
  
const eventForm = (calendars) => [
    {
      label: "Calendar",
      type: "select",
      name: "cal_id",
      options: calendars, // Update options as needed
      option_label: "title",
      option_key: "cal_id"
    },
    { label: 'Event Title', type: 'text', name: 'title' },
    { label: 'Start Date & Time', name: 'start', type: 'datetime-local' },
    { label: 'End Date & Time', name: 'end', type: 'datetime-local' },
];

const chronyAIForm = () => [
  {
    label: 'User Input',
    type: 'text',
    name: 'user_message'
  }
]

const importExportForm = () => [
  {
    label: 'Calendar Name',
    type: 'text',
    name: 'title',
    placeholder: 'Enter calendar name',
    maxLength: 15, // Add maxLength here
    validate: (value) => value.trim() !== '' || 'Calendar Name is required.',
    required: true,
  },
  {
    label: 'Import',
    labelAfter: true,
    name: 'import_cal',
    type: 'checkbox',
    className:"flex items-center",
    onChange: (e, formDetails, setFormDetails) => {
      const { name, checked } = e.target;
      setFormDetails({ ...formDetails, import_cal: e.target.checked });
      if (name === 'import_cal' && !checked) {
        setFormDetails({ ...formDetails, ics_file: null, import_cal: e.target.checked });
      }
    },
  },
  {type: 'file', name: 'ics_file' , accept: ".ics", ifPrev: true},
];

const importExportFormFields = {
  title: '',
  import_cal: false,
  ics_file: null,
}

export {calendarForm, eventForm, colorsForEvent, chronyAIForm, importExportForm, importExportFormFields}