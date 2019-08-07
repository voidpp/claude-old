
import ClockWidget from './components/ClockWidget';
import { BaseWidgetConfig } from './types';
import ServerStatusWidget, { Settings as ServerStatusWidgetSettings } from './components/ServerStatusWidget';
import CalendarWidget from "./components/CalendarWidget";

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
    serverStatus: {
        factory: ServerStatusWidget,
        title: 'Server status',
        default: {
            x: 10,
            y: 10,
            width: 400,
            height: 200,
            settings: {
                pollInterval: 60,
                servers: {},
                columns: {
                    load: true,
                    memory: true,
                    name: true,
                    ping: true,
                    uptime: true,
                }
            } as ServerStatusWidgetSettings,
        },
    },
    calendar: {
        factory: CalendarWidget,
        title: 'Calendar',
        default: {
            x: 10,
            y: 10,
            width: 200,
            height: 200,
            settings: {}
        }
    }
};

export default reg;
