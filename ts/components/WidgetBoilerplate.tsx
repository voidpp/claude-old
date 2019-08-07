import {createStyles, withStyles, WithStyles} from '@material-ui/core';
import * as React from "react";
import {CommonWidgetProps} from "../types";
import WidgetFrame from "./WidgetFrame";
import WidgetMenu from "./WidgetMenu";

const styles = () => createStyles({
    body: {

    }
});


export type Settings = {

}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    const { config, classes, stepSize, updateWidgetConfig } = props;

    return (
        <WidgetFrame config={config} stepSize={stepSize} updateWidgetConfig={updateWidgetConfig}>
            <div className={classes.body}>
                das widget body
            </div>
            <WidgetMenu id={config.id} settings={config.settings} settingsFormFields={[]} />
        </WidgetFrame>
    )
});
