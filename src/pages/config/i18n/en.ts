export const en = {
  common: {
    copy: "Copy",
    copied: "Copied",
    copySuccess: "Document copied to clipboard",
    copyDocs: "Copy docs",
    className: "Supports string | string[] | boolean | null | undefined | Record<string,string | string[]>",
  },
  home: {
    title: "Plain UI",
    description:
      "Plain is a lightweight, highly reusable, low-intrusion foundational UI component library. It features minimalist preset styles while preserving native layout characteristics, balancing generality and customization flexibility.",
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

      sectionTitles: {
        dropdownMenuProps: "DropdownMenu Props",
        dropdownMenuTriggerProps: "DropdownMenuTrigger Props",
        dropdownMenuContentProps: "DropdownMenuContent Props",
        dropdownMenuItemProps: "DropdownMenuItem Props",
        dropdownMenuSeparatorProps: "DropdownMenuSeparator Props",
      },
      dropdownMenuProps: {
        children: "Child components",
      },
      triggerProps: {
        children: "Trigger content",
        disabled: "Whether disabled",
        variant: "Button style variant",
      },
      contentProps: {
        children: "Menu content",

        popover: "Popover mode",
        side: "Popup side",
        align: "Alignment",
      },
      itemProps: {
        children: "Menu item content",

        onClick: "Click callback",
        disabled: "Whether disabled",
      },
      separatorProps: {},
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
        itemProps: "Internal wrapped props pass-through config",
      },
      itemProps: {
        value: "Unique identifier (required)",
        label: "Label content (required)",
        itemProps: "Internal wrapped props pass-through config",
      },
      itemPropsConfig: {
        trigger: "Trigger button props",
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
        rootMargin: "Root margin for IntersectionObserver (top right bottom left)",
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
      description: "Checkbox and Toggle have the same logic. You can switch between them by using the variants prop. When using text variant, Checkbox is displayed, otherwise Toggle is displayed."
    },
    anatomy: {
      group: "Group",
      checkbox: "Checkbox",
      indicator: "Indicator",
    },
    api: {

      sectionTitles: {
        checkboxGroupProps: "Checkbox.Group Props",
        checkboxProps: "Checkbox Props",
        itemPropsConfig: "itemProps Config",
      },
      groupProps: {
        value: "Selected values (controlled mode)",
        defaultValue: "Initial selected values (uncontrolled mode)",
        onValueChange: "Value change callback",
        disabled: "Whether to disable entire group",
        invalid: "Mark group as invalid",
        name: "Form field name",
      },
      props: {
        value: "Checkbox value (required)",
        onCheckedChange: "Checked state change callback",
        disabled: "Whether disabled",
        variant: "Style variant",
        indicator: "Indicator config",
        toggle: "Toggle mode",
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

      sectionTitles: {
        descriptionProps: "Description Props",
      },
      props: {
        as: "HTML tag to render",
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
        itemProps: "Internal wrapped property passthrough",
      },
      itemPropsConfig: {
        group: "Group container `<div>` props",
        label: "Label `<label>` props",
        error: "Error `<div>` props",
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
      },
      radioProps: {
        value: "Option value",
        disabled: "Whether disabled",
        indicator: "Indicator config",
      },
      itemPropsConfig: {
        group: "Group container `<div>` props",
        radio: "Radio `<label>` props",
        indicator: "Indicator `<span>` props",
      },
    },
  },

  dialog: {
    title: "Dialog",
    description: "Dialog component for displaying modal content.",
    basic: {
      title: "Basic",
    },
    withTrigger: {
      title: "Custom Trigger",
    },
    withClose: {
      title: "Close Button",
    },
    anatomy: {
      dialog: "Dialog",
      content: "Content",
      close: "Close Button",
    },
    api: {

      sectionTitles: {
        dialogProps: "Dialog Props",
        contentProps: "Dialog.Content Props",
        triggerProps: "Dialog.Trigger Props",
        closeProps: "Dialog.Close Props",
      },
      props: {
        children: "Child components",
        showCloseButton: "Show close button",
      },
    },
  },
};
