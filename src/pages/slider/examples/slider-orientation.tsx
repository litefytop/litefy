import { Slider } from "@/component/ui/slider";

export function SliderOrientation() {
  return (
    <div className="flex gap-8 items-center h-56">
 
    
        <Slider defaultValue={50} orientation="horizontal"  label="Horizontal" />
     
        <Slider defaultValue={50} orientation="vertical" label="Vertical" />
      
    </div>
  );
}
