export const en = {
  common: {
    copy: "Copy",
    copied: "Copied",
    copySuccess: "Document copied to clipboard",
    copyDocs: "Copy docs",
  },
  home: {
    title: "Plain UI",
    description: "Plain is a lightweight, highly reusable, low-intrusion foundational UI component library. It features minimalist preset styles while preserving native layout characteristics, balancing generality and customization flexibility.",
    subDescription: "No redundant style nesting, lightweight volume, supports on-demand import and style overrides, adapts to mobile/medium-backend scenarios, can quickly integrate with Tailwind and custom theme extensions, meeting rapid business iteration and personalized visual transformation needs.",
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
    field: "Field",
    spin: "Spin",
    img: "Image",
    watermark: "Watermark",
    show: "Show",
    "input-group": "Input Group",
    radio: "Radio",
    label: "Label",
    segment: "Segment",
    form: "Form",
    toggle: "Toggle",
    search: "Search",
    sidebar: "Sidebar",
    paper: "Paper",
    pagination: "Pagination",
    transfer: "Transfer",
    overlay: "Overlay",
    table: "Table",
    sheet: "Sheet",
    "dropdown-menu": "Dropdown Menu",
    password: "Password",
    "code-block": "Code Block",
  },

  "dropdown-menu": {
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
    },
    api: {
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
      },
      sectionTitles: {
        dropdownMenuProps: "DropdownMenu Props",
        dropdownMenuTriggerProps: "DropdownMenuTrigger Props",
        dropdownMenuContentProps: "DropdownMenuContent Props",
        dropdownMenuItemProps: "DropdownMenuItem Props",
        dropdownMenuSeparatorProps: "DropdownMenuSeparator Props",
      },
      dropdownMenuProps: {
        children: "Child components",
        className: "Custom class name",
      },
      triggerProps: {
        children: "Trigger content",
        className: "Custom class name",
        disabled: "Whether disabled",
        variant: "Button style variant",
      },
      contentProps: {
        children: "Menu content",
        className: "Custom class name",
        popover: "Popover mode",
        side: "Popup side",
        align: "Alignment",
      },
      itemProps: {
        children: "Menu item content",
        className: "Custom class name",
        onClick: "Click callback",
        disabled: "Whether disabled",
      },
      separatorProps: {
        className: "Custom class name",
      },
    },
  },

  accordion: {
    title: "Accordion",
    description: "Accordion component for displaying collapsible content areas.",
    basic: {
      title: "Basic",
    },
    multiple: {
      title: "Multiple",
    },
    controlled: {
      title: "Controlled",
    },
    anatomy: {
      title: "Anatomy",
      accordion: "Accordion",
      item: "Item",
      trigger: "Trigger",
      titleLabel: "Title Label",
      content: "Content",
    },
    api: {
      props: {
        defaultOpenKeys: "Initially expanded keys (uncontrolled)",
        openKeys: "Currently expanded keys (controlled)",
        onOpenChange: "Callback when expansion state changes",
        allowMultiple: "Whether to allow multiple expansions",
        className: "Custom class name",
        itemProps: "Internal wrapped props pass-through config",
      },
      itemProps: {
        value: "Unique identifier (required)",
        title: "Title content (required)",
        children: "Content after expansion",
        className: "Custom class name",
        itemProps: "Internal wrapped props pass-through config",
      },
      itemPropsConfig: {
        trigger: "Trigger button props",
        title: "Title element props",
        content: "Content area props",
      },
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
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
    basic: {
      title: "Basic",
    },
    withSections: {
      title: "With Sections",
    },
    scrollBehavior: {
      title: "Scroll Behavior",
      description: "The Anchor component uses CSS scroll-margin-top for proper scroll positioning. When using anchor navigation, you need to add scroll-margin-top style to your target elements:",
      note: "Adjust the value based on your header height to ensure the target content won't be covered when clicking anchor links.",
    },
    anatomy: {
      anchor: "Anchor",
      section: "Section",
      item: "Item",
      link: "Link",
    },
    api: {
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
      },
      sectionTitles: {
        anchorProps: "Anchor Props",
        anchorSectionProps: "Anchor.Section Props",
        anchorItemProps: "Anchor.Item Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        className: "Custom class name",
        children: "Child components",
      },
      sectionProps: {
        href: "Anchor target ID (with # prefix, optional)",
        title: "Section title",
        children: "Child anchor items",
        className: "Custom class name",
        itemProps: "Internal wrapped props pass-through",
      },
      itemProps: {
        href: "Anchor target ID (with # prefix)",
        children: "Link text",
        className: "Custom class name",
        onClick: "Click callback",
      },
      itemPropsConfig: {
        title: "Title `<a>` tag props",
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
    direction: {
      title: "Direction",
      ltr: "Left to Right",
      rtl: "Right to Left",
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
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
      },
      sectionTitles: {
        buttonProps: "Button Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        variant: "Button style variant",
        size: "Button size",
        disabled: "Whether disabled",
        loading: "Whether to show loading state",
        children: "Button content",
        className: "Custom class name",
        itemProps: "Internal wrapped props pass-through",
      },
      itemPropsConfig: {
        icon: "Icon element props",
        spinner: "Loading spinner element props",
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
    direction: {
      title: "Direction",
      horizontal: "Horizontal",
      vertical: "Vertical",
    },
    variants: {
      title: "Variants",
      default: "Default",
      squared: "Squared",
    },
    anatomy: {
      group: "Group",
      checkbox: "Checkbox",
      indicator: "Indicator",
    },
    api: {
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
      },
      sectionTitles: {
        checkboxGroupProps: "Checkbox.Group Props",
        checkboxProps: "Checkbox Props",
        itemPropsConfig: "itemProps Config",
      },
      groupProps: {
        className: "Custom class name",
        children: "Child components",
        value: "Selected values (controlled mode)",
        defaultValue: "Initial selected values (uncontrolled mode)",
        onValueChange: "Value change callback",
        disabled: "Whether to disable entire group",
      },
      props: {
        value: "Checkbox value (required)",
        checked: "Whether checked (controlled mode)",
        defaultChecked: "Initially checked (uncontrolled mode)",
        onCheckedChange: "Checked state change callback",
        disabled: "Whether disabled",
        variant: "Style variant",
        className: "Custom class name",
        indicator: "Indicator config",
        children: "Checkbox text",
        itemProps: "Internal wrapped props pass-through",
      },
      itemPropsConfig: {
        indicator: "Indicator element props",
        label: "Label element props",
      },
    },
  },

  description: {
    title: "Description",
    description: "Description component for displaying text descriptions.",
    basic: {
      title: "Basic",
    },
    anatomy: {
      description: "Description",
      title: "Title",
      content: "Content",
    },
    api: {
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
      },
      sectionTitles: {
        descriptionProps: "Description Props",
      },
      props: {
        as: "HTML tag to render",
        className: "Custom class name",
        children: "Child components",
      },
    },
  },

  input: {
    title: "Input",
    description: "Input component for collecting user input.",
    basic: {
      title: "Basic",
    },
    disabled: {
      title: "Disabled",
    },
    error: {
      title: "Error",
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
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
      },
      sectionTitles: {
        inputProps: "Input Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onChange: "Value change callback",
        placeholder: "Placeholder",
        disabled: "Whether disabled",
        error: "Whether to show error state",
        label: "Label text",
        description: "Description text",
        leading: "Leading content",
        trailing: "Trailing content",
        className: "Custom class name",
        itemProps: "Internal wrapped property passthrough",
      },
      itemPropsConfig: {
        group: "Group container `<div>` props",
        label: "Label `<label>` props",
        input: "Input `<input>` props",
        leading: "Leading container `<span>` props",
        trailing: "Trailing container `<span>` props",
        description: "Description `<p>` props",
      },
    },
  },

  password: {
    title: "Password",
    description: "Password input component.",
    basic: {
      title: "Basic",
    },
    anatomy: {
      root: "Root",
      input: "Input",
      toggle: "Toggle Button",
    },
    api: {
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
      },
      sectionTitles: {
        passwordProps: "Password Props",
        itemPropsConfig: "itemProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onChange: "Value change callback",
        placeholder: "Placeholder",
        disabled: "Whether disabled",
        className: "Custom class name",
        itemProps: "Internal wrapped property passthrough",
      },
      itemPropsConfig: {
        root: "Root container `<div>` props",
        input: "Input `<input>` props",
        toggle: "Toggle button `<button>` props",
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
    direction: {
      title: "Direction",
      horizontal: "Horizontal",
      vertical: "Vertical",
    },
    variants: {
      title: "Variants",
      default: "Default",
      filled: "Filled",
    },
    anatomy: {
      radio: "Radio",
      group: "RadioGroup",
      indicator: "Indicator",
    },
    api: {
      headers: {
        prop: "Prop",
        type: "Type",
        default: "Default",
        description: "Description",
        property: "Property",
      },
      sectionTitles: {
        radioGroupProps: "RadioGroup Props",
        radioProps: "Radio Props",
        itemPropsConfig: "itemProps Config",
      },
      radioGroupProps: {
        value: "Selected value (controlled mode)",
        defaultValue: "Initial selected value (uncontrolled mode)",
        onChange: "Value change callback",
        disabled: "Whether disabled",
        direction: "Arrangement direction",
        className: "Custom class name",
      },
      radioProps: {
        value: "Option value",
        disabled: "Whether disabled",
        className: "Custom class name",
        indicator: "Indicator config",
      },
      itemPropsConfig: {
        group: "Group container `<div>` props",
        radio: "Radio `<label>` props",
        indicator: "Indicator `<span>` props",
      },
    },
  },
};
