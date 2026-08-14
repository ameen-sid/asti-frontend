import React from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (
    field: 'startDate' | 'endDate',
    value: string
  ) => void;
}

function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const handleChange =
    (field: 'startDate' | 'endDate') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(field, e.target.value);
    };

  return (
    <div className="mb-3 d-flex gap-3">
      <div className="flex-grow-1">
        <label className="form-label">
          Start Date <span className="text-danger">*</span>
        </label>

        <input
          type="date"
          className="form-control"
          name="startDate"
          value={startDate}
          onChange={handleChange('startDate')}
          required
        />
      </div>

      <div className="flex-grow-1">
        <label className="form-label">
          End Date <span className="text-danger">*</span>
        </label>

        <input
          type="date"
          className="form-control"
          name="endDate"
          value={endDate}
          onChange={handleChange('endDate')}
          required
        />
      </div>
    </div>
  );
}

export default DateRangePicker;