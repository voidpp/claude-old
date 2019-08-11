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
import WidgetFrame from "../containers/WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import { FormListFieldDescriptor, FormNumberFieldDescriptor, FormSelectFieldDescriptor, FormCheckboxListFieldDescriptor } from "./WidgetSettingsDialog";

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

type ServerConfigMap = {[s: string]: ServerConfig};

export class Settings {
    servers: ServerConfigMap = {};
    columns: {[key in Column]: boolean} = {load: true, memory: true, name: true, ping: true, uptime: true};
    pollInterval: number = 60;
}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    const { config, classes, dashboardConfig } = props;
    const { settings } = config;
    const [serverInfo, setServerInfo] = useState({} as {[s: string]: ServerStatusData});


    const fetchServerInfo = (servers: ServerConfigMap = null) => {
        for (let desc of Object.values(servers || settings.servers)) {
            api.getServerStatus(desc.ip, desc.systemStatusServerPort).then(d => {
                setServerInfo(info => Object.assign({}, info, {[desc.ip]: d}))
            });
        }
    }

    useEffect(fetchServerInfo, [])

    useInterval(() => {
        fetchServerInfo()
    }, settings.pollInterval * 1000);

    const onBeforeSettingsSubmit = (data: Settings) => {
        // TODO: check if was a new server added (search for new ips)
        fetchServerInfo(data.servers)
    }

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

    const ConditionalRender = (props: {cond: boolean, children: React.ReactNode}) => {
        return <React.Fragment>{props.cond ? props.children : null}</React.Fragment>
    }

    const cols = settings.columns;

    const renderRow = (cfg: ServerConfig) => {

        const info = serverInfo[cfg.ip];

        const baseCols = <ConditionalRender cond={cols.name}>
            <td><Status ip={cfg.ip} /></td>
            <td>{cfg.name}</td>
            <td style={{maxWidth: 30}}><FlagIcon name={cfg.location} /></td>
        </ConditionalRender>

        if (!info)
            return <tr className={classes.nodata} key={cfg.name}>{baseCols}</tr>;

        return <tr key={cfg.name}>
            {baseCols}
            <ConditionalRender cond={cols.ping}><td style={{textAlign: 'right'}}>{info.ping != null ? `${info.ping} ms` : null}</td></ConditionalRender>
            <ConditionalRender cond={cols.load}>
                <td className={classes.loadCol}>{info.load ? info.load[0].toFixed(2): null}</td>
                <td className={classes.loadCol}>{info.load ? info.load[1].toFixed(2): null}</td>
                <td className={classes.loadCol}>{info.load ? info.load[2].toFixed(2): null}</td>
            </ConditionalRender>
            <ConditionalRender cond={cols.memory}><td style={{textAlign: 'right'}}>{info.memory ? `${info.memory.percent.toFixed(1)}%` : null}</td></ConditionalRender>
            <ConditionalRender cond={cols.uptime}><td>{info.uptime ? moment.duration(info.uptime * 1000).humanize() : null}</td></ConditionalRender>
        </tr>
    }

    return (
        <WidgetFrame config={config} dashboardConfig={dashboardConfig}>
            <div className={classes.body}>
                <table>
                    <thead>
                        <tr>
                            <ConditionalRender cond={cols.name}><th colSpan={3}>Name</th></ConditionalRender>
                            <ConditionalRender cond={cols.ping}><th>Ping</th></ConditionalRender>
                            <ConditionalRender cond={cols.load}><th colSpan={3}>Load</th></ConditionalRender>
                            <ConditionalRender cond={cols.memory}><th>Mem</th></ConditionalRender>
                            <ConditionalRender cond={cols.uptime}><th>Uptime</th></ConditionalRender>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(settings.servers).sort((s1, s2) => s1.rank - s2.rank).map(renderRow)}
                    </tbody>
                </table>
            </div>
            <WidgetMenu id={config.id} onBeforeSubmit={onBeforeSettingsSubmit} settings={config.settings} settingsFormFields={[{
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
                    options: Object.keys(countries).map(code => ({value: code, label: countries[code]}))
                } as FormSelectFieldDescriptor ,{
                    name: 'systemStatusServerPort',
                    label: 'Status port',
                    default: 35280,
                }]
            } as FormListFieldDescriptor, {
                type: 'checkboxList',
                name: 'columns',
                label: 'Columns',
                options: [
                    {value: 'name', label: 'Name'},
                    {value: 'ping', label: 'Ping'},
                    {value: 'load', label: 'Load'},
                    {value: 'memory', label: 'Memory'},
                    {value: 'uptime', label: 'Uptime'},
                ]
            } as FormCheckboxListFieldDescriptor ]} />
        </WidgetFrame>
    )
});
