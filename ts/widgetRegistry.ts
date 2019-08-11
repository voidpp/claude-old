
import { BaseWidgetSettings } from './types';

import ClockWidget, { Settings as ClockWidgetSettings } from './components/ClockWidget';
import ServerStatusWidget, { Settings as ServerStatusWidgetSettings } from './components/ServerStatusWidget';
import CalendarWidget, { Settings as CalendarWidgetSettings } from "./components/CalendarWidget";
import StorageStatusWidget, { Settings as StorageStatusWidgetSettings } from './components/StorageStatusWidget';
import InfluxTable, { Settings as InfluxTableSettings } from './components/InfluxTable';
import IdokepCurrent, { Settings as IdokepCurrentSetting } from './components/IdokepCurrent';

export type WidgetRegistryType = {
    [s: string]: {
        factory: any,
        title: string,
        settingsType: typeof BaseWidgetSettings,
    }
}


let reg: WidgetRegistryType = {
    storages: {
        factory: StorageStatusWidget,
        title: 'Storage status',
        settingsType: StorageStatusWidgetSettings,
    },
    clock: {
        factory: ClockWidget,
        title: 'Clock',
        settingsType: ClockWidgetSettings,
    },
    serverStatus: {
        factory: ServerStatusWidget,
        title: 'Server status',
        settingsType: ServerStatusWidgetSettings,
    },
    calendar: {
        factory: CalendarWidget,
        title: 'Calendar',
        settingsType: CalendarWidgetSettings,
    },
    influxTable: {
        factory: InfluxTable,
        title: 'Influx table',
        settingsType: InfluxTableSettings,
    },
    idokepCurrent: {
        factory: IdokepCurrent,
        title: 'Idokep / Current',
        settingsType: IdokepCurrentSetting,
    }
};

export default reg;
