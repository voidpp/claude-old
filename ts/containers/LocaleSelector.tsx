import { Button, Menu, MenuItem, ListItemIcon } from "@material-ui/core";
import * as React from "react";
import { connect, useStore } from 'react-redux';
import { setLocale } from '../actions';
import { claudeLocales, LocaleType } from "../locales";
import { State } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormattedMessage } from "react-intl";

export type StateProps = {
    locale: LocaleType,
}

function LocaleSelector(props: StateProps) {
    const {locale} = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const store = useStore()

    function openMenu(event) {
        setAnchorEl(event.currentTarget);
    }

    function closeMenu() {
        setAnchorEl(null);
    }

    function chooseMenu(val: LocaleType) {
        store.dispatch(setLocale(val))
        closeMenu()
    }

    return (
        <React.Fragment>
            <Button aria-controls="LocaleSelector" aria-haspopup="true" variant="contained" size="small" color="primary" onClick={openMenu}>
                <FormattedMessage id="controlBar.language" />
            </Button>
            <Menu id="LocaleSelector" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
                {Object.entries(claudeLocales).map(([name, localeData]) =>
                    <MenuItem key={name} onClick={chooseMenu.bind(this, name)}>
                        <ListItemIcon>
                            {name == locale ? <FontAwesomeIcon icon="check" /> : <span />}
                        </ListItemIcon>
                        {localeData.title}
                    </MenuItem>
                )}
            </Menu>
        </React.Fragment>
    )
}

function mapStateToProps(state: State): StateProps {
    const { locale } = state;
    return {
        locale,
    }
}

export default connect<StateProps>(mapStateToProps)(LocaleSelector);

