import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CurrencyFilterProps {
  value: 'IQD' | 'USD' | 'both'
  onChange: (value: 'IQD' | 'USD' | 'both') => void
}

export function CurrencyFilter({ value, onChange }: CurrencyFilterProps) {
  return (
    <RadioGroup
      defaultValue={value}
      onValueChange={(val) => onChange(val as 'IQD' | 'USD' | 'both')}
      className="flex space-x-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="both" id="both" />
        <Label htmlFor="both">Both</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="IQD" id="IQD" />
        <Label htmlFor="IQD">IQD</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="USD" id="USD" />
        <Label htmlFor="USD">USD</Label>
      </div>
    </RadioGroup>
  )
}

