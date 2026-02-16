import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/helpers';
import type { JobType, EquipmentTag, StyleTag } from '../types';
import { getEquipmentLabel, getStyleLabel } from '../utils/helpers';

interface FilterPill {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterPillsProps {
  filters: FilterPill[];
  selected: string[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  className?: string;
}

export function FilterPills({
  filters,
  selected,
  onSelect,
  className,
}: Omit<FilterPillsProps, 'multiSelect'>) {
  return (
    <div className={cn('flex gap-2.5 overflow-x-auto hide-scrollbar pb-2', className)}>
      {filters.map((filter, index) => {
        const isSelected = selected.includes(filter.id);

        return (
          <motion.button
            key={filter.id}
            onClick={() => onSelect(filter.id)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap',
              'text-[13px] transition-all duration-400',
              isSelected
                ? 'bg-forest/8 border border-forest/25 text-forest font-medium'
                : 'bg-transparent border border-stone/12 text-stone/60 hover:border-forest/20 hover:text-stone/80'
            )}
          >
            {filter.icon && <span className="w-3.5 h-3.5 opacity-60">{filter.icon}</span>}
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// Job Type Filter — editorial organic
interface JobTypeFilterProps {
  selected: JobType[];
  onChange: (types: JobType[]) => void;
  className?: string;
}

export function JobTypeFilter({ selected, onChange, className }: JobTypeFilterProps) {
  const types: { id: JobType; label: string; dotColor: string }[] = [
    { id: 'permuta', label: 'Permuta', dotColor: 'bg-green-400/70' },
    { id: 'cache', label: 'Cachê', dotColor: 'bg-blue-400/70' },
    { id: 'hibrido', label: 'Híbrido', dotColor: 'bg-purple-400/70' },
  ];

  const toggleType = (type: JobType) => {
    if (selected.includes(type)) {
      onChange(selected.filter(t => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className={cn('flex gap-2.5 overflow-x-auto hide-scrollbar', className)}>
      {types.map((type) => {
        const isSelected = selected.includes(type.id);

        return (
          <motion.button
            key={type.id}
            onClick={() => toggleType(type.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap',
              'text-[13px] transition-all duration-400 border',
              isSelected
                ? 'bg-forest/8 border-forest/25 text-forest font-medium'
                : 'bg-transparent border-stone/12 text-stone/60 hover:border-forest/20'
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', type.dotColor)} />
            {type.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// Equipment Filter
interface EquipmentFilterProps {
  selected: EquipmentTag[];
  onChange: (equipment: EquipmentTag[]) => void;
  className?: string;
}

export function EquipmentFilter({ selected, onChange, className }: EquipmentFilterProps) {
  const equipment: EquipmentTag[] = ['drone', '4k', 'gimbal', 'lighting', 'dslr'];

  const toggleEquipment = (eq: EquipmentTag) => {
    if (selected.includes(eq)) {
      onChange(selected.filter(e => e !== eq));
    } else {
      onChange([...selected, eq]);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {equipment.map((eq) => {
        const isSelected = selected.includes(eq);

        return (
          <motion.button
            key={eq}
            onClick={() => toggleEquipment(eq)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-all duration-400',
              isSelected
                ? 'bg-forest/10 text-forest font-medium'
                : 'bg-warm-gray-100 text-stone/60 hover:bg-warm-gray-200'
            )}
            whileTap={{ scale: 0.95 }}
          >
            {getEquipmentLabel(eq)}
          </motion.button>
        );
      })}
    </div>
  );
}

// Style Filter
interface StyleFilterProps {
  selected: StyleTag[];
  onChange: (styles: StyleTag[]) => void;
  className?: string;
}

export function StyleFilter({ selected, onChange, className }: StyleFilterProps) {
  const styles: StyleTag[] = ['hotelaria', 'lifestyle', 'arquitetura', 'gastronomia', 'natureza', 'aereo'];

  const toggleStyle = (style: StyleTag) => {
    if (selected.includes(style)) {
      onChange(selected.filter(s => s !== style));
    } else {
      onChange([...selected, style]);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {styles.map((style) => {
        const isSelected = selected.includes(style);

        return (
          <motion.button
            key={style}
            onClick={() => toggleStyle(style)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-all duration-400',
              isSelected
                ? 'bg-forest/10 text-forest font-medium'
                : 'bg-warm-gray-100 text-stone/60 hover:bg-warm-gray-200'
            )}
            whileTap={{ scale: 0.95 }}
          >
            {getStyleLabel(style)}
          </motion.button>
        );
      })}
    </div>
  );
}

// Sort Dropdown
interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SortDropdown({ options, value, onChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || options[0]?.label;

  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-stone/60 hover:text-ink transition-colors duration-300"
        whileTap={{ scale: 0.95 }}
      >
        <span>Ordenar: <span className="font-medium text-ink">{selectedLabel}</span></span>
        <svg
          className={cn('w-4 h-4 transition-transform duration-300', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-full mt-1 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-floating border border-stone/8 z-50 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-3 text-left text-sm transition-colors duration-300',
                  value === option.value
                    ? 'bg-forest/8 text-forest font-medium'
                    : 'text-ink hover:bg-warm-gray-50'
                )}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
