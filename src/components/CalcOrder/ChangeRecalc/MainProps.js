
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DataField from 'metadata-react/DataField';
import TabularSection from 'metadata-react/TabularSection';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  group: {
    alignItems: 'flex-end',
    paddingBottom: theme.spacing(),
  },
  synonim: {
    paddingBottom: theme.spacing(),
    width: 180,
  },
  switch: {
    width: 170,
  }
});

function PropFld({classes, checked, handleChange, dp, fld, title}) {
  return <FormGroup row className={classes.group}>
    <Typography className={classes.synonim}>{title}</Typography>
    <FormControlLabel
      className={classes.switch}
      control={<Switch checked={checked} onChange={handleChange} name={fld} />}
      label={checked ? 'Установить' : 'Не изменять'}
    />
    <DataField _obj={dp} _fld={fld} read_only={!checked} />
  </FormGroup>;
}

PropFld.propTypes = {
  classes: PropTypes.object,
  checked: PropTypes.bool,
  handleChange: PropTypes.func,
  dp: PropTypes.object,
  fld: PropTypes.string,
  title: PropTypes.string,
};

class MainProps extends React.Component {

  constructor({dp}) {
    super();
    this.state = {
      sys: dp.use_sys,
      inset: dp.use_inset,
      clr: dp.use_clr,
    };

    const {production, sys, clr, sys_furn, inset} = dp;
    production.forEach((row) => {
      if(!row.use) {
        return;
      }
      const {characteristic} = row;
      if(sys.empty() && !characteristic.sys.empty()) {
        dp.sys = characteristic.sys;
      }
      if(clr.empty()) {
        characteristic.coordinates.find_rows({elm_type: $p.enm.elm_types.Рама}, (row) => {
          if(!row.clr.empty()) {
            dp.clr = row.clr;
            return false;
          }
        });
      }
      // добавляем фурнитуры в табчасть
      characteristic.constructions.forEach((row) => {
        if(!row.furn.empty()) {
          if(!sys_furn.find({elm1: row.furn})) {
            sys_furn.add({elm1: row.furn});
          }
        }
      });
      if(inset.empty()) {
        characteristic.glasses.find_rows({is_sandwich: false}, ({elm}) => {
          const row = characteristic.coordinates.find({elm});
          if(row) {
            dp.inset = row.inset;
            return false;
          }
        });
      }
    });
  }

  handleChange = ({target}) => {
    this.setState({[target.name]: target.checked});
    this.props.dp[`use_${target.name}`] = target.checked;
  };

  render() {
    const {props: {dp, classes}, state, handleChange} = this;

    return <Grid container>
      <Grid item xs={12} lg={6}>
        <FormGroup>
          <PropFld classes={classes} checked={state.sys} handleChange={handleChange} dp={dp} fld="sys" title="Система профилей:"/>
          <PropFld classes={classes} checked={state.clr} handleChange={handleChange} dp={dp} fld="clr" title="Цвет:"/>
          <PropFld classes={classes} checked={state.inset} handleChange={handleChange} dp={dp} fld="inset" title="Заполнения:"/>
        </FormGroup>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Typography>Фурнитура:</Typography>
        <TabularSection
          _obj={dp}
          _tabular="sys_furn"
          denyAddDel
          hideToolbar
        />
      </Grid>
    </Grid>;
  }
}

export default withStyles(styles)(MainProps);

MainProps.propTypes = {
  dp: PropTypes.object,
  classes: PropTypes.object,
};
