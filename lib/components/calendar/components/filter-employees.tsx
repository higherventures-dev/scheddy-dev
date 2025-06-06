import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Checkbox,
	Combobox,
	ComboboxButton,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/react";
import Image from "next/image";

export const FilterEmployees = ({
	employees,
	employeeIds,
	setEmployeeIds,
}: {
	employees: {
		familyName: string | null;
		givenName: string | null;
		id: number;
		role: string;
		avatar: string | null;
	}[];
	employeeIds: number[];
	setEmployeeIds: (employees: number[]) => void;
}) => {
	const selectedEmployees = employees.filter(({ id }) =>
		employeeIds.includes(id),
	);

	return (
		<Combobox
			value={employeeIds}
			onChange={(values) => setEmployeeIds(values)}
			multiple
		>
			<ComboboxButton className="w-[9.5rem] rounded-sm border border-white/[6%] bg-[#3A3A3A] px-3 py-1.5 text-xs font-medium text-white">
				<span className="flex items-center gap-x-1.5">
					{selectedEmployees.length === employees.length ? (
						<>
							<FontAwesomeIcon icon={faUserGroup} width={12} height={12} />

							<span className="block">All team</span>
						</>
					) : selectedEmployees.length === 1 ? (
						<>
							{selectedEmployees.find(({ id }) => id === employeeIds[0])
								?.avatar && (
								<Image
									alt={`${selectedEmployees[0].givenName} ${selectedEmployees[0].familyName}`}
									src={selectedEmployees[0].avatar!}
									className="shrink-0 rounded-full"
									width={12}
									height={12}
								/>
							)}

							<span className="block truncate">
								{`${selectedEmployees[0].givenName} ${selectedEmployees[0].familyName}`}
							</span>
						</>
					) : selectedEmployees.length === 0 ? (
						<span className="block">No team members</span>
					) : (
						<>
							<FontAwesomeIcon icon={faUserGroup} width={12} height={12} />

							<span className="block">{`${selectedEmployees.length} team members`}</span>
						</>
					)}
				</span>
			</ComboboxButton>

			<ComboboxOptions
				transition
				className="mt-1 w-[14.5rem] rounded-lg border border-white/[6%] bg-[#313131] data-[closed]:data-[leave]:opacity-0"
				anchor="bottom end"
			>
				<div className="flex flex-col gap-y-1 p-1">
					{employees.map((employee) => {
						const name = `${employee.givenName} ${employee.familyName}`;

						return (
							<ComboboxOption
								key={employee.id}
								value={employee.id}
								className="flex items-center justify-between rounded-sm p-1.5 text-xs text-white select-none hover:bg-[#393939]"
							>
								<div className="flex items-center gap-x-1.5">
									{employee.avatar && (
										<Image
											alt={name}
											src={employee.avatar}
											className="shrink-0 rounded-full"
											width={14}
											height={14}
										/>
									)}

									<span className="truncate">{name}</span>
								</div>

								<Checkbox
									checked={employeeIds.includes(employee.id)}
									className="group flex size-4 items-center justify-center rounded-sm border border-white/[12%] data-[checked]:bg-[#69AADE]"
								>
									<svg
										className="stroke-white opacity-0 group-data-[checked]:opacity-100"
										width={10}
										height={10}
										viewBox="0 0 10 10"
									>
										<path
											d="M8.33335 2.5L3.75002 7.08333L1.66669 5"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</Checkbox>
							</ComboboxOption>
						);
					})}
				</div>
			</ComboboxOptions>
		</Combobox>
	);
};
