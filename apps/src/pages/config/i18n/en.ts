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
    theme: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
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
  api: "API Reference",
  cssClasses: "CSS Classes",
  usage: "Usage",
  demo: "Demo",
  gettingStarted: "Getting Started",
  introduction: "Introduction",
  componentsGroup: "Components",

  components: {
    "paginated-view":"PaginatedView",
    form: "Form",
    button: "Button",
    accordion: "Accordion",
    anchor: "Anchor",
    carousel: "Carousel",
    toast: "Toast",
    tooltip: "Tooltip",
    dialog: "Dialog",
    drawer: "Drawer",
    input: "Input",
    checkbox: "Checkbox",
    slider: "Slider",
    textarea: "Textarea",
    tabs: "Tabs",
    select: "Select",
    loading: "Loading",
    empty: "Empty",
    separator: "Separator",
    theme: "Theme",
    title: "Title",
    description: "Description",
    "virtual-scroll": "VirtualScroll",
    spin: "Spin",
    image: "Image",
    watermark: "Watermark",
    radio: "Radio",
    label: "Label",
    combobox: "Combobox",
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
    progress: "Progress",
  },

  dropdown: {
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
      slotProps: {
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
      "Controlled accordion component with state management for precise expand/collapse behavior.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled Mode",
    },
    multiple: {
      title: "Multiple",
    },
    icon: {
      title: "Custom Icon",
    },
    disabled: {
      title: "Disabled",
    },
    anatomy: {
      wrapper: "Wrapper",
      trigger: "Trigger",
      content: "Content",
    },
    api: {
      props: {
        defaultOpenKeys: "Default expanded keys array",
        openKeys: "Controlled expanded keys array",
        onOpenChange: "Callback when expanded state changes",
        allowMultiple: "Allow multiple selection",
        icon: "Custom expand/collapse icon",
      },
      itemProps: {
        value: "Unique identifier (required)",
        label: "Label text",
        icon: "Custom expand/collapse icon",
        slotProps: "Internal wrapped props pass-through config",
        disabled: "Is disabled",
       children: "Content area",
      },
      slotPropsConfig: {
        wrapper: "Wrapper element props",
        trigger: "Trigger element props",
        content: "Content area props",
      },
      sectionTitles: {
        accordionProps: "Accordion Props",
        accordionItemProps: "Accordion.Item Props",
        slotPropsConfig: "slotProps Config",
      },
    },
  },

  anchor: {
    title: "Anchor",
    description: "Anchor navigation for quick page positioning.",


    anatomy: {
     
      section: {
        wrapper: "Section Wrapper",
        link:"Section link",
        subList:"Section sub-list",
      },
      item: {
        wrapper: "Item Wrapper",
        link: "Item link",
      },
    },
    api: {
      sectionTitles: {
        anchorProps: "Anchor Props",
        anchorSectionProps: "Anchor.Section Props",
        anchorItemProps: "Anchor.Item Props",
        sectionSlotPropsConfig: "Section slotProps Config",
        itemSlotPropsConfig: "Item slotProps Config",
      },
      props: {
        rootMargin:
          "Root margin for IntersectionObserver (top right bottom left)",
        root: "Root element for IntersectionObserver.",
      },
      sectionProps: {
        href: "Anchor target ID (with # prefix, optional)",
        linkText: "Link text",
        children: "Section content",
        slotProps: "Internal wrapped props pass-through config",
      },
      itemProps: {
        children:"Item content",
        href: "Anchor target ID (with # prefix)",
      },
      sectionSlotPropsConfig: {
        wrapper: "Section wrapper `<li>` element props",
        link: "Link `<a>` tag props",
        subList: "Section sub-list `<ul>` container props",
      },
      itemSlotPropsConfig: {
        wrapper: "Item wrapper `<li>` element props",
        link: "Link `<a>` tag props",
      },
    },
    usageNotes: {
      title: "Anchor Mounting Guidelines",
      description: "Anchors should be mounted on title elements rather than parent containers to avoid always observing the parent container, which can cause activation state issues.",
      points: {
        sameLevel: "It is recommended to mount anchor targets at the same level as titles for a clear structure.",
        discontinuous: "Mounting on parent containers is acceptable if you can tolerate discontinuous anchor activation areas.",
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
    api: {
      sectionTitles: {
        toastOptions: "Toast Options",
        toasterProps: "Toaster Props",
      },
      toastOptions: {
        type: "Toast type",
        title: "Title",
        description: "Description",
        icon: "Custom icon",
        duration:
          "Duration in milliseconds, set to Infinity to never auto-dismiss",
        onDismiss: "Callback when dismissed",
        onAutoClose: "Callback when auto-closed",
        actions: "Action buttons array",
      },
      toasterProps: {
        position: "Toast position",
        visibleToasts: "Maximum number of toasts to show",
      },
    },
  },

  tooltip: {
    title: "Tooltip",
    description: "Tooltip component for displaying hint text on hover or focus.",
    basic: {
      title: "Basic",
    },

    anatomy: {
      root: "Root",
      trigger: "Trigger",
      content: "Content",
    },
    api: {
      sectionTitles: {
        tooltipProps: "Tooltip Props",
      },
      props: {
        children: "Trigger element",
        content: "Tooltip content",
        side: "Tooltip position: top/bottom/left/right",
        disabled: "Whether to disable",
        className: "Custom class name",
        delay: "Hide delay (milliseconds)",
        slotProps: "Slot props for child elements",
      },
      slotProps: {
        trigger: "Trigger element props",
        content: "Content element props",
      },
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
    anatomy: {
      checkbox: "Checkbox",
      label: "Label",
      indicator: "Indicator",
    },
    api: {
      sectionTitles: {
        checkboxProps: "Checkbox Props",
        checkboxGroupProps: "Checkbox.Group Props",
      },
      props: {
        checked: "Checked state (controlled mode)",
        onValueChange: "Checked state change callback",
        value: "Unique identifier (required for group usage)",
        label: "Label text",
        disabled: "Whether disabled",
        variant: 'Style variant ("checkbox" | "toggle")',
        indicator: "Custom indicator renderer function",
        name: "Form field name",
        className: "Custom class name",
      },
      groupProps: {
        defaultValue: "Initial selected values array (uncontrolled mode)",
        value: "Current selected values array (controlled mode)",
        onValueChange: "Value change callback",
        disabled: "Whether to disable entire group",
        name: "Form field name",
        invalid: "Invalid state",
        className: "Custom class name",
      },
    },
  },

  paper: {
    title: "Paper",
    description: "Paper component for creating printable document pages.",
    basic: {
      title: "Basic",
    },
    variants: {
      title: "Variants",
    },

    print: {
      title: "Print",
    },
    api: {
      sectionTitles: {
        paperProviderProps: "PaperProvider Props",
        paperProps: "Paper Props",
      },
      props: {
        children: "Children",
        totalPages: "Total number of pages",
        variant: "Paper size variant",
        orientation: "Page orientation",
        countable: "Whether to include in page indexing",
      },
    },
  },

  combobox: {
    title: "Combobox",
    description: "Combobox component with search and async loading support.",
    basic: {
      title: "Basic",
    },
    async: {
      title: "Async Search",
    },
    disabled: {
      title: "Disabled & Invalid",
    },
    clearable: {
      title: "Clearable",
    },
    anatomy: {
      container: "Container",
      input: "Input",
      clear: "Clear Button",
      dropdown: "Dropdown List",
      option: "Option",
    },
    api: {
      sectionTitles: {
        comboboxProps: "Combobox Props",
        slotProps: "slotProps Config",
      },
      props: {
        value: "Controlled mode value",
        defaultValue: "Uncontrolled mode initial value",
        onChange: "Value change callback",
        onBlur: "Blur callback",
        onSelect: "Option selection callback",
        options: "Options array or async fetch function",
        placeholder: "Placeholder text",
        disabled: "Whether disabled",
        invalid: "Whether invalid state",
        clearable: "Whether show clear button",
        debounceMs: "Debounce delay in milliseconds",
        skeleton: "Custom loading skeleton",
        optionHeight: "Option height in pixels",
        overscan: "Virtual scrolling overscan count",
        slotProps: "Internal element props pass-through",
      },
      slotProps: {
        container: "Container div element props",
        input: "Input element props",
        list: "Dropdown list ul element props",
        option: "Option li element props",
        clearButton: "Clear button element props",
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
        icon: "Icon, mutually exclusive with children",
        text: "Text, mutually exclusive with children",
        children: "Children, mutually exclusive with icon and text",
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

    prefixSuffix: {
      title: "Prefix/Suffix",
    },
    anatomy: {
      group: "Group",

      input: "Input",
      leading: "Leading",
      trailing: "Trailing",
    },
    api: {
      sectionTitles: {
        inputProps: "Input Props",
        slotPropsConfig: "slotProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onChange:
          "Value change callback, can return { invalid?: string } to trigger invalid state",
        placeholder: "Placeholder",
        type: "Input type",
        invalid: "Invalid message",
        label: "Label text",
        description: "Description text",
        leading: "Leading content",
        trailing: "Trailing content",
        slotProps: "Internal wrapped property passthrough",
      },
      slotPropsConfig: {
        group: "Group container `<div>` props",
        leading: "Leading container `<span>` props",
        trailing: "Trailing container `<span>` props",
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

    anatomy: {
      group: "Group",
      input: "Input",
      toggle: "Toggle Button",
    },
    api: {
      sectionTitles: {
        passwordProps: "Password Props",
        slotPropsConfig: "slotProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onChange:
          "Value change callback, can return { invalid?: string } to trigger invalid state",
        label: "Label text",
        description: "Description text",
        invalid: "Invalid message",
        leading: "Leading content",
        trailing: "Trailing content",
        placeholder: "Placeholder",
        disabled: "Whether disabled",
        slotProps: "Internal wrapped property passthrough",
      },
      slotPropsConfig: {
        group: "Input group `<div>` props",



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

    disabled: {
      title: "Disabled",
    },

    api: {
      sectionTitles: {
        textareaProps: "Textarea Props",
        slotPropsConfig: "slotProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onChange:
          "Value change callback, can return { invalid?: string } to trigger invalid state",
        placeholder: "Placeholder text",
        disabled: "Whether disabled",
        invalid: "Invalid message",
        label: "Label text",
        description: "Description text",
        slotProps: "Internal props passthrough",
      },
      slotPropsConfig: {
        root: "Root container `<div>` props",
        label: "Label `<label>` props",
        invalid: "Invalid `<small>` props",
        description: "Description `<small>` props",
      },
    },
  },

  tabs: {
    title: "Tabs",
    description:
      "Tabs component for switching between multiple content panels.",
    basic: {
      title: "Basic",
    },
    controlled: {
      title: "Controlled",
    },
    vertical: {
      title: "Vertical",
    },
    disabled: {
      title: "Disabled",
    },
    styled: {
      title: "Custom Styling",
    },
    anatomy: {
      root: "Root",
      list: "List Container",
      trigger: "Trigger",
      content: "Content Panel",
    },
    api: {
      sectionTitles: {
        tabsProps: "Tabs Props",
        slotPropsConfig: "slotProps Config",
      },
      props: {
        options: "Tab options configuration array",
        defaultValue: "Default selected tab value (uncontrolled)",
        value: "Selected tab value (controlled)",
        onValueChange: "Tab change callback",
        orientation: "Orientation: horizontal or vertical",
        activationMode: "Activation mode: automatic or manual",
        slotProps: "Internal props passthrough",
      },
      slotPropsConfig: {
        list: "List container `<div>` props",
        trigger: "Trigger `<button>` props",
        content: "Content panel `<div>` props",
      },
    },
    docs: {
      introduction:
        "The Tabs component allows switching between multiple related content panels. It supports both controlled and uncontrolled modes, and provides horizontal and vertical layout orientations.",
      features: [
        "Supports both controlled and uncontrolled modes",
        "Provides horizontal and vertical layout orientations",
        "Supports keyboard navigation following WAI-ARIA standards",
        "Supports automatic and manual activation modes",
        "Allows internal element props passthrough via slotProps",
      ],
      usage:
        "When using the Tabs component, you need to pass an options array to configure all tab options. Each option includes value, label, children, and an optional disabled property.",
    },
  },

  upload: {
    title: "Upload",
    description: "File upload component with custom validation support.",
    basic: {
      title: "Basic",
    },

    multiple: {
      title: "Multiple",
    },
    disabled: {
      title: "Disabled",
    },

    api: {
      sectionTitles: {
        uploadProps: "Upload Props",
        slotPropsConfig: "slotProps Config",
      },
      props: {
        label: "Label text",
        description: "Description text",
        invalid: "Invalid message",
        disabled: "Whether disabled",
        multiple: "Whether multiple files allowed",
        accept: "Accepted file types",
        onChange:
          "Value change callback, can return { invalid?: string } to trigger invalid state",
        slotProps: "Internal wrapped property passthrough",
      },
      slotPropsConfig: {
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

    api: {
      sectionTitles: {
        datePickerProps: "DatePicker Props",
      },
      props: {
        invalid: "Invalid state",
        placeholder: "Placeholder",
        type: "Input type",
        onChange: "Value change callback",
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
        slotPropsConfig: "slotProps Config",
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
        slotProps: "Internal wrapped property passthrough",
      },
      slotPropsConfig: {
        group: "Select group `<div>` props",
        label: "Label `<label>` props",
        invalid: "Invalid message `<div>` props",
        description: "Description `<small>` props",
        leading: "Leading `<span>` props",
        trailing: "Trailing `<span>` props",
      },
    },
  },

  loading: {
    title: "Loading",
    description: "Loading component for displaying content loading state.",
    basic: {
      title: "Basic",
    },
    custom: {
      title: "Custom",
    },
    api: {
      sectionTitles: {
        loadingProps: "Loading Props",
      },
      props: {
        loading: "Whether to show loading state",
        children: "Child component",
        fallback: "Placeholder to show when loading",
        skeleton: "Skeleton content",
        className: "Custom className",
      },
    },
  },

  form: {
    title: "Form",
    description: "Form component for data collection and validation.",
    basic: {
      title: "Basic",
    },
    refExample: {
      title: "Using Ref",
    },
    api: {
      sectionTitles: {
        formProps: "Form Props",
        formFieldProps: "Form.Field Props",
        formFieldsetProps: "Form.Fieldset Props",
        formSubmitProps: "Form.Submit Props",
        formRef: "FormRef",
      },
      props: {
        onSubmit: "Form submit handler function",
        autoReset: "Whether to auto-reset form after submit",
        ref: "Form ref for programmatic form operations",
        label: "Field label",
        name: "Field name (required)",
        description: "Field description",
        invalid: "Invalid message",
        disabled: "Whether disabled",
        direction: "Layout direction",
        loading: "Loading state",
        setValue: "Set single field value",
        setValues: "Batch set field values",
        reset: "Reset form",
        submit: "Submit form",
      },
    },
  },

  image: {
    title: "Image",
    description: "Image component with loading state and error handling.",
    basic: {
      title: "Basic",
    },
    skeleton: {
      title: "Custom Skeleton",
    },
    failure: {
      title: "Custom Failure",
    },
    progressive: {
      title: "Progressive Loading",
    },
    api: {
      sectionTitles: {
        imageProps: "Image Props",
      },
      props: {
        src: "Image source URL (required)",
        alt: "Image alternative text",
        skeleton: "Skeleton content displayed during loading",
        fallback: "Content displayed when loading fails",
        placeholderSrc: "Placeholder source for progressive image loading",
        delay: "Delay time for loading (milliseconds)",
      },
    },
  },

  watermark: {
    title: "Watermark",
    description: "A watermark component that overlays semi-transparent text patterns on content.",
    basic: {
      title: "Basic",
    },
    custom: {
      title: "Custom",
    },
    api: {
      sectionTitles: {
        watermarkProps: "Watermark Props",
      },
      props: {
        text: "Watermark text content",
        fontSize: "Font size of watermark text",
        color: "Color of watermark text",
        fontFamily: "Font family of watermark text",
        rotate: "Rotation angle in degrees",
        gap: "Spacing between watermarks",
        opacity: "Opacity of watermark",
        zIndex: "Z-index of watermark layer",
        children: "Content to be watermarked",
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
        slotPropsConfig: "slotProps Config",
        slotProps: "slotProps Config",
      },
      props: {
        value: "Selected value (controlled mode)",
        defaultValue: "Initial selected value (uncontrolled mode)",
        onValueChange:
          "Value change callback, can return { invalid?: string } to trigger invalid state",
        invalid: "Invalid state, supports boolean or string type",
        disabled: "Whether disabled",
        name: "Form field name",

        slotProps: "Internal element props passthrough config",
        options: "Options array for rendering multiple radio buttons",
      },
      item: {
        value: "Option value",
        onCheckedChange: "Checked state change callback",
        disabled: "Whether disabled",
        variant: "Style variant (radio | segment)",
        indicator: "Indicator config",
      },
      slotProps: {

        content: "Content container `<div>` element props",

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
        refMethods: "Ref Methods",
      },
      props: {
        open: "Control whether dialog is open (controlled mode)",
        onClose: "Callback function when dialog closes",
      },
      refMethods: {
        show: "Open dialog (non-modal)",
        showModal: "Open dialog (modal)",
        close: "Close dialog",
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

    disabled: {
      title: "Disabled",
    },

    anatomy: {
      group: "Group",
      btn: "Button",
      input: "Input",
    },
    api: {
      sectionTitles: {
        numberFieldProps: "NumberField Props",
        slotPropsConfig: "slotProps Config",
      },
      props: {
        value: "Input value (controlled mode)",
        defaultValue: "Initial input value (uncontrolled mode)",
        onValueChange:
          "Value change callback, can return { invalid?: string } to trigger invalid state",

        invalid: "Invalid message",
        min: "Minimum value",
        max: "Maximum value",
        step: "Step increment",
        disabled: "Whether disabled",
        slotProps: "Internal wrapped props pass-through",
      },
      slotPropsConfig: {
        group: "Input group `<div>` props",
        btn: "Button `<button>` props",
        desc: "Description `<small>` props",
      },
    },
  },

  pagination: {
    title: "Pagination",
    description: "Pagination component for navigating through paginated data.",
    basic: {
      title: "Basic",
    },
    customIcons: {
      title: "Custom Icons",
    },
    withActions: {
      title: "With Actions",
    },
    withIndicator: {
      title: "With Indicator",
    },
    api: {
      sectionTitles: {
        paginationProps: "Pagination Props",
        description: "Pagination.Description",
        sizer: "Pagination.Sizer",
        controls: "Pagination.Controls",
        use: "Pagination.use",
      },
      props: {
        current: "Current page number",
        pageSize: "Number of items per page",
        total: "Total number of items",
        onChange: "Callback when page or page size changes",
        children: "Child elements",
      },
      description: {
        format: "Custom function to format pagination text",
      },
      sizer: {
        options: "Page size options array",
        format: "Custom function to format page size option text",
      },
      controls: {
        children: "Control button child elements",
      },
      use: "Get pagination context for custom pagination buttons",
    },
  },

  paginatedView: {
    title: "Paginated View",
    description: "A view component that displays one slide at a time with smooth transitions.",
    basic: {
      title: "Basic",
    },
    api: {
      sectionTitles: {
        paginatedViewProps: "PaginatedView Props",
        slotPropsConfig: "slotProps Config",
      },
      props: {
        activeIndex: "Current active slide index (0-based)",
        className: "Custom className",
        slotProps: "Internal element props pass-through",
      },
      slotPropsConfig: {
        slide: "Slide container `<div>` props",
      },
    },
  },

  progress: {
    title: "Progress",
    description: "Progress bar component supporting static progress and checkpoint-based dynamic progress.",
    basic: {
      title: "Basic",
    },
    dynamic: {
      title: "Dynamic",
    },
    api: {
      sectionTitles: {
        progressProps: "Progress Props",
      },
      props: {
        value: "Static progress value (between 0-1)",
        getCurrent: "Function to get current progress, returns number or Promise",
        totalDuration: "Estimated total duration in seconds",
        checkpoints: "Checkpoints array for triggering progress updates",
        reverse: "Display from right to left",
        transitionDuration: "Transition duration in seconds",
        className: "Root container className",
        barClassName: "Progress bar className",
        rootProps: "Root container HTML attributes",
        barProps: "Progress bar HTML attributes",
        onComplete: "Callback when progress completes",
      },
    },
  },

  title: {
    title: "Title",
    description: "Renders a semantic heading element with consistent styling.",
    basic: {
      title: "Basic",
    },
    api: {
      sectionTitles: {
        titleProps: "Title Props",
      },
      props: {
        as: "The HTML element to render",
      },
    },
  },

  virtualScroll: {
    title: "Virtual Scroll",
    description: "High-performance virtual scroll component that only renders visible items.",
    basic: {
      title: "Basic",
    },
    api: {
      sectionTitles: {
        virtualScrollProps: "VirtualScroll Props",
      },
      props: {
        items: "Array of items to render",
        itemHeight: "Height of each item in pixels",
        containerHeight: "Container height in pixels",
        renderItem: "Function to render each item",
        overscan: "Number of extra items to render",
        onScroll: "Scroll callback function",
        className: "Inner container className",
        containerClassName: "Outer container className",
      },
    },
  },

  separator: {
    title: "Separator",
    description: "A visual divider component for separating content.",
    basic: {
      title: "Basic",
    },
    vertical: {
      title: "Vertical",
    },
    withText: {
      title: "With Text",
    },
    api: {
      sectionTitles: {
        separatorProps: "Separator Props",
      },
      props: {
        orientation: "Separator orientation",
        children: "Text content to display in the center",
        className: "Container className",
        lineClassName: "Line element className",
      },
    },
  },

  carousel: {
    title: "Carousel",
    description: "A carousel component for cycling through slides.",
    basic: {
      title: "Basic",
    },
    autoPlay: {
      title: "Auto Play",
    },
    loop: {
      title: "Loop",
    },
    api: {
      sectionTitles: {
        carouselProps: "Carousel Props",
      },
      props: {
        activeIndex: "Current active slide index",
        autoPlay: "Enable auto play",
        autoPlayInterval: "Auto play interval in ms",
        loop: "Enable loop mode",
        onChange: "Callback when index changes",
        slotPropsSlide: "Slide element props",
      },
    },
  },

  sidebar: {
    title: "Sidebar",
    description: "Collapsible sidebar component with ref-based control.",
    basic: {
      title: "Basic",
    },
    api: {
      sectionTitles: {
        sidebarProps: "Sidebar Props",
        sidebarHandle: "SidebarHandle",
      },
      props: {
        defaultOpen: "Default open state",
        children: "Sidebar content",
        ref: "Ref for controlling sidebar",
      },
      handle: {
        toggle: "Toggle sidebar state",
        open: "Open sidebar",
        close: "Close sidebar",
        isOpen: "Current open state",
      },
    },
  },
};
