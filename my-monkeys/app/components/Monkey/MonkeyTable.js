
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from "material-table";

import { withStyles } from '@material-ui/core/styles';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Refresh from '@material-ui/icons/RefreshOutlined';


import apiCall from '../../src/apiCall';

import Snackbar from '../Shared/Snackbar';

const styles = theme => ({

});

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn,
  Refresh: Refresh,
};

class MonkeyTable extends Component {

    constructor(props) {
      super(props);
      this.state = {"name":"","alive":false,"age":0}
      this.state.snackbar = {
        variant: 'success',
        message: '',
      }
      this.state.docs = [];
      this.state.limit = 10;
      this.state.totalDocs = 0;
      this.state.offset = 0;
      // this.schema = {"name":{"type":"String","default":""},"alive":{"type":"Boolean","default":false},"age":{"type":"Number","default":false}}
      this.tableRef = React.createRef();

    }

    componentWillMount () {
      this.fetchData();
    }

    fetchData = async (query) => {
      if (!query) query = {};
      query.limit = query.pageSize || 10;
      const res = await apiCall({ url: 'monkeys', method: 'GET', params: query });

      // prevent arrays from blowing the page
      res.monkeys.docs = res.monkeys.docs.map((doc) => {
        const _doc = Object.assign({}, doc);
        Object.keys(_doc).forEach((key) => {
          if (Array.isArray(_doc[key])) _doc[key] = JSON.stringify(_doc[key]);
        });
        return _doc;
      })
      return {
        data: res.monkeys.docs,
        page: res.monkeys.offset / res.monkeys.limit,
        totalCount: res.monkeys.totalDocs,
      }
    }

    onSnackbarClose = (e) => {
      this.setState({ snackbar: { message: '', variant: 'info' }})
    }

    onRowAdd = async (newData) => {
      const res = await apiCall({ url: "monkey", method: 'POST', data: newData });
      if (!res.error) this.setState({ snackbar: { variant: 'success', message: 'Monkey Created.' }});
      else this.setState({ snackbar: { variant: 'error', message: res.error }});
    }
    onRowUpdate = async (newData, oldData) => {
      const res = await apiCall({ url: `monkey/${oldData._id}`, method: 'PUT', data: newData });
      if (!res.error) this.setState({ snackbar: { variant: 'success', message: 'Monkey Updated.' }});
      else this.setState({ snackbar: { variant: 'error', message: res.error }});
    }
    onRowDelete = async (oldData) => {
      const res = await apiCall({ url: `monkey/${oldData._id}`, method: 'DELETE', })
      if (!res.error) this.setState({ snackbar: { variant: 'success', message: 'Monkey Deleted.' }});
      else this.setState({ snackbar: { variant: 'error', message: res.error }});
    }

    render () {
      /*

      Cant edit / delete when selection: true

      https://github.com/mbrn/material-table/issues/648

      */


      const { classes } = this.props;
      const { snackbar, name, alive, age } = this.state;
      return (
        <div className={classes.container}>
          <div className={classes.table}>
            <div style={{ maxWidth: "100%" }}>
              <MaterialTable
                columns={[{"title":"Name","field":"name","type":"string","editable":"never"},{"title":"Alive","field":"alive","type":"boolean","editable":"never"},{"title":"Age","field":"age","type":"numeric","editable":"never"}]}
                data={this.fetchData}
                icons={tableIcons}
                title="Monkeys"
                options={{
                  filtering: true,
                  selection: false,
                  exportButton: true
                }}
                tableRef={this.tableRef}
                localization={{
                  body: {
                    editRow: {
                      deleteText: 'Delete this row?'
                    }
                  }
                }}
                editable={{
                  onRowAdd: this.onRowAdd,
                  onRowUpdate: this.onRowUpdate,
                  onRowDelete: this.onRowDelete,
                  isEditable: (rowData) => {
                    // console.log('ROWDATA', rowData)
                    // const areUnique = [];
                    // const columns = [{"title":"Name","field":"name","type":"string","editable":"never"},{"title":"Alive","field":"alive","type":"boolean","editable":"never"},{"title":"Age","field":"age","type":"numeric","editable":"never"}];
                    // console.log('COLUMNS', columns)
                    // columns.forEach((column) => column.readonly ? areUnique.push(column.field) : "");
                    // console.log('AREUNIQUE', areUnique)
                    return true;
                  },
                  isDeletable: () => true,
                 }}
                 actions={[
                   {
                     icon: Refresh,
                     tooltip: 'Refresh Data',
                     isFreeAction: true,
                     onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange(),
                   }
                 ]}
              />
            </div>
          </div>
          <Snackbar
            variant={snackbar.variant}
            message={snackbar.message}
            handleClose={this.onSnackbarClose}
          />
        </div>
      );
    }
  }

  MonkeyTable.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles, { withTheme: true })(MonkeyTable);
  