import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import * as React from "react";
import { useEffect, useState } from "react";
import { CommonWidgetProps } from "../types";
import { useInterval } from "./tools";
import WidgetFrame from "./WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import { FormSelectFieldDescriptor } from './WidgetSettingsDialog';

// import * as prettyBytes from 'pretty-bytes';


const styles = () => createStyles({
    body: {
        padding: 5,
        '& table': {
            width: '100%',
            '& td': {
                padding: '2px 4px',
            }
        }
    },
    empty: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    title: {
        textAlign: 'center',
    },
    usageBar: {

    },
});

export class Settings {
    host: string = '';
    pollInterval: number = 600;
    title: string = '';
    sortBy: 'name' | 'usedPercent' | 'freeBytes' = 'name';
}

type StorageInfo = {
    device: string,
    free: number,
    label: string,
    mount: string,
    percent: number,
    total: number,
    used: number,
}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    const { config, classes, dashboardConfig, updateWidgetConfig } = props;
    const { settings } = config;
    const [storageInfo, setStorageInfo] = useState([] as Array<StorageInfo>);

    const fetchStorageInfo = () => {
        if (settings.host) {
            fetch(`http://${settings.host}:35280/`).then(rd => rd.json()).then(d => {
                setStorageInfo(d.hdd)
            })
        }
    }

    useEffect(fetchStorageInfo, [])

    useInterval(() => {
        fetchStorageInfo()
    }, settings.pollInterval * 1000);

    const onBeforeSettingsSubmit = (data: Settings) => {

    }

    const gigabytize = (val: number) => {
        const gb = val / 1024 / 1024 / 1024
        return gb.toFixed(1) + ' GiB'
    }


    const renderBody = () => {
        if (!settings.host)
            return <div className={classes.empty}>No host defined!</div>

        return (
            <div className={classes.body}>
                <div className={classes.title}>{settings.title}</div>
                <table>
                    <tbody>
                    {storageInfo.map(s => <tr key={s.mount}>
                        <td>{s.label}</td>
                        <td style={{textAlign: 'right'}}>{s.percent.toFixed(1)} %</td>
                        <td style={{textAlign: 'right'}}>{gigabytize(s.free)}</td>
                    </tr>)}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <WidgetFrame
            config={config}
            dashboardConfig={dashboardConfig}
            updateWidgetConfig={updateWidgetConfig}
        >
            {renderBody()}
            <WidgetMenu id={config.id} onBeforeSubmit={onBeforeSettingsSubmit} settings={config.settings} settingsFormFields={[{
                name: 'host',
                label: 'Host',
            }, {
                name: 'title',
                label: 'Title',
            }, {
                name: 'pollInterval',
                label: 'Poll interval',
            }, {
                name: 'sortBy',
                label: 'Sort',
                type: 'select',
                options: [
                    {value: 'name', label: 'Name'},
                    {value: 'usedPercent', label: 'Used percent'},
                    {value: 'freeBytes', label: 'Free bytes'},
                ],
            } as FormSelectFieldDescriptor ]} />
        </WidgetFrame>
    )
});
