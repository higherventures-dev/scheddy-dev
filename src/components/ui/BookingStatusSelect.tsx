'use client';

import Select, { components } from 'react-select';
import { STATUS_OPTIONS, type StatusOption } from '@/lib/constants/statusOptions';
import Image from 'next/image';

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    color: state.data.color,
    backgroundColor: state.isFocused ? '#3a3a3a' : 'transparent',
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    color: state.data.color,
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#3a3a3a',
    padding: .5,
    border: 'none',    // no border or line
    boxShadow: 'none', // remove focus shadow
    minHeight: '20px',
     width: 'auto',      // let width be dynamic
  minWidth: 100,
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#3a3a3a',
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: '2px',
  }),
};

const Option = (props: any) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps} className="flex items-center gap-2 px-2 py-1">
      <Image src={data.imageUrl} alt={data.label} width={12} height={12} />
      <span style={{ color: data.color }}>{data.label}</span>
    </div>
  );
};

const SingleValue = (props: any) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2 text-xs">
        <Image src={data.imageUrl} alt={data.label} width={12} height={12} />
        <span style={{ color: data.color }}>{data.label}</span>
      </div>
    </components.SingleValue>
  );
};

// Custom smaller arrow
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0L5 6L10 0H0Z" fill="#999" />
      </svg>
    </components.DropdownIndicator>
  );
};

export default function BookingStatusSelect({
  value,
  onChange,
}: {
  value: StatusOption | null;
  onChange: (val: StatusOption | null) => void;
}) {
  return (
    <Select
      options={STATUS_OPTIONS}
      value={value}
      onChange={onChange}
      getOptionLabel={(e) => e.label}
      components={{ Option, SingleValue, IndicatorSeparator: () => null,  }}
      styles={customStyles}
      isSearchable={false}
      placeholder={null}  
    />
  );
}
