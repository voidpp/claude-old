
import ClockWidget from './components/ClockWidget';
import { BaseWidgetConfig } from './types';

export type WidgetRegistryType = {
    [s: string]: {
        factory: any,
        title: string,
        default: BaseWidgetConfig,
        commonRemoveButton: boolean,
    }
}

let reg: WidgetRegistryType = {
    clock: {
        factory: ClockWidget,
        title: 'Clock',
        default: {
            x: 10,
            y: 10,
            width: 300,
            height: 200,
            settings: {},
        },
        commonRemoveButton: true,
    },
}

export default reg;
