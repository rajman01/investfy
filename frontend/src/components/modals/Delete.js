import React, { Component } from 'react';

class Delete extends Component {
    state = {
      id: null
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.delete(this.state);

    }

    // componentDidMount(){
    //    this.setState({
    //       id: this.props.id
    //     });
    // }

    componentDidUpdate(prevProps){
      if(this.props !== prevProps){
        this.setState({
          id: this.props.id
        });
      }
    }

    render() {
        return (
            <div className="modal fade" id={this.props.modalId} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{this.props.bigHeader}</h5>
                    <button type="button" class="btn-close ml-2" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <h6>{this.props.header}</h6>
                    <form onSubmit={this.onSubmit}>
                      <button type="submit" className="btn btn-danger">Yes</button>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}

export default Delete;
