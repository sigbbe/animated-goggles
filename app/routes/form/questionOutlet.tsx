import { Outlet as RROutlet } from "@remix-run/react";
import { createContext, useContext } from "react";

type OutletProps<Data> = { data?: Data; };

let context = createContext<unknown>(null);

export function Outlet<Data = unknown>({ data }: OutletProps<Data>) {
	return (
		<context.Provider value={ data }>
			<RROutlet />
		</context.Provider>
	);
}

export function useParentData<ParentData>() {
	let parentData = useContext(context) as ParentData | null;
	if (parentData === null) throw new Error("Missing parent data.");
	return parentData;
}