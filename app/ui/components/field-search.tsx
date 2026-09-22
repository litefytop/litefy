"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { InputGroup, InputRoot } from "./input-group";
import { Select } from "./select";
export interface FieldSearchOption {
    label: string;
    value: string;
}
export interface FieldSearchField {
    value: string;
    label: string;
    placeholder?: string;
    options?: FieldSearchOption[];
    allLabel?: string;
}
export interface FieldSearchProps {
    fields: FieldSearchField[];
    onSearch?: (field: string, value: string) => void;
    debounceMs?: number;
    className?: ClassNameValue;
}
export function FieldSearch({ fields, onSearch, debounceMs = 300, className, }: FieldSearchProps) {
    const [fieldValue, setFieldValue] = React.useState(fields[0]?.value ?? "");
    const [text, setText] = React.useState("");
    const composingRef = React.useRef(false);
    const textRef = React.useRef("");
    const lastEmitted = React.useRef<string | null>(null);
    const timer = React.useRef<number | undefined>(undefined);
    React.useEffect(() => () => window.clearTimeout(timer.current), []);
    const field = fields.find((item) => item.value === fieldValue) ?? fields[0];
    const enumOptions = field?.options;
    const emit = (target: FieldSearchField | undefined, rawValue: string) => {
        if (!target)
            return;
        const value = rawValue.trim();
        if (lastEmitted.current === `${target.value}\u0000${value}`)
            return;
        lastEmitted.current = `${target.value}\u0000${value}`;
        onSearch?.(target.value, value);
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setText(next);
        textRef.current = next;
        if (composingRef.current)
            return;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => emit(field, next), debounceMs);
    };
    const handleCompositionEnd = () => {
        if (!composingRef.current)
            return;
        composingRef.current = false;
        emit(field, textRef.current);
    };
    const handleFieldChange = (next: string) => {
        const target = fields.find((item) => item.value === next) ?? fields[0];
        setFieldValue(next);
        setText("");
        textRef.current = "";
        emit(target, "");
    };
    return (<InputGroup className={cn("overflow-hidden px-0 mx-1", className)}>
      <Select className="w-28 shrink-0 rounded-none border-0 bg-transparent shadow-none" value={fieldValue} onValueChange={handleFieldChange} options={fields.map(({ value, label }) => ({ value, label }))}/>
      {enumOptions ? (<Select className="min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none" value={text} onValueChange={(value) => {
                setText(value);
                textRef.current = value;
                emit(field, value);
            }} options={[
                { label: field?.allLabel ?? "全部", value: "" },
                ...enumOptions,
            ]}/>) : (<InputRoot value={text} placeholder={field?.placeholder} onChange={handleInputChange} onCompositionStart={() => {
                composingRef.current = true;
            }} onCompositionEnd={handleCompositionEnd}/>)}
    </InputGroup>);
}
