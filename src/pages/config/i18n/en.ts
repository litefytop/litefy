export const en = {
  common: {
    copy: "Copy",
    copied: "Copied",
    copySuccess: "Document copied to clipboard",
    copyDocs: "Copy docs",
    className:
      "Supports string | string[] | boolean | null | undefined | Record<string,string | string[]>",
    prop: "Property",
    type: "Type",
    default: "Default",
    description: "Description",
  },
  home: {
    title: "Litefy UI",
    description:
      "Litefy is a lightweight, highly reusable, low-intrusion foundational UI component library. It features minimalist preset styles while preserving native layout characteristics, balancing generality and customization flexibility.",
    subDescription:
      "No redundant style nesting, lightweight volume, supports on-demand import and style overrides, adapts to mobile/medium-backend scenarios, can quickly integrate with Tailwind and custom theme extensions, meeting rapid business iteration and personalized visual transformation needs.",
  },
  installation: "Installation",
  examples: "Examples",
  anatomy: "Anatomy",
  docs: "Docs",
  api: "API",
  cssClasses: "CSS Classes",
  usage: "Usage",
  demo: "Demo",
  gettingStarted: "Getting Started",
  introduction: "Introduction",
  componentsGroup: "Components",

  components: {
    button: "Button",
    accordion: "Accordion",
    anchor: "Anchor",
    toast: "Toast",
    dialog: "Dialog",
    drawer: "Drawer",
    input: "Input",
    checkbox: "Checkbox",
    slider: "Slider",
    textarea: "Textarea",
    select: "Select",
    loading: "Loading",
    empty: "Empty",
    skeleton: "Skeleton",
    separator: "Separator",
    theme: "Theme",
    title: "Title",
    text: "Text",
    description: "Description",
    spin: "Spin",
    image: "Image",
    watermark: "Watermark",
    show: "Show",
    radio: "Radio",
    label: "Label",
    toggle: "Toggle",
    search: "Search",
    sidebar: "Sidebar",
    paper: "Paper",
    pagination: "Pagination",
    transfer: "Transfer",
    overlay: "Overlay",
    table: "Table",
    sheet: "Sheet",
    dropdown: "Dropdown",
    password: "Password",
    upload: "Upload",
    "date-picker": "DatePicker",
    "number-field": "NumberField",
  },

  "dropdown": {
    title: "Dropdown Menu",
    description: "Dropdown menu component for displaying action lists.",
    basic: {
      title: "Basic",
    },
    side: {
      title: "Side",
      top: "Top",
      bottom: "Bottom",
    },
    align: {
      title: "Align",
      start: "Start",
      center: "Center",
      end: "End",
    },
    anatomy: {
      root: "Root",
      trigger: "Trigger",
      content: "Content",
      item: "Item",
      separator: "Separator",
      label: "Label",
    },
    api: {
      sectionTitles: {
        dropdownProps: "dropdown Props",
        dropdownTriggerProps: "dropdownTrigger Props",
        dropdownContentProps: "dropdownContent Props",
        dropdownItemProps: "dropdownItem Props",
        dropdownSeparatorProps: "dropdownSeparator Props",
        dropdownLabelProps: "dropdownLabel Props",
      },
      dropdownProps: {
        children: "Child components",
      },
      triggerProps: {
        children: "Trigger content",
        target: "Associated Content ID",
      },
      contentProps: {
        children: "Menu content",
        popover: "Popover mode",
        alignX: "Horizontal alignment",
        alignY: "Vertical alignment",
      },
      itemProps: {
        children: "Menu item content",
        onClick: "Click callback",
      },
      separatorProps: {},
      labelProps: {},
    },
  },

  accordion: {
    title: "Accordion",
    description:
      "Accordion component for displaying collapsible content areas.",
    basic: {
      title: "Basic",
    },
    multiple: {
      title: "Multiple",
    },
    controlled: {
      title: "Controlled",
    },
    icon: {
      title: "Custom Icon",
    },
    anatomy: {
      title: "Anatomy",
      accordion: "Accordion",
      item: "Accordion.Item",
      root: "Root",
      titleLabel: "Title Label",
      content: "Content",
    },
    api: {
      props: {
        defaultOpenKeys: "Initially expanded keys (uncontrolled)",
        openKeys: "Currently expanded keys (controlled)",
        onOpenChange: "Callback when expansion state changes",
        allowMultiple: "Whether to allow multiple expansions",
        itemProps: "Internal wrapped props pass-through config",
        icon: "Custom expand/collapse icon",
      },
      itemProps: {
        value: "Unique identifier (required)",
        label: "Label content (required)",
        itemProps: "Internal wrapped props pass-through config",
        icon: "Custom icon (overrides Accordion icon)",
      },
      itemPropsConfig: {
        root: "Root element props",
        label: "Label element props",
        content: "Content area props",
      },

      sectionTitles: {
        accordionProps: "Accordion Props",
        accordionItemProps: "Accordion.Item Props",
        itemPropsConfig: "itemProps Config",
      },
    },
  },

  anchor: {
    title: "Anchor",
    description: "Anchor navigation for quick page positioning.",
    examples: {
      description:
        "By default, the scroll listener monitors the top 20% area of the viewport. Since the example content is an iframe page, to ensure the listener triggers properly, the rootMargin is set to `0px 0px -50% 0px`. Please adjust according to your specific scenario in actual use.",
    },
    scrollBehavior: {
      title: "Scroll Behavior",
      description:
        "By default, the Anchor component listens to the root element. Since the example uses an iframe container, you need to manually specify the root property.",
      note: "Adjust the value based on your header height to ensure the target content won't be covered when clicking anchor links.",
    },
    anatomy: {
      anchor: "Anchor",
      section: "Section",
      item: "Item",
      link: "Link Text",
    },
    api: {
      sectionTitles: {
        anchorProps: "Anchor Props",
        anchorSectionProps: "Anchor.Section Props",
        anchorItemProps: "Anchor.Item Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        rootMargin:
          "Root margin for IntersectionObserver (top right bottom left)",
        root: "Root element for IntersectionObserver. In iframe, defaults to document.documentElement to fix viewport offset issue",
      },
      sectionProps: {
        href: "Anchor target ID (with # prefix, optional)",
        linkText: "Link text",
        itemProps: "Internal wrapped props pass-through",
      },
      itemProps: {
        href: "Anchor target ID (with # prefix)",
      },
      itemPropsConfig: {
        link: "Link `<a>` tag props",
        nav: "Internal navigation `<nav>` container props",
      },
    },
  },

  button: {
    title: "Button",
    description: "Button component for triggering actions.",
    variants: {
      title: "Variants",
      primary: "Primary",
      secondary: "Secondary",
      ghost: "Ghost",
      link: "Link",
    },
    sizes: {
      title: "Sizes",
      sm: "Small",
      md: "Medium",
      lg: "Large",
    },
    disabled: {
      title: "Disabled",
    },
    loading: {
      title: "Loading",
    },
    iconOnly: {
      title: "Icon Only",
    },

    withIcons: {
      title: "With Icons",
    },
    anatomy: {
      button: "Button",
      icon: "Icon",
      spinner: "Spinner",
    },
    api: {
      sectionTitles: {
        buttonProps: "Button Props",
        loadingConfig: "Loading state Config",
      },
      props: {
        variant: "Button style variant",
        loading: "Loading state config",
      },
      loadingConfig: {
        icon: "Icon element props",
        loading: "Loading state",
      },
    },
  },

  toast: {
    title: "Toast",
    description: "Lightweight toast notification component.",
    types: {
      title: "Types",
    },
    descriptionText: {
      title: "With Description",
    },
    duration: {
      title: "Duration",
    },
    icon: {
      title: "Custom Icon",
    },
    actions: {
      title: "Actions",
    },
    position: {
      title: "Position",
    },
    dismiss: {
      title: "Dismiss",
    },
    callbacks: {
      title: "Callbacks",
    },
    anatomy: {
      root: "Root",
      icon: "Icon",
      content: "Content",
      title: "Title",
      description: "Description",
      actions: "Actions",
    },
  },

  checkbox: {
    title: "Checkbox",
    description: "Checkbox component for multi-select.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    disabled: {
      title: "Disabled",
    },

    variants: {
      title: "Variants",
    },
    validation: {
      title: "Validation",
    },
    anatomy: {
      group: "Group",
      label: "Label",
      description: "Description",
      item: "Item",
      indicator: "Indicator",
    },
    api: {
      sectionTitles: {
        checkboxProps: "Checkbox Props",
        checkboxItemProps: "Checkbox.Item Props",
        indicatorConfig: "indicator Config",
        itemPropsConfig: "itemProps Config",
        itemProps: "itemProps Config",
      },
      props: {
        value: "Selected values (controlled mode)",
        defaultValue: "Initial selected values (uncontrolled mode)",
        onValueChange: "Value change callback, can return { invalid?: string } to trigger invalid state",
        invalid: "Invalid state, supports boolean or string type",
        disabled: "Whether to disable entire group",
        name: "Form field name, submits comma-separated string (e.g. a,b,c) when present",
        label: "Label text",
        description: "Description text",
        itemProps: "Internal element props passthrough config",
        options: "Options array for rendering multiple checkboxes",
      },
      item: {
        value: "Checkbox value (required)",
        onCheckedChange: "Checked state change callback",
        disabled: "Whether disabled",
        variant: "Style variant",
        indicator: "Indicator config",
      },
      indicator: {
        checked: "Indicator when checked",
        unchecked: "Indicator when unchecked",
        hidden: "Hide indicator",
        props: "Indicator element props",
      },
      itemProps: {
        root: "Root container `<div>` element props",
        content: "Content container `<div>` element props",
        label: "Label `<label>` element props",
        description: "Description `<small>` element props",
        invalid: "Invalid text `<span>` element props",
        options: "Option item `<button>` element props",
      },
    },
  },

  description: {
    title: "Description",
    description: "Description component for displaying text descriptions.",
    basic: {
      title: "Basic",
    },
    api: {
      sectionTitles: {
        descriptionProps: "Description Props",
      },
    },
  },

  empty: {
    title: "Empty",
    description: "Empty component for displaying empty state prompts.",
    basic: {
      title: "Basic",
    },
    custom: {
      title: "Custom",
    },
    api: {
      sectionTitles: {
        emptyProps: "Empty Props",
      },
      props: {
        defaultIcon: "Default icon",
        defaultText: "Default text",
        className: "Custom CSS class name",
      },
    },
  },

  input: {
    title: "Input",
    description: "Input component for collecting user input.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    disabled: {
      title: "Disabled",
    },
    validation: {
      title: "Validation",
    },
    prefixSuffix: {
      title: "Prefix/Suffix",
    },
    anatomy: {
      group: "Group",
      label: "Label",
      input: "Input",
      leading: "Leading",
      trailing: "Trailing",
      description: "Description",
    },
    api: {
      sectionTitles: {
        inputProps: "Input Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onChange: "Value change callback, can return { invalid?: string } to trigger invalid state",
        placeholder: "Placeholder",
        type: "Input type",
        invalid: "Invalid message",
        label: "Label text",
        description: "Description text",
        leading: "Leading content",
        trailing: "Trailing content",
        itemProps: "Internal wrapped property passthrough",
      },
      itemPropsConfig: {
        group: "Group container `<div>` props",
        label: "Label `<label>` props",
        invalid: "Invalid `<small>` props",
        leading: "Leading container `<span>` props",
        trailing: "Trailing container `<span>` props",
        description: "Description `<small>` props",
      },
    },
  },

  password: {
    title: "Password",
    description: "Password input component.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    validation: {
      title: "Validation",
    },
    anatomy: {
      root: "Root",
      input: "Input",
      toggle: "Toggle Button",
    },
    api: {
      sectionTitles: {
        passwordProps: "Password Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onChange: "Value change callback, can return { invalid?: string } to trigger invalid state",
        label: "Label text",
        description: "Description text",
        invalid: "Invalid message",
        leading: "Leading content",
        trailing: "Trailing content",
        placeholder: "Placeholder",
        disabled: "Whether disabled",
        itemProps: "Internal wrapped property passthrough",
      },
      itemPropsConfig: {
        root: "Root container `<div>` props",
        label: "Label `<label>` props",
        group: "Input group `<div>` props",
        leading: "Leading `<span>` props",
        trailing: "Trailing `<span>` props",
        invalid: "Invalid `<div>` props",
        description: "Description `<small>` props",
        toggle: "Toggle button `<button>` props",
      },
    },
  },

  slider: {
    title: "Slider",
    description: "Slider component for selecting a value within a range.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    orientation: {
      title: "Orientation",
    },
    anatomy: {
      input: "Slider",
    },
    api: {
      sectionTitles: {
        sliderProps: "Slider Props",
      },
      props: {
        value: "Current value (controlled mode)",
        defaultValue: "Initial value (uncontrolled mode)",
        orientation: "Orientation: horizontal or vertical",
        disabled: "Whether disabled",
      },
    },
  },

  textarea: {
    title: "Textarea",
    description: "Multi-line text input component for collecting user input.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    validation: {
      title: "Validation",
    },
    disabled: {
      title: "Disabled",
    },
    anatomy: {
      root: "Root",
      label: "Label",
      textarea: "Textarea",
      description: "Description",
    },
    api: {
      sectionTitles: {
        textareaProps: "Textarea Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onChange: "Value change callback, can return { invalid?: string } to trigger invalid state",
        placeholder: "Placeholder text",
        disabled: "Whether disabled",
        invalid: "Invalid message",
        label: "Label text",
        description: "Description text",
        itemProps: "Internal props passthrough",
      },
      itemPropsConfig: {
        root: "Root container `<div>` props",
        label: "Label `<label>` props",
        invalid: "Invalid `<small>` props",
        description: "Description `<small>` props",
      },
    },
  },

  upload: {
    title: "Upload",
    description: "File upload component with custom validation support.",
    basic: {
      title: "Basic",
    },
    validation: {
      title: "Validation",
    },
    multiple: {
      title: "Multiple",
    },
    disabled: {
      title: "Disabled",
    },
    anatomy: {
      root: "Root",
      label: "Label",
      input: "Input",
      description: "Description",
    },
    api: {
      sectionTitles: {
        uploadProps: "Upload Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        label: "Label text",
        description: "Description text",
        invalid: "Invalid message",
        disabled: "Whether disabled",
        multiple: "Whether multiple files allowed",
        accept: "Accepted file types",
        onChange: "Value change callback, can return { invalid?: string } to trigger invalid state",
        itemProps: "Internal wrapped property passthrough",
      },
      itemPropsConfig: {
        root: "Root container `<div>` props",
        label: "Label `<label>` props",
        description: "Description `<small>` props",
        invalid: "Invalid `<small>` props",
      },
    },
  },

  "date-picker": {
    title: "Date Picker",
    description: "Date input component.",
    basic: {
      title: "Basic",
    },
    type: {
      title: "Type",
    },
    disabled: {
      title: "Disabled",
    },
    anatomy: {
      root: "Root",
      label: "Label",
      input: "Input",
      description: "Description",
    },
    api: {
      sectionTitles: {
        datePickerProps: "DatePicker Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        label: "Label text",
        description: "Description text",
        invalid: "Invalid message",
        placeholder: "Placeholder",
        type: "Input type",
        onChange: "Value change callback, can return { invalid?: string } to trigger invalid state",
        itemProps: "Internal wrapped property passthrough",
      },
      itemPropsConfig: {
        root: "Root container `<div>` props",
        label: "Label `<label>` props",
        description: "Description `<small>` props",
        invalid: "Invalid `<small>` props",
      },
    },
    valueNote: "Value Mapping",

  },

  select: {
    title: "Select",
    description: "Select component for selecting from options.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    validation: {
      title: "Validation",
    },
    disabled: {
      title: "Disabled",
    },
    group: {
      title: "Group",
    },
    multiple: {
      title: "Multiple",
    },
    anatomy: {
      root: "Root",
      label: "Label",
      group: "Select Group",
      select: "Select",
      leading: "Leading",
      trailing: "Trailing",
      invalid: "Invalid",
      description: "Description",
    },
    api: {
      sectionTitles: {
        selectProps: "Select Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        value: "Selected value (controlled mode)",
        defaultValue: "Initial selected value (uncontrolled mode)",
        onChange: "Value change callback",
        options: "Options list (supports flat or grouped)",
        placeholder: "Placeholder",
        disabled: "Whether disabled",
        multiple: "Whether multiple",
        invalid: "Invalid message",
        label: "Label text",
        description: "Description text",
        leading: "Leading content",
        trailing: "Trailing content",
        itemProps: "Internal wrapped property passthrough",
      },
      itemPropsConfig: {
        group: "Select group `<div>` props",
        label: "Label `<label>` props",
        invalid: "Invalid message `<div>` props",
        description: "Description `<small>` props",
        leading: "Leading `<span>` props",
        trailing: "Trailing `<span>` props",
      },
    },
  },

  radio: {
    title: "Radio",
    description: "Radio component for single selection.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    disabled: {
      title: "Disabled",
    },
    variant: {
      title: "Variant",
    },
    validation: {
      title: "Validation",
    },
    anatomy: {
      group: "Group",
      label: "Label",
      description: "Description",
      item: "Item",
      indicator: "Indicator",
    },
    api: {
      sectionTitles: {
        radioProps: "Radio Props",
        radioItemProps: "Radio.Item Props",
        itemPropsConfig: "itemProps Config",
        itemProps: "itemProps Config",
      },
      props: {
        value: "Selected value (controlled mode)",
        defaultValue: "Initial selected value (uncontrolled mode)",
        onValueChange: "Value change callback, can return { invalid?: string } to trigger invalid state",
        invalid: "Invalid state, supports boolean or string type",
        disabled: "Whether disabled",
        name: "Form field name",
        label: "Label text",
        description: "Description text",
        itemProps: "Internal element props passthrough config",
        options: "Options array for rendering multiple radio buttons",
      },
      item: {
        value: "Option value",
        onCheckedChange: "Checked state change callback",
        disabled: "Whether disabled",
        variant: "Style variant (radio | segment)",
        indicator: "Indicator config",
      },
      itemProps: {
        root: "Root container `<div>` element props",
        content: "Content container `<div>` element props",
        label: "Label `<label>` element props",
        description: "Description `<small>` element props",
        invalid: "Invalid text `<span>` element props",
        options: "Option item `<button>` element props",
      },
    },
  },

  dialog: {
    title: "Dialog",
    description: "Dialog component for displaying modal content.",
    basic: {
      title: "Basic",
    },
    api: {
      sectionTitles: {
        dialogProps: "Dialog Props",
      },
    },
  },

  drawer: {
    title: "Drawer",
    description: "Drawer component for displaying slide-in content.",
    basic: {
      title: "Basic",
    },
    api: {
      sectionTitles: {
        drawerRef: "DrawerRef",
        drawerProps: "Drawer Props",
      },
      props: {
        show: "Open the drawer",
        close: "Close the drawer",
        placement: "Drawer placement",
      },
    },
  },

  "number-field": {
    title: "NumberField",
    description: "Number input component with increment/decrement buttons.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    minMax: {
      title: "Min/Max",
    },
    step: {
      title: "Step",
    },
    disabled: {
      title: "Disabled",
    },
    validation: {
      title: "Validation",
    },
    anatomy: {
      root: "Root",
      label: "Label",
      group: "Group",
      btn: "Button",
      input: "Input",
      desc: "Description",
    },
    api: {
      sectionTitles: {
        numberFieldProps: "NumberField Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onValueChange: "Value change callback, can return { invalid?: string } to trigger invalid state",
        label: "Label text",
        description: "Description text",
        invalid: "Invalid message",
        min: "Minimum value",
        max: "Maximum value",
        step: "Step increment",
        disabled: "Whether disabled",
        itemProps: "Internal wrapped props pass-through",
      },
      itemPropsConfig: {
        root: "Root container `<div>` props",
        label: "Label `<label>` props",
        group: "Input group `<div>` props",
        btn: "Button `<button>` props",
        desc: "Description `<small>` props",
        error: "Error message `<small>` props",
      },
    },
  },
};
