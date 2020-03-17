import React, { Component } from 'react';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import 'react-table/react-table.css';
import TrashSVG from '../../../images/trash.svg';
import Loading from '../utils/Loading';
import { withAlert } from "react-alert";

class Users extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      pages: null,
      loading: true,
      removingUser: 0
    }

    this.fetchData = this.fetchData.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  fetchData(state, instance) {
    this.setState({ loading: true });
    axios.post(`/web-api/user/filter`, {
      pageSize: state.pageSize,
      page: state.page + 1,
      sorted: state.sorted,
      filtered: state.filtered
    }).then(response => {
      this.setState({
        data: response.data.data,
        pages: response.data.meta.last_page,
        loading: false
      });
    })
    .catch(error => {
      console.log(error);
      console.log(error.response);
    })
  }

  removeUser(id) {
    if (this.state.removingUser === 0 && confirm('Are you sure you want to remove this user?')) {
      this.setState({removingUser: id});
      axios.delete(`/web-api/user/${id}`)
        .then(response => {
          this.setState({ removingUser: 0 });
          this.props.alert.success(response.data.info_message);
          this.refs.table.fireFetchData();
        })
        .catch(error => {
          this.props.alert.error(error.response.message);
        })
    }
  }

  render() {
    const { data, pages, loading } = this.state;
    const columns = [
    {
      Header: 'Name',
      accessor: 'name' // String-based value accessors!
    },
    // {
    //   Header: 'Company',
    //   accessor: 'company'
    // },
    // {
    //   id: 'channels', // Required because our accessor is not a string
    //   Header: 'Channels',
    //   accessor: data => {
    //     let output = [];
    //     _.map(data.channels, channel => {
    //       output.push(channel);
    //     });
    //     return output.join(', ');
    //   },
    // },
    {
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: 'Role',
      accessor: 'role',
      filterable: false,
      sortable: false
    },
    {
      accessor: 'id',
      filterable: false,
      sortable: false,
      maxWidth: 70,
      Cell: user => (
        <React.Fragment>
          {
            window.user.id !== user.row.id ?
            <button
              className="btn-remove"
              disabled={!!this.state.removingUser}
              style={{display: 'block', textAlign: 'center', width: '100%'}}
              onClick={()=> this.removeUser(user.row.id)}
            >
              {
                  this.state.removingUser === user.row.id &&
                  <Loading />
              }
              <span className="btn-text">
                <img src={TrashSVG} style={{margin: '0 auto'}} alt=""/>
              </span>
            </button> :
            <div style={{textAlign: 'center'}}>You</div>
          }
        </React.Fragment>
      )
    }
  ]

      
    return (
    <div className="main">
      <div className="scrollable container">
        <ReactTable
          ref="table"
          className="-striped"
          columns={columns}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={data}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          filterable
          defaultPageSize={10}
        />
        <div className="form-group">
          <Link className="btn" to="/create-user">Create new user</Link>
        </div>
      </div>
    </div>
    )
  }
}

export default withAlert(Users);