type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

export default function InputField({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#6B7280]">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 rounded-xl border border-[#E5E7EB] px-4 text-[#111827]
                   focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
      />
    </div>
  );
}
