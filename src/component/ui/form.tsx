import { cn } from '@/lib';
import {
  useActionState,
  useRef,
  useEffect,
  createContext,
  useContext
} from 'react';

type FormContextType = {
  isPending: boolean;
};

const FormContext = createContext<FormContextType>({
  isPending: false
});

type FormProps =React.ComponentProps<"form"> & {
  onSubmit: (formData: FormData) => Promise<boolean>;
};

function Form({ children, onSubmit, className, ref, ...rest }: FormProps) {
  const internalRef = useRef<HTMLFormElement>(null);

  const action = async (prevCount: number, formData: FormData) => {
    const success = await onSubmit(formData);
    return success ? prevCount + 1 : prevCount;
  };

  const [count, formAction, isPending] = useActionState(action, 0);

  useEffect(() => {
    if (count > 0) {
      internalRef.current?.reset();
    }
  }, [count]);

  const mergedRef = (node: HTMLFormElement) => {
    internalRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <FormContext.Provider value={{ isPending }}>
      <form
        ref={mergedRef}
        action={formAction}
        className={className}
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}



type FormSubmitProps = React.ComponentProps<"button"> & {
    loading?: boolean;
};

function FormSubmit({ children, className, ref, loading, ...rest }: FormSubmitProps) {
  const { isPending } = useContext(FormContext);

  return (
    <button
      type="submit"
      disabled={isPending || loading}
      ref={ref}
      className={cn(
        "cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 h-9 min-w-9 px-3 py-1 has-[>svg]:px-2 gap-1 rounded-md",
        className,
      )}
      {...rest}
    >
      {isPending || loading ? 'Loading...' : children}
    </button>
  );
}

Form.Submit = FormSubmit;

export { Form };
