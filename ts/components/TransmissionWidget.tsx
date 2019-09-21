import {createStyles, withStyles, WithStyles, Hidden} from '@material-ui/core';
import * as React from "react";
import {CommonWidgetProps, BaseWidgetSettings, Transmission} from "../types";
import WidgetFrame from "../containers/WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import api from '../api';
import { useInterval } from './tools';
import { humanFileSize, WidgetStyle } from '../tools';
import moment = require('moment');


const styles = () => createStyles({
    body: {
        fontSize: WidgetStyle.getRelativeSize(0.025).width,
        '& .torrentList': {
            padding: 10,
            '& .torrent': {
                display: 'flex',
                '& > div': {
                    margin: '5px 10px',
                    whiteSpace: 'nowrap',
                },
            },
            '& .name': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
        }
    }
});


export class Settings extends BaseWidgetSettings {
    host: string = '';
    ssl: boolean = false;
    port: number = 9091;
    path: string = '/transmission/rpc';
    username: string = '';
    password: string = '';

    get url(): string {
        return `http${this.ssl ? 's' : ''}://${this.host}:${this.port}${this.path}`;
    }
}

function TorrentList(props: {torrents: Array<Transmission.Torrent>}) {

    function Torrent(props: {data: Transmission.Torrent}) {
        const {id, name, percentDone, rateDownload, eta} = props.data;
        return (
            <div className="torrent">
                <div className="name">{name}</div>
                <div className="percent">{Math.round(percentDone*100)}%</div>
                <div className="rate">{humanFileSize(rateDownload)}/s</div>
                <div className="eta">{moment.duration(eta * 1000).humanize()}</div>
            </div>
        );
    }

    return (
        <div className="torrentList">
            {props.torrents.filter(t => t.percentDone != 1).map(t => <Torrent key={t.id} data={t} />)}
        </div>
    );
}

function Error(props: {msg: string}) {
    return <div>{props.msg}</div>
}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    const { config, config: {id, settings}, classes, dashboardConfig } = props;

    const [data, setData] = React.useState<Transmission.ApiResponse>();

    function fetchData(cfg: Settings = settings) {
        api.transmission(cfg.url, cfg.username, cfg.password).then(setData);
    }

    useInterval(fetchData, 5*1000);

    React.useEffect(fetchData, []);

    return (
        <WidgetFrame config={config} dashboardConfig={dashboardConfig} >
            <div className={classes.body}>
                {data ? (typeof data.data == 'string' ? <Error msg={data.data} /> : <TorrentList torrents={data.data.torrents} />) : ''}
            </div>
            <WidgetMenu id={id} settings={settings} settingsFormFields={[
                {name: 'host',label: 'Host'},
                {name: 'ssl', label: 'SSL'},
                {name: 'port', label: 'Port'},
                {name: 'path', label: 'Path'},
                {name: 'username', label: 'Username'},
                {name: 'password', label: 'Password'}
            ]} />
        </WidgetFrame>
    )
});

