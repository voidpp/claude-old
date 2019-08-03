
import ClockWidget from './components/ClockWidget';
import { BaseWidgetConfig } from './types';

export type WidgetRegistryType = {
    [s: string]: {
        factory: any,
        title: string,
        default: BaseWidgetConfig,
    }
}

let reg: WidgetRegistryType = {
    clock: {
        factory: ClockWidget,
        title: 'Clock',
        default: {
            x: 10,
            y: 10,
            width: 500,
            height: 200,
            settings: {
                showDate: true,
                timeFormat: 'HH:mm',
                dateFormat: 'YYYY. MMMM D. dddd',
            },
        },
    },
}

export default reg;
