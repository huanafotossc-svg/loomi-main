import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/helpers';

interface DatePickerProps {
    label: string;
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    minDate?: string;
}

export function DatePicker({ label, value, onChange, placeholder, minDate }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const handleDateClick = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const formattedDate = date.toISOString().split('T')[0];
        onChange(formattedDate);
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return placeholder || 'Selecione uma data';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const isDateDisabled = (day: number) => {
        if (!minDate) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const min = new Date(minDate);
        return date < min;
    };

    const isSelectedDate = (day: number) => {
        if (!value) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const selected = new Date(value + 'T00:00:00');
        return date.toDateString() === selected.toDateString();
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-ink mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                {label}
            </label>

            {/* Input Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 text-left border-2 border-warm-gray-200 rounded-xl bg-white hover:border-coral/50 transition-colors focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
            >
                <span className={cn(
                    value ? 'text-ink' : 'text-warm-gray-400'
                )}>
                    {formatDisplayDate(value)}
                </span>
            </button>

            {/* Calendar Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Calendar */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-warm-gray-200 p-4 w-80"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-warm-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <h3 className="font-semibold text-ink">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h3>

                                <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-warm-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Day Names */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {dayNames.map((day) => (
                                    <div
                                        key={day}
                                        className="text-center text-xs font-medium text-warm-gray-500 py-2"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days */}
                            <div className="grid grid-cols-7 gap-1">
                                {/* Empty cells for days before month starts */}
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}

                                {/* Actual days */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const disabled = isDateDisabled(day);
                                    const selected = isSelectedDate(day);

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => !disabled && handleDateClick(day)}
                                            disabled={disabled}
                                            className={cn(
                                                'aspect-square rounded-lg text-sm font-medium transition-all',
                                                disabled
                                                    ? 'text-warm-gray-300 cursor-not-allowed'
                                                    : selected
                                                        ? 'bg-coral text-white shadow-md'
                                                        : 'text-ink hover:bg-coral/10 hover:text-coral'
                                            )}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Clear Button */}
                            {value && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange('');
                                        setIsOpen(false);
                                    }}
                                    className="w-full mt-4 py-2 text-sm text-warm-gray-600 hover:text-coral transition-colors"
                                >
                                    Limpar seleção
                                </button>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
