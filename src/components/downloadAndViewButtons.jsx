import React, { Component } from "react";

class DownloadAndViewButtons extends Component {
  state = {};
  render() {
    return (
      <div className="download-and-view view-only">
        {this.props.view && (
          <button
            className="btn-as-span"
            onClick={this.props.onView}
            style={{ borderRight: "1px solid #e7e7ee" }}
          >
            <svg width="24" height="26" fill="none">
              <use href="#f-eye-grey"></use>
            </svg>
            View
          </button>
        )}
        <button className="btn-as-span" onClick={this.props.onDownload}>
          <svg width="24" height="24" fill="none">
            <use href="#f-simple-download"></use>
          </svg>
          Download
        </button>
      </div>
    );
  }
}

export default DownloadAndViewButtons;
