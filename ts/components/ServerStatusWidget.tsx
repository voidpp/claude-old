import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import * as moment from 'moment';
import * as React from "react";
import { useEffect, useState } from "react";
import api from "../api";
import { CommonWidgetProps, ServerStatusData } from "../types";
import FlagIcon, { countries } from "./FlagIcon";
import { useInterval } from "./tools";
import WidgetFrame from "./WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import { FormListFieldDescriptor, FormNumberFieldDescriptor, FormSelectFieldDescriptor } from "./WidgetSettingsDialog";

const styles = () => createStyles({
    body: {
        fontSize: 18,
        padding: 10,
        '& table': {
            width: '100%',
            '& td': {
                padding: '2px 6px',
            },
            '& tr': {
                transition: 'opacity 1s',
            }
        },
    },
    nodata: {
        opacity: 0.3,
    },
    loadCol: {
        textAlign: 'right',
    }
});

export type ServerConfig = {
    id: string,
    ip: string,
    name: string,
    location: string,
    systemStatusServerPort?: number,
    rank: number,
}

export type Column = 'name' | 'ping' | 'load' | 'memory' | 'uptime';

export type Settings = {
    servers: {[s: string]: ServerConfig},
    columns: {[key in Column]: boolean},
    pollInterval: number,
}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    const { config, classes, stepSize, updateWidgetConfig } = props;

    const { settings } = config;

    const [serverInfo, setServerInfo] = useState({} as {[s: string]: ServerStatusData});

    const fetchServerInfo = () => {
        for (let desc of Object.values(settings.servers)) {
            api.getServerStatus(desc.ip, desc.systemStatusServerPort).then(d => {
                setServerInfo(info => Object.assign({}, info, {[desc.ip]: d}))
            });
        }
    }

    useEffect(fetchServerInfo, [])

    useInterval(() => {
        fetchServerInfo()
    }, settings.pollInterval * 1000);

    const Status = (props: {ip: string}) => {
        const info = serverInfo[props.ip];

        let icon: IconProp = 'question-circle';
        let color = 'unset';

        if (info) {
            if (info.ping) {
                icon = info.load ? 'check-circle' : 'exclamation-circle';
                color = info.load ? '#37a702' : '#d46703';
            } else {
                icon = 'times-circle';
                color = '#d40303';
            }

        }

        return <FontAwesomeIcon icon={icon} style={{color: color}} />
    }

    const renderRow = (cfg: ServerConfig) => {

        const info = serverInfo[cfg.ip];

        const baseCols = <React.Fragment>
            <td><Status ip={cfg.ip} /></td>
            <td>{cfg.name}</td>
            <td style={{maxWidth: 30}}><FlagIcon name={cfg.location} /></td>
        </React.Fragment>

        if (!info)
            return <tr className={classes.nodata} key={cfg.name}>{baseCols}</tr>;

        return <tr key={cfg.name}>
            {baseCols}
            <td style={{textAlign: 'right'}}>{info.ping != null ? `${info.ping} ms` : null}</td>
            <td className={classes.loadCol}>{info.load ? info.load[0].toFixed(2): null}</td>
            <td className={classes.loadCol}>{info.load ? info.load[1].toFixed(2): null}</td>
            <td className={classes.loadCol}>{info.load ? info.load[2].toFixed(2): null}</td>
            <td style={{textAlign: 'right'}}>{info.memory ? `${info.memory.percent.toFixed(1)}%` : null}</td>
            <td>{info.uptime ? moment.duration(info.uptime * 1000).humanize() : null}</td>
        </tr>
    }

    return (
        <WidgetFrame
            config={config}
            stepSize={stepSize}
            updateWidgetConfig={updateWidgetConfig}
        >
            <div className={classes.body}>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={3}>Name</th>
                            <th>Ping</th>
                            <th colSpan={3}>Load</th>
                            <th>Mem</th>
                            <th>Uptime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(settings.servers).sort((s1, s2) => s1.rank - s2.rank).map(renderRow)}
                    </tbody>
                </table>
            </div>
            <WidgetMenu id={config.id} settings={config.settings} settingsFormFields={[{
                name: 'pollInterval',
                label: 'Polling interval',
                min: 0,
                max: 65565,
            } as FormNumberFieldDescriptor ,{
                type: 'list',
                label: 'Servers',
                name: 'servers',
                addButtonLabel: 'Add server',
                fields: [{
                    name: 'name',
                    label: 'Name',
                    default: '',
                },{
                    name: 'ip',
                    label: 'IP',
                    default: '',
                },{
                    name: 'location',
                    label: 'Location',
                    default: 'hu',
                    type: 'select',
                    // options: [{value: 'hu', label: 'Hungary'}, {value: 'de', label: 'Germany'}]
                    options: Object.keys(countries).map(code => {return {value: code, label: countries[code]}})
                } as FormSelectFieldDescriptor ,{
                    name: 'systemStatusServerPort',
                    label: 'Status port',
                    default: 35280,
                }]
            } as FormListFieldDescriptor]} />
        </WidgetFrame>
    )
});
