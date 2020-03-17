import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Preview from '../Preview';
import { setWebview } from '../../actions/preview';
import { setChannel } from '../../actions/channels';
import { setPosts, resetPosts } from '../../actions/posts';
import Loading from '../utils/Loading';
import { isEmpty } from 'lodash';

class Post extends React.Component {
  constructor() {
    super();

    this.state = {
      showChannel: false
    }

    this.fetchChannel = this.fetchChannel.bind(this);
  }

  fetchChannel() {
    axios.get(`/api/channel/id/${this.props.match.params.id}`)
      .then(response => {
        this.props.setChannel(response.data);
        this.setState({ showChannel: true });
      })
      .catch(error => {
        const res = error.response
        console.log(error);
        console.log(res);
        if (res && res.data && res.data.redirect_url) {
          docoment.location = res.data.redirect_url;
        }
      })
  }

  componentWillMount() {
    if (isEmpty(this.props.channel)) {
      this.fetchChannel();
    } else {
      this.setState({ showChannel: true });
    }
  }

  componentWillUnmount() {
    this.setState({ showChannel: false });
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.showChannel ?
          <Preview />
          :
          <div className="preview-loading">
            <Loading />
          </div>
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  channel: state.channel
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setWebview,
    setChannel,
    setPosts,
    resetPosts
  }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(Post);