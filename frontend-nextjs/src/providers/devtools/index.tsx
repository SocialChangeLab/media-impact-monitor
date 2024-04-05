'use client'

import {
	DevtoolsPanel,
	DevtoolsProvider as DevtoolsProviderBase,
} from '@refinedev/devtools'
import { PropsWithChildren } from 'react'

export const DevtoolsProvider = (props: PropsWithChildren<{}>) => {
	return (
		<DevtoolsProviderBase>
			{props.children}
			<DevtoolsPanel />
		</DevtoolsProviderBase>
	)
}
