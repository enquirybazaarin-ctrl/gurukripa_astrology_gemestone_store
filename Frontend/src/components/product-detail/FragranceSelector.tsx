
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export interface FragranceOption {
    id: string;
    name: string;
    color: string; // hex for visual dot
}

interface FragranceSelectorProps {
    candleCount: number; // e.g., 4
    selectedFragrances: string[]; // array of fragrance IDs corresponding to each candle
    fragranceOptions: FragranceOption[];
    onFragranceChange: (index: number, fragranceId: string) => void;
}

export const FragranceSelector = ({
    candleCount,
    selectedFragrances,
    fragranceOptions,
    onFragranceChange,
}: FragranceSelectorProps) => {

    return (
        <div className="mb-2 border-t border-gray-100 pt-4">
            <div className="mb-3 ml-0.5">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">Choose Fragrances</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-tight">Customize your pack (Same or different)</p>
            </div>

            <div className="space-y-2">
                {Array.from({ length: candleCount }).map((_, index) => {
                    const selectedId = selectedFragrances[index];
                    const selectedOption = fragranceOptions.find(f => f.id === selectedId) || fragranceOptions[0];

                    return (
                        <div key={index} className="flex items-center gap-2 bg-gray-50/50 py-1.5 px-2.5 rounded-md border border-gray-100">
                            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider w-[70px]">Candle {index + 1}</span>
                            <div className="flex-1 relative">
                                <Listbox value={selectedId} onChange={(val) => onFragranceChange(index, val)}>
                                    <div className="relative">
                                        <Listbox.Button className="relative w-full cursor-pointer rounded bg-white py-1.5 pl-2.5 pr-8 text-left border border-gray-200 focus:outline-none focus:border-black sm:text-[12px] text-[11px] font-bold">
                                            <span className="flex items-center truncate uppercase tracking-tight">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full mr-2 shadow-sm"
                                                    style={{ backgroundColor: selectedOption.color }}
                                                />
                                                <span className="block truncate">{selectedOption.name}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <FiChevronDown
                                                    className="h-3.5 w-3.5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-[12px] shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                {fragranceOptions.map((fragrance) => (
                                                    <Listbox.Option
                                                        key={fragrance.id}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-8 pr-4 ${active ? 'bg-gray-100 text-black' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={fragrance.id}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span
                                                                    className={`flex items-center truncate uppercase tracking-tight ${selected ? 'font-black' : 'font-bold'
                                                                        }`}
                                                                >
                                                                    <span
                                                                        className="h-2.5 w-2.5 rounded-full mr-2 shadow-sm"
                                                                        style={{ backgroundColor: fragrance.color }}
                                                                    />
                                                                    {fragrance.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-black">
                                                                        <FiCheck className="h-4 w-4" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
