import {createStyles, withStyles, WithStyles} from '@material-ui/core';
import * as React from "react";
import {CommonWidgetProps, BaseWidgetSettings, Chromecast} from "../types";
import WidgetFrame from "../containers/WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import useWebSocket from 'react-use-websocket';
import { convertKeysToCamelCase, WidgetStyle } from '../tools';
import { CSSProperties } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames = require('classnames');
import { IconName } from '@fortawesome/fontawesome-svg-core';

const styles = () => createStyles({
    root: {
        overflow: 'initial',
        '& .body': {
            height: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
        },
        '& .center': {
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        '& .panel': {
            margin: WidgetStyle.getRelativeSize(0.026).width,
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: WidgetStyle.getRelativeSize(0.02).width,
            borderRadius: 5,
        },
        '& .title': {
            fontSize: WidgetStyle.getRelativeSize(0.05).width,
        },
        '& .time': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        '& .icon': {
            marginRight: WidgetStyle.getRelativeSize(0.05).width,
            fontSize: WidgetStyle.getRelativeSize(0.09).width,
        },
        '& .current': {
            fontSize: WidgetStyle.getRelativeSize(0.11).width,
            marginRight: WidgetStyle.getRelativeSize(0.04).width,
        },
        '& .duration': {
            fontSize: WidgetStyle.getRelativeSize(0.06).width,
        },
    }
});

export class Settings extends BaseWidgetSettings {
    name: string = 'Olaf';
}

type ChromecastStatus = {
    media: Chromecast.Media,
    cast: Chromecast.Cast,
}

type AppProps = {
    status: ChromecastStatus,
}

function BackdropApp(props: AppProps) {
    return <div className="center">Backdrop...</div>;
}

type PanelProps = {
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
}

const Panel = (props: PanelProps) => {
    return (
        <div className={classNames('panel', props.className)} style={props.style}>
            {props.children}
        </div>
    )
}

const playerIcon: {[key in Chromecast.PlayerState]: IconName} = {
    PLAYING: 'play',
    BUFFERING: 'buffer',
    PAUSED: 'pause',
    IDLE: 'dot-circle',
    UNKNOWN: 'question',
}

function formatTimeDuration(s: number): string {
    s = Math.round(s);
    return (s-(s%=60))/60+(9<s?':':':0')+s
}

function SpotifyApp(props: AppProps) {
    const mediaMetadata = props.status.media.mediaMetadata as Chromecast.MediaMetaData.Spotify;

    return 'Spotify';
}

function LoadingApp(props: AppProps) {
    return <div className="center">Loading...</div>;
}

function InitializingApp(props: AppProps) {
    return <div className="center">Initializing...</div>;
}

type MediaAppProps = {
    title: string,
    subTitle: string,
    image: string,
    currentTime: number,
    duration: number,
    playerState: Chromecast.PlayerState,
}

type MediaLoadingScreenProps = {
    icon: IconName,
    color: string,
}

function MediaLoadingScreen(props: MediaLoadingScreenProps) {
    return <div className="center">
        <FontAwesomeIcon icon={{prefix: 'fab', iconName: props.icon}} style={{
            color: props.color,
            filter: 'drop-shadow(0px 0px 14px white)',
            fontSize: '9em',
        }} />
    </div>;
}

function MediaApp(props: MediaAppProps) {

    const {title, subTitle, image, currentTime, duration, playerState} = props;

    return (
        <div className="body" style={{backgroundImage: `url(${image})`}}>
            <Panel className="title">{title}</Panel>
            <Panel style={{fontSize: 20}}>{subTitle}</Panel>
            <Panel className="time">
                <FontAwesomeIcon icon={playerIcon[playerState]} className="icon" />
                <span className="current">{formatTimeDuration(currentTime)}</span>
                <span className="duration"> / {formatTimeDuration(duration)}</span>
            </Panel>
        </div>
    );
}

const mediaApps: {[s: string]: {loading: MediaLoadingScreenProps, data: (p: ChromecastStatus) => MediaAppProps}} = {
    YouTube: {
        loading: {
            icon: 'youtube',
            color: 'rgb(252, 42, 23)',
        },
        data: p => {
            const mediaMetadata = p.media.mediaMetadata as Chromecast.MediaMetaData.YouTube;
            return {
                title: mediaMetadata.title,
                subTitle: mediaMetadata.subtitle,
                image: mediaMetadata.images[0].url,
                currentTime: p.media.currentTime,
                duration: p.media.duration,
                playerState: p.media.playerState,
            }
        }
    }
}

const exampleData = {
    yt: '{"cast":{"isActiveInput":false,"isStandBy":true,"volumeLevel":1,"volumeMuted":false,"appId":"233637DE","displayName":"YouTube","namespaces":["urn:x-cast:com.google.cast.debugoverlay","urn:x-cast:com.google.cast.cac","urn:x-cast:com.google.cast.media","urn:x-cast:com.google.youtube.mdx"],"sessionId":"2d8a8880-5b00-4037-acc1-f9a79c69db3f","transportId":"2d8a8880-5b00-4037-acc1-f9a79c69db3f","statusText":"YouTube"},"media":{"currentTime":901.567,"contentId":"OSTZ4XHJE34","contentType":"x-youtube/video","duration":1303.961,"streamType":"BUFFERED","idleReason":null,"mediaSessionId":1454740611,"playbackRate":1,"playerState":"PLAYING","supportedMediaCommands":262147,"volumeLevel":1,"volumeMuted":false,"mediaCustomData":{},"mediaMetadata":{"metadataType":0,"title":"Worcester - Final Version","subtitle":"Flamu","images":[{"url":"https://i.ytimg.com/vi/OSTZ4XHJE34/hqdefault.jpg"}]},"subtitleTracks":{},"currentSubtitleTracks":[],"lastUpdated":"2019-08-27T19:21:36.901680"}}',
    bd: '{"cast":{"isActiveInput":false,"isStandBy":true,"volumeLevel":1,"volumeMuted":false,"appId":"E8C28D3C","displayName":"Backdrop","namespaces":["urn:x-cast:com.google.cast.debugoverlay","urn:x-cast:com.google.cast.cac","urn:x-cast:com.google.cast.sse","urn:x-cast:com.google.cast.remotecontrol"],"sessionId":"fa0fae95-dab2-4b63-9286-862e3e9cad9b","transportId":"fa0fae95-dab2-4b63-9286-862e3e9cad9b","statusText":""},"media":null}',
}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    const { config, classes, dashboardConfig } = props;

    // const [sendMessage, lastMessage, readyState] = useWebSocket(`ws://${window.location.host}/chromecast-proxy/${config.settings.name}`);
    // const data: ChromecastStatus = (readyState && lastMessage) ? convertKeysToCamelCase(JSON.parse(lastMessage.data)) : null;

    const data: ChromecastStatus = JSON.parse(exampleData.bd);

    // console.log(JSON.stringify(data))

    function renderApp() {
        if (data == null)
            return <InitializingApp status={data} />

        if (data.cast.appId == null)
            return <LoadingApp status={data} />

        const mediaApp = mediaApps[data.cast.displayName];

        if (mediaApp) {
            if (data.media == null || data.media.contentId == null)
                return <MediaLoadingScreen {...mediaApp.loading} />
            return <MediaApp {...mediaApp.data(data)} />
        }

        return <BackdropApp status={data} />
    }

    return (
        <WidgetFrame className={classes.root} config={config} dashboardConfig={dashboardConfig}>
            {renderApp()}
            <WidgetMenu id={config.id} settings={config.settings} settingsFormFields={[]} />
        </WidgetFrame>
    )
});
