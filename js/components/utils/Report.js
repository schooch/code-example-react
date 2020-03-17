import React from "react";
import Popup from "reactjs-popup";
import Loading from './Loading';
import { UserBlockContext } from '../Preview/context';

class Report extends React.Component {
  static contextType = UserBlockContext;

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      openReason: false,
      report: null,
      reason: null,
      serverSuccess: null,
      options: {
        comment: [
          {
            name: 'Report User',
            type: 'user'
          },
          {
            name: 'Report Comment',
            type: 'comment'
          },
          {
            name: 'Block User',
            type: 'block_user'
          }
        ],
        post: [
          {
            name: 'Report Post',
            type: 'post'
          }
        ]
      },
      reasons: [
        "It's sexually inappropriate",
        "It's violent or prohibited content",
        "It's offensive",
        "It's misleading or a scam",
        "I disagree with it",
        "It's a false news story",
        "It's spam",
        "Something else",
      ],
      style: {
        width: '300px',
        border: '0',
        padding: '20px'
      }
    }

    this.openReasonPopup = this.openReasonPopup.bind(this)
    this.closePopup = this.closePopup.bind(this)
    this.setReason = this.setReason.bind(this)
    this.submit = this.submit.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openReasonPopup(close, report) {
    const { blocked_user } = this.props.content;
    if (blocked_user && report.type === 'block_user') {
      axios.post('/api/user/block', {
        blocked_user
      })
        .then(res => {
          this.context.resetComments();
          close();
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      close();
      this.setState({ openReason: true, report });
    }
  }

  closePopup() {
    this.setState({ openReason: false })
  }

  setReason(reason) {
    this.setState({reason})
  }

  closeModal() {
    setTimeout(() => {
      this.setState({ openReason: false })
    }, 2000);
  }


  submit() {
    this.setState({ loading: true });
    let { sender, id } = this.props.content;
    const { report, reason }  = this.state;

    axios.post('/api/report', {
      sender,
      id,
      type: report.type,
      reason
    })
      .then(response => {
        this.setState({ loading: false, serverSuccess: true });
        this.closeModal();
      })
      .catch(err => {
        this.setState({ serverSuccess : false })
        this.closeModal();
      })
  }

  render() {
    const { comment, post } = this.state.options;
    const { reasons, reason, report, style, loading, serverSuccess } = this.state;
    return (
      <React.Fragment>
        <Popup trigger={<button className="btn-dots"></button>} modal closeOnDocumentClick contentStyle={style} onClose={() => { this.setState({ openReason: false, reason: null, report: null, serverSuccess: null }) }}>
          {close => (
            <React.Fragment>
              <div className="report-options">
                {
                  this.props.post ?
                    post.map(option =>
                      <button className="report-option" key={option.type} onClick={() => { this.openReasonPopup(close, option) }}>{option.name}</button>
                    )
                    :
                    comment.map(option => 
                      {
                        if(option.type !== 'block_user' || this.props.content.blocked_user) {
                         return <button className="report-option" key={option.type} onClick={() => { this.openReasonPopup(close, option) }}>{option.name}</button>
                        }
                      }
                    )
                    
                }
              </div>
              <button className="report-close" onClick={() => close()}>Close</button>
            </React.Fragment>
          )}
        </Popup>
        <Popup modal closeOnDocumentClick open={this.state.openReason} onClose={() => { this.setState({ openReason: false, reason: null, report: null, serverSuccess: null }) }} contentStyle={style}>
          <React.Fragment>
            {
              reason && report ?
              <React.Fragment>
                <div className="report-head">{report.name}</div>
                <div className="report-head">Reason: {reason}</div>
                <React.Fragment>
                  {
                    serverSuccess ?
                    <div>Success</div>
                    : serverSuccess === false ?
                    <div>Server error</div> :
                    <button className="report-submit" disabled={loading} onClick={() => this.submit()}>
                      {
                        loading &&
                        <Loading fill="#4dc045" />
                      }
                      <span className="btn-text">Submit</span>
                    </button>
                  }
                </React.Fragment>
              </React.Fragment> :
              <div>
                <div className="report-header">Why is it inappropriate?</div>
                <div className="report-options">
                  {
                    reasons.map(option =>
                      <button className="report-option" key={option} onClick={() => { this.setReason(option) }}>{option}</button>
                    )
                  }
                </div>
              </div>
            }
          </React.Fragment>
        </Popup>
      </React.Fragment>
    )
  }
}

export default Report;